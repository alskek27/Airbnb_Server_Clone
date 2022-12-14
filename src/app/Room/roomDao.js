// 숙소 조회 (검색 결과)
async function selectRoomList(connection, location) {
    const selectRoomsQuery = `
        SELECT R.roomId,
               title,
               location,
               RT.type,
               RT.detail,
               maxPeople,
               bedroomNum,
               bedNum,
               bathroomNum,
               Amenity.amenities,
               Review.reviewGrade,
               Review.reviewCount
        FROM Room R
                 INNER JOIN RoomType RT on R.typeId = RT.typeId
                 INNER JOIN (
                     SELECT roomId, GROUP_CONCAT(kind SEPARATOR ' · ') as amenities FROM AmenitiesMapping
                     INNER JOIN Amenities A on AmenitiesMapping.AmenitiesId = A.AmenitiesId GROUP BY roomId
                     ) Amenity
                 INNER JOIN (
                     SELECT Review.roomId, ROUND(AVG((cleanlinessGrade + accuracyGrade + CommunicationGrade + locationGrade + checkInGrade + bestValueGrade) / 6), 2) reviewGrade, COUNT(reviewId) reviewCount
                     FROM Review INNER JOIN Room R on Review.roomId = R.roomId GROUP BY R.roomId
                     ) Review
        WHERE Amenity.roomId = R.roomId AND Review.roomId = R.roomId AND location = ?;
    `;
    const selectRoomsRow = await connection.query(
        selectRoomsQuery,
        location
    );

    return selectRoomsRow[0];
}

// 숙소 찜 상태 조회
async function checkRoomLikesStatus(connection, userIdFromJWT) {
    const checkRoomLikesStatusQuery = `
        SELECT R.roomId, WM.status AS likesStatus
        FROM WishMapping WM
            INNER JOIN WishList WL on WM.wishId = WL.wishId
            INNER JOIN Room R on WM.roomId = R.roomId
        WHERE WL.userId = ?;
    `;
    const [checkRoomLikesStatusRow] = await connection.query(
        checkRoomLikesStatusQuery,
        userIdFromJWT
    );

    return checkRoomLikesStatusRow;
}

// 숙소 이미지 조회
async function selectRoomImages(connection, roomId) {
    const selectRoomImagesQuery = `
        SELECT roomImgId, imgUrl as roomImgUrl
        FROM RoomImg
        where roomId = ?;
    `;
    const selectRoomImagesRow = await connection.query(
        selectRoomImagesQuery,
        roomId
    );

    return selectRoomImagesRow[0];
}

// 숙소 기본 정보 조회
async function selectRoomContents(connection,roomId) {
    const selectRoomContentsQuery = `
        SELECT R.roomId, title, description,
               location, locationExplanation,
               RT.building, RT.type, RT.detail,
               maxPeople, bedroomNum, bedNum, bathroomNum,
               SP.place, SP.bedding, Amenity.amenities,
               roomCharge, minDay,
               ROUND(AVG((cleanlinessGrade + accuracyGrade + CommunicationGrade + locationGrade + checkInGrade + bestValueGrade) / 6), 2) reviewGrade,
               COUNT(contents) reviewCount
        FROM Room R
                 INNER JOIN RoomType RT on R.typeId = RT.typeId
                 INNER JOIN StayPlace SP on R.roomId = SP.roomId INNER JOIN Review on R.roomId = Review.roomId
                 INNER JOIN (
                    SELECT roomId, GROUP_CONCAT(kind SEPARATOR ', ') as amenities FROM AmenitiesMapping
                    INNER JOIN Amenities A on AmenitiesMapping.AmenitiesId = A.AmenitiesId GROUP BY roomId
                    ) Amenity
        WHERE Amenity.roomId = R.roomId AND R.roomId = ?;
    `;
    const [selectRoomContentsRow] = await connection.query(
        selectRoomContentsQuery,
        roomId
    );

    return selectRoomContentsRow;
}

// 숙소 찜 상태 조회 (+ roomId)
async function checkRoomLikesByRoomId(connection, userIdFromJWT, roomId) {
    const checkRoomLikesByRoomIdQuery = `
        SELECT R.roomId, WM.status AS likesStatus
        FROM WishMapping WM
                 INNER JOIN WishList WL on WM.wishId = WL.wishId
                 INNER JOIN Room R on WM.roomId = R.roomId
        WHERE WL.userId = ? AND R.roomId = ?;
    `;
    const [checkRoomLikesByRoomIdRow] = await connection.query(
        checkRoomLikesByRoomIdQuery,
        [userIdFromJWT, roomId]
    );

    return checkRoomLikesByRoomIdRow;
}

