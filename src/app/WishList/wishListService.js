const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/database");
const wishListProvider = require("./wishListProvider");
const wishListDao = require("./wishListDao");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");
const {check} = require("../User/userController");

// Service: Create, Update, Delete 비즈니스 로직 처리

exports.insertWishList = async function(userIdFromJWT, listName) {
    const connection = await pool.getConnection(async (conn) => conn);
    try {
        const insertWishListResult = await wishListDao.insertWishList(connection, userIdFromJWT, listName);
        return response(baseResponse.SUCCESS, {"wishId": insertWishListResult[0].insertId});
    } catch (err) {
        logger.error(`App - insertWishList Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    } finally {
        connection.release();
    }
};

exports.updateWishList = async function(listName, userIdFromJWT, wishId) {
    const connection = await pool.getConnection(async (conn) => conn);
    try {
        const checkWishList = await wishListProvider.checkWishList(wishId);
        if (checkWishList.length < 1) return errResponse(baseResponse.WISHLISTS_NOT_EXITS); // 3007 : 해당 위시리스트가 존재하지 않습니다.
        if (checkWishList[0].userId !== userIdFromJWT) return errResponse(baseResponse.NOT_WISHLIST_USER); // 3008 : 해당 계정의 위시리스트가 아닙니다.

        const updateWishListResult = await wishListDao.updateWishList(connection, listName, userIdFromJWT, wishId);
        return response(baseResponse.SUCCESS, updateWishListResult[0].info);
    } catch (err) {
        logger.error(`App - updateWishList Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    } finally {
        connection.release();
    }
};

exports.deleteWishList = async function(userIdFromJWT, wishId) {
    const connection = await pool.getConnection(async (conn) => conn);
    try {
        const checkWishList = await wishListProvider.checkWishList(wishId);
        if (checkWishList.length < 1) return errResponse(baseResponse.WISHLISTS_NOT_EXITS); // 3007 : 해당 위시리스트가 존재하지 않습니다.
        if (checkWishList[0].userId !== userIdFromJWT) return errResponse(baseResponse.NOT_WISHLIST_USER); // 3008 : 해당 계정의 위시리스트가 아닙니다.

        await connection.beginTransaction();

        const deleteWishListResult = await wishListDao.deleteWishList(connection, userIdFromJWT, wishId);
        await connection.commit();

        const deleteWishListRooms = await wishListDao.deleteWishListRooms(connection, wishId);
        await connection.commit();

        return response(baseResponse.SUCCESS, deleteWishListResult[0].info);

    } catch (err) {
        await connection.rollback();
        logger.error(`App - updateWishList Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    } finally {
        connection.release();
    }
};