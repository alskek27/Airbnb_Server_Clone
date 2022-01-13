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

exports.selectRoomImages = async function (roomId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const roomImagesResult = await roomDao.selectRoomImages(connection, roomId);
    connection.release();

    return roomImagesResult;
};

exports.selectRoomContents = async function (roomId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const roomContentsResult = await roomDao.selectRoomContents(connection, roomId);
    connection.release();

    return roomContentsResult;
};

exports.selectRoomAmenities = async function (roomId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const roomAmenitiesResult = await roomDao.selectRoomAmenities(connection, roomId);
    connection.release();

    return roomAmenitiesResult;
}

exports.selectRoomReviews = async function (roomId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const roomReviewsResult = await roomDao.selectRoomReviews(connection, roomId);
    connection.release();

    return roomReviewsResult;
};

exports.selectRoomlocation = async function (roomId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const roomLocationResult = await roomDao.selectRoomLocation(connection, roomId);
    connection.release();

    return roomLocationResult;
};

exports.selectRoomHostInfo = async function (roomId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const roomHostInfoResult = await roomDao.selectRoomHostInfo(connection, roomId);
    connection.release();

    return roomHostInfoResult;
};