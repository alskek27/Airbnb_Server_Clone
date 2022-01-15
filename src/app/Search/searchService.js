const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/database");
const searchProvider = require("./searchProvider");
const searchDao = require("./searchDao");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

// Service: Create, Update, Delete 비즈니스 로직 처리

exports.insertSearch = async function(userId, location, checkIn, checkOut, adults, children, infants, pets) {
    const connection = await pool.getConnection(async (conn) => conn);
    try {
        const searchInfoParams = [userId, location, checkIn, checkOut, adults, children, infants, pets];
        const checkSearchInfo = await searchProvider.checkSearchInfo(searchInfoParams);
        await connection.beginTransaction();

        if (checkSearchInfo.length > 0) {
            const updateSearchResult = await searchDao.updateSearchInfo(connection, checkSearchInfo[0].searchId);
            await connection.commit();

            return response(baseResponse.SUCCESS, {"searchId": checkSearchInfo[0].searchId});
        } else {
            const insertSearchResult = await searchDao.insertSearchInfo(connection, searchInfoParams);
            await connection.commit();

            return response(baseResponse.SUCCESS, {"searchId": insertSearchResult[0].insertId});
        }
    } catch (err) {
        await connection.rollback();
        logger.error(`App - insertSearch Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    } finally {
        connection.release();
    }
};