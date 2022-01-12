const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const searchDao = require("./searchDao");

// Provider: Read 비즈니스 로직 처리

exports.checkSearchInfo = async function (searchInfoParams) {
    const connection = await pool.getConnection(async (conn) => conn);
    const checkSearchInfoResult = await searchDao.checkSearchInfo(connection, searchInfoParams);
    connection.release();

    return checkSearchInfoResult;
};

exports.selectSearch = async function (userIdFromJWT) {
    const connection = await pool.getConnection(async (conn) => conn);
    const selectSearchResult = await searchDao.selectSearch(connection, userIdFromJWT);
    connection.release();

    return selectSearchResult;
};