// 숙소 호스트 정보 조회
async function selectRoomHostInfo(connection, roomId) {
    const selectRoomHostInfoQuery = `
        SELECT U.userId, firstName AS userName, DATE_FORMAT(U.createdAt, '%Y년 %m월') AS userCreatedAt,
               HR.hostReviewCount, mode AS userType, introduce
        FROM User U
                 INNER JOIN Room R on U.userId = R.userId
                 INNER JOIN (SELECT roomId, COUNT(*) AS hostReviewCount FROM Review GROUP BY roomId) AS HR
        WHERE R.roomId = HR.roomId AND R.roomId = ?;
    `;
    const selectRoomHostInfoRow = await connection.query(
        selectRoomHostInfoQuery,
        roomId
    );

    return selectRoomHostInfoRow[0];
}

// 숙소 후기 별점
async function selectReviewGrade(connection, roomId) {
    const selectReviewGradeQuery = `
        SELECT ROUND(AVG((cleanlinessGrade + accuracyGrade + CommunicationGrade + locationGrade + checkInGrade + bestValueGrade) / 6), 2) reviewGrade,
               COUNT(*) reviewCount,
               FORMAT(ROUND(AVG(accuracyGrade), 1), 1) accuracyGrade,
               FORMAT(ROUND(AVG(communicationGrade), 1), 1) communicationGrade,
               FORMAT(ROUND(AVG(checkinGrade), 1), 1) checkInGrade,
               FORMAT(ROUND(AVG(cleanlinessGrade), 1), 1) cleanlinessGrade,
               FORMAT(ROUND(AVG(locationGrade), 1), 1) locationGrade,
               FORMAT(ROUND(AVG(bestValueGrade), 1), 1) bestValueGrade
        FROM Review WHERE roomId = ?;
    `;
    const selectReviewGradeRow = await connection.query(
        selectReviewGradeQuery,
        roomId
    );

    return selectReviewGradeRow[0];
}

// 숙소 후기 글
async function selectRoomReviews(connection, roomId) {
    const selectRoomHostInfoQuery = `
        SELECT profileImgUrl,
               firstName name,
               DATE_FORMAT(Review.createdAt, '%Y년 %m월') userCreatedAt,
               contents
        FROM Review
                 INNER JOIN User U on Review.userId = U.userId
        WHERE roomId = ?
        ORDER BY userCreatedAt DESC;
    `;
    const selectRoomReviewsRow = await connection.query(
        selectRoomHostInfoQuery,
        roomId
    );

    return selectRoomReviewsRow[0];
}

// 숙소 체크
async function checkRoom(connection, roomId) {
    const checkRoomQuery = `
        SELECT * FROM Room WHERE roomId = ? AND status = 'ACTIVE';
    `;
    const checkRoomRow = await connection.query(
        checkRoomQuery,
        roomId
    );

    return checkRoomRow[0];
}

// 숙소 찜 상태 체크
async function checkRoomLike(connection, userIdFromJWT, wishId, roomId) {
    const checkRoomLikeQuery = `
        SELECT listName AS wishListName,
               roomId,
               WM.status
        FROM WishMapping WM
                 INNER JOIN WishList WL on WM.wishId = WL.wishId
        WHERE userId = ? AND WL.wishId = ? AND roomId = ?;
    `;
    const checkRoomLikeRow = await connection.query(
        checkRoomLikeQuery,
        [userIdFromJWT, wishId, roomId]
    );

    return checkRoomLikeRow[0];
}

// 숙소 찜 등록
async function insertRoomLike(connection, wishId, roomId) {
    const insertRoomLikeQuery = `
        INSERT INTO WishMapping(wishId, roomId)
        VALUES (?, ?);
    `;
    const insertRoomLikeRow = await connection.query(
        insertRoomLikeQuery,
        [wishId, roomId]
    );

    return insertRoomLikeRow;
}

// 숙소 찜 변경사항 반영
async function updateRoomLike(connection, status, roomId) {
    const updateRoomLikeQuery = `
        UPDATE WishMapping SET status = ?
        WHERE roomId = ?;
    `;
    const updateRoomLikeRow = await connection.query(
        updateRoomLikeQuery,
        [status, roomId]
    );

    return updateRoomLikeRow;
}

