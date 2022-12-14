const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const roomDao = require("./roomDao");

// Provider: Read 비즈니스 로직 처리

exports.selectRoomList = async function (location) {
    const connection = await pool.getConnection(async (conn) => conn);
    const selectRoomListResult = await roomDao.selectRoomList(connection, location);
    connection.release();

    return selectRoomListResult;
};

exports.checkRoomLikesStatus = async function (userIdFromJWT) {
    const connection = await pool.getConnection(async (conn) => conn);
    const checkRoomLikesStatusResult = await roomDao.checkRoomLikesStatus(connection, userIdFromJWT);
    connection.release();

    return checkRoomLikesStatusResult;
};

exports.selectRoomImages = async function (roomId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const roomImagesResult = await roomDao.selectRoomImages(connection, roomId);
    connection.release();

    return roomImagesResult;
};

exports.selectRoomContents = async function (roomId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const roomContentsResult = await roomDao.selectRoomContents(connection,roomId);
    connection.release();

    return roomContentsResult;
};

exports.checkRoomLikesByRoomId = async function (userIdFromJWT, roomId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const checkRoomLikesByRoomIdResult = await roomDao.checkRoomLikesByRoomId(connection, userIdFromJWT, roomId);
    connection.release();

    return checkRoomLikesByRoomIdResult;
};

exports.selectRoomHostInfo = async function (roomId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const roomHostInfoResult = await roomDao.selectRoomHostInfo(connection, roomId);
    connection.release();

    return roomHostInfoResult;
};

exports.selectReviewGrade = async function (roomId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const reviewGradeResult = await roomDao.selectReviewGrade(connection, roomId);
    connection.release();

    return reviewGradeResult;
};

exports.selectRoomReviews = async function (roomId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const roomReviewsResult = await roomDao.selectRoomReviews(connection, roomId);
    connection.release();

    return roomReviewsResult;
};

exports.checkRoom = async function (roomId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const checkRoomResult = await roomDao.checkRoom(connection, roomId);
    connection.release();

    return checkRoomResult;
};

exports.checkRoomLike = async function (userIdFromJWT, wishId, roomId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const checkRoomLikeResult = await roomDao.checkRoomLike(connection, userIdFromJWT, wishId, roomId);
    connection.release();

    return checkRoomLikeResult;
};

exports.selectReservationList = async function (userIdFromJWT) {
    const connection = await pool.getConnection(async (conn) => conn);
    const selectReservationListResult = await roomDao.selectReservationList(connection, userIdFromJWT);
    connection.release();

    return selectReservationListResult;
};

exports.checkReservation = async function (userIdFromJWT, roomId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const checkReservationResult = await roomDao.checkReservation(connection, userIdFromJWT, roomId);
    connection.release();

    return checkReservationResult;
};