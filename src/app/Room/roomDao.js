// 숙소 조회 (검색 결과)
async function selectRoomList(connection, location) {
    const selectRoomsQuery = `
        SELECT R.roomId,
               title, location, RT.type, RT.detail,
               maxPeople, bedroomNum, bedNum, bathroomNum,
               Amenity.amenities
        FROM Room R
                 INNER JOIN RoomType RT on R.typeId = RT.typeId
                 INNER JOIN (
                     SELECT roomId, GROUP_CONCAT(kind SEPARATOR ' · ') as amenities
                     FROM AmenitiesMapping INNER JOIN Amenities A on AmenitiesMapping.AmenitiesId = A.AmenitiesId GROUP BY roomId
                     ) Amenity
        WHERE Amenity.roomId = R.roomId AND location = ?;
    `;
    const [selectRoomsRow] = await connection.query(
        selectRoomsQuery,
        location
    );

    return selectRoomsRow;
}

// 숙소 이미지 조회
async function selectRoomImages(connection, roomId) {
    const selectRoomImagesQuery = `

    `;
    const [selectRoomImagesRow] = await connection.query(
        selectRoomImagesQuery,
        roomId
    );

    return selectRoomImagesRow;
}


module.exports = {
    selectRoomList,

};