// 숙소 예약 등록
async function insertReservation(connection, insertReservationInfoParams) {
    const insertReservationQuery = `
        INSERT INTO Reservation (userId, roomId, checkIn, checkOut, adults, children, infants, pets, totalCharge)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
    `;
    const insertReservationRow = await connection.query(
        insertReservationQuery,
        insertReservationInfoParams
    );

    return insertReservationRow;
}

// 숙소 예약 목록 조회
async function selectReservationList(connection, userIdFromJWT) {
    const selectReservationListQuery = `
        SELECT reservationId,
               R.roomId , 
               title, 
               DATE_FORMAT(checkIn, '%Y년 %m월 %d일') AS checkIn, 
               DATE_FORMAT(checkOut, '%Y년 %m월 %d일') AS checkOut,
               totalCharge
        FROM Reservation R INNER JOIN Room on R.roomId = Room.roomId 
        WHERE R.userId = ? AND R.status = 'ACTIVE';
    `;
    const [selectReservationListRow] = await connection.query(
        selectReservationListQuery,
        userIdFromJWT
    );

    return selectReservationListRow;
}

// 숙소 예약 상태 체크
async function checkReservation(connection, userIdFromJWT, roomId) {
    const checkReservationQuery = `
        SELECT * FROM Reservation
        WHERE userId = ? AND roomId = ?;
    `;
    const checkReservationRow = await connection.query(
        checkReservationQuery,
        [userIdFromJWT, roomId]
    );

    return checkReservationRow[0];
}

// 숙소 예약 취소
async function deleteReservation(connection, userIdFromJWT, roomId) {
    const deleteReservationQuery = `
        UPDATE Reservation SET status = 'DELETE'
        WHERE userId = ? AND roomId = ?;
    `;
    const deleteReservationRow = await connection.query(
        deleteReservationQuery,
        [userIdFromJWT, roomId]
    );

    return deleteReservationRow;
}

// 숙소 호스팅 (숙소 유형)
async function insertRoomType(connection, insertRoomInfoParams) {
    const insertRoomTypeQuery = `
        INSERT INTO RoomType (building, type, detail)
        VALUES (?, ?, ?);
    `;
    const insertRoomTypeRow = await connection.query(
        insertRoomTypeQuery,
        insertRoomInfoParams
    );

    return insertRoomTypeRow;
}

// 숙소 호스팅 (기본 정보)
async function insertRoom(connection, insertRoomInfoParams) {
    const insertRoomQuery = `
        INSERT INTO Room (userId, typeId, title, description, maxPeople, bedroomNum, bedNum, bathroomNum, location, roomCharge, minDay)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `;
    const insertRoomRow = await connection.query(
        insertRoomQuery,
        insertRoomInfoParams
    );

    return insertRoomRow;
}

// 숙소 정보 수정 (숙소 유형)
async function updateRoomType(connection, updateRoomTypeParams) {
    const updateRoomTypeQuery = `
        UPDATE RoomType SET building = ?, type = ?, detail =?
        WHERE typeId = ?;
    `;
    const updateRoomTypeRow = await connection.query(
        updateRoomTypeQuery,
        updateRoomTypeParams
    );

    return updateRoomTypeRow;
}

// 숙소 정보 수정 (기본 정보)
async function updateRoom(connection, updateRoomInfoParams) {
    const updateRoomQuery = `
        UPDATE Room
        SET typeId = ?,
            title = ?,
            description = ?,
            maxPeople = ?,
            bedroomNum = ?,
            bedNum = ?,
            bathroomNum = ?,
            location = ?,
            roomCharge = ?,
            minDay = ?
        WHERE roomId = ?;
    `;
    const updateRoomRow = await connection.query(
        updateRoomQuery,
        updateRoomInfoParams
    );

    return updateRoomRow;
}

// 숙소 비활성화
async function deleteRoom(connection, roomId) {
    const deleteRoomQuery = `
        UPDATE Room SET status = 'DELETE'
        WHERE roomId = ?;
    `;
    const deleteRoomRow = await connection.query(
        deleteRoomQuery,
        roomId
    );

    return deleteRoomRow;
}



module.exports = {
    selectRoomList,
    checkRoomLikesStatus,
    selectRoomImages,
    selectRoomContents,
    checkRoomLikesByRoomId,
    selectRoomHostInfo,
    selectReviewGrade,
    selectRoomReviews,
    checkRoom,
    checkRoomLike,
    insertRoomLike,
    updateRoomLike,
    insertReservation,
    selectReservationList,
    checkReservation,
    deleteReservation,
    insertRoomType,
    insertRoom,
    updateRoomType,
    updateRoom,
    deleteRoom,
};