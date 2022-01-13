// 검색 기록 등록
async function insertSearchInfo(connection, searchInfoParams) {
    const insertSearchInfoQuery = `
            INSERT INTO Search(userId, location, checkIn, checkOut, adults, children, infants, pets)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?);
    `;
    const insertSearchInfoRow = await connection.query(
        insertSearchInfoQuery,
        searchInfoParams
    );

    return insertSearchInfoRow;
}

// 검색 기록 체크
async function checkSearchInfo(connection, searchInfoParams) {
    const checkSearchInfoQuery = `
        SELECT searchId, location, checkIn, checkOut, adults, children, infants, pets
        FROM Search
        WHERE userId = ?
          AND location = ?
          AND checkIn = ?
          AND checkOut =?
          AND adults = ?
          AND children = ?
          AND infants = ?
          AND pets = ?;
    `;
    const checkSearchInfoRow = await connection.query(
        checkSearchInfoQuery,
        searchInfoParams
    );

    return checkSearchInfoRow[0];
}

// 검색 시간 갱신
async function updateSearchInfo(connection, searchId) {
    const updateSearchInfoQuery = `
        UPDATE Search
        SET updatedAt = now()
        WHERE searchId = ?;
    `;
    const checkSearchInfoRow = await connection.query(
        updateSearchInfoQuery,
        searchId
    );

    return checkSearchInfoRow[0];
}

// 검색 기록 조회
async function selectSearch(connection, userIdFromJWT) {
    const selectSearchQuery = `
        SELECT searchId, location,
               DATE_FORMAT(checkIn, '%Y-%m-%d') AS checkIn,
               DATE_FORMAT(checkOut, '%Y-%m-%d') AS checkOut,
               adults,
               children,
               infants,
               pets
        FROM Search
        WHERE userId = ?
        ORDER BY updatedAt desc;
    `;
    const [selectSearchRow] = await connection.query(
        selectSearchQuery,
        userIdFromJWT
    );

    return selectSearchRow;
}


module.exports = {
    insertSearchInfo,
    checkSearchInfo,
    updateSearchInfo,
    selectSearch
};