const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/database");
const roomProvider = require("./roomProvider");
const wishListProvider = require("../WishList/wishListProvider")
const roomDao = require("./roomDao");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");
const {check} = require("../User/userController");

// Service: Create, Update, Delete 비즈니스 로직 처리

exports.insertRoomLike = async function(userIdFromJWT, wishId, roomId) {
    const connection = await pool.getConnection(async (conn) => conn);
    try {
        let status;
        const checkRoom = await roomProvider.checkRoom(roomId);
        if (checkRoom.length < 1) return errResponse(baseResponse.ROOM_NOT_EXIST); // 3006 : 해당 숙소가 존재하지 않습니다.

        const checkWishList = await wishListProvider.checkWishList(wishId);
        if (checkWishList.length < 1) return errResponse(baseResponse.WISHLISTS_NOT_EXITS); // 3007 : 해당 위시리스트가 존재하지 않습니다.
        if (checkWishList[0].status === 'DELETE') return errResponse(baseResponse.WISHLISTS_NOT_EXITS); // 3007 : 해당 위시리스트가 존재하지 않습니다.
        if (checkWishList[0].userId !== userIdFromJWT) return errResponse(baseResponse.NOT_WISHLIST_USER); // 3008 : 해당 계정의 위시리스트가 아닙니다.

        const checkRoomLike = await roomProvider.checkRoomLike(userIdFromJWT, wishId, roomId);
        await connection.beginTransaction();

        if (checkRoomLike.length < 1) {
            const insertRoomLikeResult = await roomDao.insertRoomLike(connection, wishId, roomId);
            await connection.commit();

            return response(baseResponse.SUCCESS, insertRoomLikeResult[0].insertId);
        } else {
            if (checkRoomLike[0].status === 'ACTIVE') status = 'INACTIVE';
            else if (checkRoomLike[0].status === 'INACTIVE') status = 'ACTIVE';

            const updateRoomLikeResult = await roomDao.updateRoomLike(connection, status, roomId);
            await connection.commit();

            return response(baseResponse.SUCCESS, updateRoomLikeResult[0].info);
        }
    } catch (err) {
        await connection.rollback();
        logger.error(`App - insertRoomLike Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    } finally {
        connection.release();
    }
};