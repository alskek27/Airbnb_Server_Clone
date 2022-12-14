const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/database");
const roomProvider = require("./roomProvider");
const userProvider = require("../User/userProvider");
const wishListProvider = require("../WishList/wishListProvider")
const roomDao = require("./roomDao");
const userDao = require("../User/userDao");
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

        if (checkRoomLike.length < 1) { // 숙소 찜하기
            const insertRoomLikeResult = await roomDao.insertRoomLike(connection, wishId, roomId);
            await connection.commit();

            return response(baseResponse.SUCCESS, insertRoomLikeResult[0].insertId);
        } else { // 숙소 찜 상태 변경
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

exports.insertReservation = async function(roomId, checkIn, checkOut, adults, children, infants, pets, userIdFromJWT) {
    const connection = await pool.getConnection(async (conn) => conn);
    try {
        const checkRoom = await roomProvider.checkRoom(roomId);
        if (checkRoom.length < 1) return errResponse(baseResponse.ROOM_NOT_EXIST); // 3006 : 해당 숙소가 존재하지 않습니다.
        if (checkRoom[0].userId === userIdFromJWT) return errResponse(baseResponse.ROOM_HOST_USER); // 3009 : 호스트는 자신의 숙소를 예약할 수 없습니다.
        if (checkRoom[0].maxPeople < (adults + children)) return errResponse(baseResponse.MAX_PEOPLE_EXCEED); // 3010 : 최대 숙박 인원을 초과하였습니다.

        const checkReservation = await roomProvider.checkReservation(userIdFromJWT, roomId);
        if (checkReservation[0].checkIn === checkIn && checkReservation[0].checkOut === checkOut)
            return errResponse(baseResponse.RESERVATION_EXIST); // 3012 : 이미 예약된 숙소입니다.

        const startDate = new Date(checkIn);
        const endDate = new Date(checkOut);
        const dateDiff = Math.ceil((endDate.getTime() - startDate.getTime())/(1000*3600*24)); // 숙박일 계산
        const totalCharge = (checkRoom[0].roomCharge * dateDiff); // 총 숙박비

        const insertReservationInfoParams = [
            userIdFromJWT, roomId, checkIn, checkOut, adults, children, infants, pets, totalCharge
        ];

        const insertReservationResult = await roomDao.insertReservation(connection, insertReservationInfoParams);

        return response(baseResponse.SUCCESS, { "reservationId": insertReservationResult[0].insertId});

    } catch (err) {
        logger.error(`App - insertReservation Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    } finally {
        connection.release();
    }
};

exports.deleteRoomReservation = async function(userIdFromJWT, roomId) {
    const connection = await pool.getConnection(async (conn) => conn);
    try {
        const checkReservation = await roomProvider.checkReservation(userIdFromJWT, roomId);
        if (checkReservation.length < 1) return errResponse(baseResponse.RESERVATION_NOT_EXIST); // 3011 : 예약 정보가 존재하지 않습니다.
        if (checkReservation[0].status === 'DELETE') return errResponse(baseResponse.RESERVATION_NOT_EXIST); // 3011 : 예약 정보가 존재하지 않습니다.

        const deleteReservationResult = await roomDao.deleteReservation(connection, userIdFromJWT, roomId);

        return response(baseResponse.SUCCESS, deleteReservationResult[0].info);

    } catch (err) {
        logger.error(`App - deleteReservation Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    } finally {
        connection.release();
    }
};

exports.insertRoom = async function(userIdFromJWT, buildingType, roomType, placeType, location, maxPeople, bedroomNum, bedNum, bathroomNum, title, description, roomCharge, minDay) {
    const connection = await pool.getConnection(async (conn) => conn);
    try {
        await connection.beginTransaction();

        const checkHost = await userProvider.checkHost(userIdFromJWT);
        if (checkHost[0].mode == '게스트') {
            const changeMode = await userDao.changeMode(connection, userIdFromJWT);
            await connection.commit();
        }

        const insertRoomTypeParams = [buildingType, roomType, placeType];
        const insertRoomType = await roomDao.insertRoomType(connection, insertRoomTypeParams);
        await connection.commit();

        const insertRoomInfoParams = [userIdFromJWT, insertRoomType[0].insertId, title, description, maxPeople, bedroomNum, bedNum, bathroomNum, location, roomCharge, minDay];
        const insertRoom = await roomDao.insertRoom(connection, insertRoomInfoParams);
        await connection.commit();

        return response(baseResponse.SUCCESS, {"roomId": insertRoom[0].insertId});

    } catch (err) {
        await connection.rollback();
        logger.error(`App - insertRoom Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    } finally {
        connection.release();
    }
};

exports.updateRoom = async function(userIdFromJWT, roomId, buildingType, roomType, placeType, location, maxPeople, bedroomNum, bedNum, bathroomNum, title, description, roomCharge, minDay) {
    const connection = await pool.getConnection(async (conn) => conn);
    try {
        await connection.beginTransaction();

        const checkRoom = await roomProvider.checkRoom(roomId);
        if (checkRoom.length < 1 || checkRoom[0].status == 'DELETE') return errResponse(baseResponse.ROOM_NOT_EXIST); // 3006 : 해당 숙소가 존재하지 않습니다.
        if (checkRoom[0].userId != userIdFromJWT) return errResponse(baseResponse.NOT_ROOM_HOST_USER); // 3014 : 숙소의 호스트가 아닙니다.

        const updateRoomTypeParams = [buildingType, roomType, placeType, checkRoom[0].typeId];
        const updateRoomType = await roomDao.updateRoomType(connection, updateRoomTypeParams);
        await connection.commit();

        const updateRoomInfoParams = [checkRoom[0].typeId, title, description, maxPeople, bedroomNum, bedNum, bathroomNum, location, roomCharge, minDay, roomId];
        const updateRoom = await roomDao.updateRoom(connection, updateRoomInfoParams);
        await connection.commit();

        return response(baseResponse.SUCCESS, updateRoom[0].info);

    } catch (err) {
        await connection.rollback();
        logger.error(`App - updateRoom Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    } finally {
        connection.release();
    }
};

exports.deleteRoom = async function(userIdFromJWT, roomId) {
    const connection = await pool.getConnection(async (conn) => conn);
    try {
        const checkRoom = await roomProvider.checkRoom(roomId);
        if (checkRoom.length < 1 || checkRoom[0].status == 'DELETE') return errResponse(baseResponse.ROOM_NOT_EXIST); // 3006 : 해당 숙소가 존재하지 않습니다.
        if (checkRoom[0].userId != userIdFromJWT) return errResponse(baseResponse.NOT_ROOM_HOST_USER); // 3014 : 숙소의 호스트가 아닙니다.

        const deleteRoom = await roomDao.deleteRoom(connection, roomId);

        return response(baseResponse.SUCCESS, deleteRoom[0].info);

    } catch (err) {
        logger.error(`App - updateRoom Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    } finally {
        connection.release();
    }
};