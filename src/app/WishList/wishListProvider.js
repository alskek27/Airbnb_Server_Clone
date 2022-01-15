const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const wishListDao = require("./wishListDao");

// Provider: Read 비즈니스 로직 처리

exports.checkWishList = async function (wishId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const checkWishListResult = await wishListDao.checkWishList(connection, wishId);
    connection.release();

    return checkWishListResult;
};

exports.selectWishLists = async function (userIdFromJWT) {
    const connection = await pool.getConnection(async (conn) => conn);
    const wishListsResult = await wishListDao.selectWishLists(connection, userIdFromJWT);
    connection.release();

    return wishListsResult;
}

exports.selectWishList = async function (userIdFromJWT, wishId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const wishListResult = await wishListDao.selectWishList(connection, userIdFromJWT, wishId);
    connection.release();

    return wishListResult;
}