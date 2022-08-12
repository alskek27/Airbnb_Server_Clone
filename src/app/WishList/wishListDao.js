// 위시리스트 등록
async function insertWishList(connection, userIdFromJWT, listName) {
    const insertWishListQuery = `
            INSERT INTO WishList(userId, listName)
            VALUES (?, ?);
    `;
    const insertWishListRow = await connection.query(
        insertWishListQuery,
        [userIdFromJWT, listName]
    );

    return insertWishListRow;
}

// 위시리스트 체크
async function checkWishList(connection, wishId) {
    const checkWishListQuery = `
        SELECT userId, listName, status
        FROM WishList WHERE wishId = ?;
    `;
    const checkWishListRow = await connection.query(
        checkWishListQuery,
        wishId
    );

    return checkWishListRow[0];
}

// 내 위시리스트 조회
async function selectWishLists(connection, userIdFromJWT) {
    const selectWishListsQuery = `
        SELECT wishId,
               listName,
               IFNULL(DATE_FORMAT(checkIn, '%m월 %d일'), '') AS checkIn,
               IFNULL(DATE_FORMAT(checkOUT, '%m월 %d일'), '') AS checkOut
        FROM WishList
        WHERE userId = ? AND status = 'ACTIVE';
    `;
    const [selectWishListsRow] = await connection.query(
        selectWishListsQuery,
        userIdFromJWT
    );

    return selectWishListsRow;
}

// 위시리스트 상세 조회
async function selectWishList(connection, userIdFromJWT, wishId) {
    const selectWishListsQuery = `
        SELECT R.roomId,
               title,
               location,
               RT.type,
               RT.detail,
               maxPeople,
               bedroomNUM,
               bedNum,
               bathroomNum,
               Review.reviewGrade,
               Review.reviewCount,
               roomCharge,
               WM.status AS likeStatus
        FROM Room R
            INNER JOIN RoomType RT on R.typeId = RT.typeId
            INNER JOIN WishMapping WM on R.roomId = WM.roomId
            INNER JOIN WishList WL on WM.wishId = WL.wishId
            INNER JOIN (
                SELECT Review.roomId, ROUND(AVG((cleanlinessGrade + accuracyGrade + CommunicationGrade + locationGrade + checkInGrade + bestValueGrade) / 6), 2) reviewGrade, COUNT(reviewId) reviewCount
                FROM Review INNER JOIN Room R on Review.roomId = R.roomId GROUP BY R.roomId
            ) Review
        WHERE Review.roomId = R.roomId
          AND WM.status = 'ACTIVE'
          AND WL.userId = ?
          AND WM.wishId = ?;
    `;
    const [selectWishListsRow] = await connection.query(
        selectWishListsQuery,
        [userIdFromJWT, wishId]
    );

    return selectWishListsRow;
}

// 위시리스트 수정
async function updateWishList(connection, listName, userIdFromJWT, wishId) {
    const updateWishListQuery = `
        UPDATE WishList SET listName = ?
        WHERE userId = ? AND wishId = ?;
    `;
    const updateWishListRow = await connection.query(
        updateWishListQuery,
        [listName, userIdFromJWT, wishId]
    );

    return updateWishListRow;
}

// 위시리스트 삭제
async function deleteWishList(connection, userIdFromJWT, wishId) {
    const deleteWishListQuery = `
        UPDATE WishList SET status = 'DELETE'
        WHERE userId = ? AND wishId = ?;
    `;
    const deleteWishListRow = await connection.query(
        deleteWishListQuery,
        [userIdFromJWT, wishId]
    );

    return deleteWishListRow;
}

// 위시리스트 숙소 삭제
async function deleteWishListRooms(connection, wishId) {
    const deleteWishListRoomsQuery = `
        UPDATE WishMapping SET status = 'INACTIVE'
        WHERE wishId = ?;
    `;
    const deleteWishListRoomsRow = await connection.query(
        deleteWishListRoomsQuery,
        wishId
    );

    return deleteWishListRoomsRow;
}



module.exports = {
    insertWishList,
    checkWishList,
    selectWishLists,
    selectWishList,
    updateWishList,
    deleteWishList,
    deleteWishListRooms,
};