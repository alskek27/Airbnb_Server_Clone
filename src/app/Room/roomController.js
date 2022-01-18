const jwtMiddleware = require("../../../config/jwtMiddleware");
const roomProvider = require("../../app/Room/roomProvider");
const roomService = require("../../app/Room/roomService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

/**
 * API No. 6
 * API Name : 숙소 조회 API
 * [GET] /rooms
 */
exports.getRooms = async function (req, res) {
    const userIdFromJWT = req.verifiedToken.userId;
    const location = req.query.location;

    if (!location) return res.send(errResponse(baseResponse.LOCATION_EMPTY)); // 2016 : 위치를 입력해 주세요.

    const selectRoomList = await roomProvider.selectRoomList(location);
    const checkRoomLikesStatus = await roomProvider.checkRoomLikesStatus(userIdFromJWT);

    const result = {
        "roomList" : selectRoomList,
        "roomLikesStatus" : checkRoomLikesStatus
    }

    return res.send(response(baseResponse.SUCCESS, result));
};

/**
 * API No. 7
 * API Name : 숙소 상세 조회 API
 * [GET] /rooms/:roomId/contents
 */
exports.getRoomContents = async function (req, res) {
    const userIdFromJWT = req.verifiedToken.userId;
    const roomId = req.params.roomId;

    if (!roomId) return res.send(errResponse(baseResponse.ROOM_ID_EMPTY)); // 2017 : roomId를 입력해 주세요.

    const selectRoomImages = await roomProvider.selectRoomImages(roomId);
    const selectRoomContents = await roomProvider.selectRoomContents(roomId);
    const checkRoomLikesStatus = await roomProvider.checkRoomLikesByRoomId(userIdFromJWT, roomId);
    const selectRoomHostInfo = await roomProvider.selectRoomHostInfo(roomId);

    const result = {
        "roomImages" : selectRoomImages,
        "roomInfo" : selectRoomContents,
        "roomLikesStatus" : checkRoomLikesStatus,
        "roomHostInfo" : selectRoomHostInfo
    };

    return res.send(response(baseResponse.SUCCESS, result));
};

/**
 * API No. 8
 * API Name : 숙소 후기 조회 API
 * [GET] /rooms/:roomId/reviews
 */
exports.getRoomReviews = async function (req, res) {
    const roomId = req.params.roomId;

    if (!roomId) return res.send(errResponse(baseResponse.ROOM_ID_EMPTY)); // 2017 : roomId를 입력해 주세요.

    const selectReviewGrade = await roomProvider.selectReviewGrade(roomId);
    const selectReviews = await roomProvider.selectRoomReviews(roomId);

    const result = {
        "reviewGrades" : selectReviewGrade,
        "reviews" : selectReviews
    };

    return res.send(response(baseResponse.SUCCESS, result));
};

/**
 * API No. 9
 * API Name : 숙소 찜 상태 변경 API
 * [POST] /rooms/:roomId/like
 */
exports.postRoomLike = async function (req, res) {
    const userIdFromJWT = req.verifiedToken.userId;
    const roomId = req.params.roomId;
    const {wishId} = req.body;

    if (!userIdFromJWT) return res.send(response(baseResponse.TOKEN_EMPTY)); // 2000 : JWT 토큰을 입력해주세요.

    if (!roomId) return res.send(response(baseResponse.ROOM_ID_EMPTY)); // 2017 : roomId를 입력해 주세요.

    if (!wishId) return res.send(response(baseResponse.WISHLIST_ID_EMPTY)); // 2019 : wishListId를 입력해 주세요.

    const insertRoomLikeResponse = await roomService.insertRoomLike(userIdFromJWT, wishId, roomId);

    return res.send(insertRoomLikeResponse);
};

/**
 * API No. 15
 * API Name : 숙소 예약 API
 * [POST] /rooms/:roomId/reservations
 */
exports.postRoomReservation = async function (req, res) {
    const userIdFromJWT = req.verifiedToken.userId;
    const roomId = req.params.roomId;
    const {checkIn, checkOut, adults, children, infants, pets} = req.body;

    if (!userIdFromJWT) return res.send(response(baseResponse.TOKEN_EMPTY)); // 2000 : JWT 토큰을 입력해주세요.

    if (!roomId) return res.send(response(baseResponse.ROOM_ID_EMPTY)); // 2017 : roomId를 입력해 주세요.

    if (!checkIn) return res.send(response(baseResponse.CHECK_IN_DATE_EMPTY)); // 2020 : 체크인 날짜를 입력해 주세요.
    if (!checkOut) return res.send(response(baseResponse.CHECK_OUT_DATE_EMPTY)); // 2021 : 체크아웃 날짜를 입력해 주세요.

    if (!adults) return res.send(response(baseResponse.ADULTS_EMPTY)); // 2022 : 성인 인원을 입력해 주세요.
    if (children < 0) return res.send(response(baseResponse.CHILDREN_EMPTY)); // 2023 : 어린이 인원을 입력해 주세요.
    if (infants < 0) return res.send(response(baseResponse.INFANTS_EMPTY)); // 2024 : 유아 인원 입력해 주세요.
    if (pets < 0) return res.send(response(baseResponse.PETS_EMPTY)); // 2025 : 반려동물 수를 입력해 주세요.

    const insertReservationResponse = await roomService.insertReservation(roomId, checkIn, checkOut, adults, children, infants, pets, userIdFromJWT);

    return res.send(insertReservationResponse);
};

/**
 * API No. 16
 * API Name : 숙소 예약 조회 API
 * [GET] /rooms/reservations-status
 */
exports.getReservationList = async function (req, res) {
    const userIdFromJWT = req.verifiedToken.userId;

    if (!userIdFromJWT) return res.send(response(baseResponse.TOKEN_EMPTY)); // 2000 : JWT 토큰을 입력해주세요.

    const selectReservationListResponse = await roomProvider.selectReservationList(userIdFromJWT);

    return res.send(response(baseResponse.SUCCESS, selectReservationListResponse));
};

/**
 * API No. 17
 * API Name : 숙소 예약 취소 API
 * [PATCH] /rooms/:roomId/reservations/cancel
 */
exports.deleteRoomReservation = async function (req, res) {
    const userIdFromJWT = req.verifiedToken.userId;
    const roomId = req.params.roomId;

    if (!userIdFromJWT) return res.send(response(baseResponse.TOKEN_EMPTY)); // 2000 : JWT 토큰을 입력해주세요.

    if (!roomId) return res.send(response(baseResponse.ROOM_ID_EMPTY)); // 2017 : roomId를 입력해 주세요.

    const deleteRoomReservationResponse = await roomService.deleteRoomReservation(userIdFromJWT, roomId);

    return res.send(deleteRoomReservationResponse);
};

/**
 * API No. 20
 * API Name : 숙소 호스팅 API
 * [POST] /rooms/hosting
 */
exports.postRoom = async function (req, res) {
    const userIdFromJWT = req.verifiedToken.userId;
    const {buildingType, roomType, placeType, location, maxPeople, bedroomNum, bedNum, bathroomNum, title, description, roomCharge, minDay} = req.body;

    if (!userIdFromJWT) return res.send(response(baseResponse.TOKEN_EMPTY)); // 2000 : JWT 토큰을 입력해주세요.

    if (!buildingType) return res.send(response(baseResponse.BUILDING_TYPE_EMPTY)); // 2026 : 건물 유형을 입력해 주세요.

    if (!roomType) return res.send(response(baseResponse.ROOM_TYPE_EMPTY)); // 2027 : 숙소 유형을 입력해 주세요.

    if (!placeType) return res.send(response(baseResponse.PLACE_TYPE_EMPTY)); // 2028 : 공간 유형을 입력해 주세요.

    if (!location) return res.send(response(baseResponse.LOCATION_EMPTY)); // 2016 : 위치를 입력해 주세요.

    if (!maxPeople) return res.send(response(baseResponse.MAX_PEOPLE_EMPTY)); // 2029 : 게스트 수를 입력해 주세요.

    if (!bedroomNum) return res.send(response(baseResponse.BED_ROOM_NUM_EMPTY)); // 2030 : 침실 수를 입력해 주세요.

    if (!bedNum) return res.send(response(baseResponse.BED_NUM_EMPTY)); // 2031 : 침대 수를 입력해 주세요.

    if (!bathroomNum) return res.send(response(baseResponse.BATH_ROOM_NUM_EMPTY)); // 2032 : 욕실 수를 입력해 주세요.

    if (!title) return res.send(response(baseResponse.ROOM_TITLE_EMPTY)); // 2033 : 숙소 제목을 입력해 주세요.

    if (!description) return res.send(response(baseResponse.ROOM_DESCRIPTION_EMPTY)); // 2034 : 숙소 설명을 입력해 주세요.

    if (!roomCharge) return res.send(response(baseResponse.ROOM_CHARGE_EMPTY)); // 2035 : 숙박비를 입력해 주세요.

    if (!minDay) return res.send(response(baseResponse.MIN_DAY_EMPTY)); // 2036 : 최소 숙박 일수를 입력해 주세요.


    const insertRoomResponse = await roomService.insertRoom(
        userIdFromJWT,
        buildingType,
        roomType,
        placeType,
        location,
        maxPeople,
        bedroomNum,
        bedNum,
        bathroomNum,
        title,
        description,
        roomCharge,
        minDay
    );

    return res.send(insertRoomResponse);
};

/**
 * API No. 21
 * API Name : 숙소 정보 수정 API
 * [POST] /rooms/:roomId/hosting/details
 */
exports.patchRoom = async function (req, res) {
    const userIdFromJWT = req.verifiedToken.userId;
    const roomId = req.params.roomId;
    const {buildingType, roomType, placeType, location, maxPeople, bedroomNum, bedNum, bathroomNum, title, description, roomCharge, minDay} = req.body;

    if (!userIdFromJWT) return res.send(response(baseResponse.TOKEN_EMPTY)); // 2000 : JWT 토큰을 입력해주세요.

    if (!buildingType) return res.send(response(baseResponse.BUILDING_TYPE_EMPTY)); // 2026 : 건물 유형을 입력해 주세요.

    if (!roomType) return res.send(response(baseResponse.ROOM_TYPE_EMPTY)); // 2027 : 숙소 유형을 입력해 주세요.

    if (!placeType) return res.send(response(baseResponse.PLACE_TYPE_EMPTY)); // 2028 : 공간 유형을 입력해 주세요.

    if (!location) return res.send(response(baseResponse.LOCATION_EMPTY)); // 2016 : 위치를 입력해 주세요.

    if (!maxPeople) return res.send(response(baseResponse.MAX_PEOPLE_EMPTY)); // 2029 : 게스트 수를 입력해 주세요.

    if (!bedroomNum) return res.send(response(baseResponse.BED_ROOM_NUM_EMPTY)); // 2030 : 침실 수를 입력해 주세요.

    if (!bedNum) return res.send(response(baseResponse.BED_NUM_EMPTY)); // 2031 : 침대 수를 입력해 주세요.

    if (!bathroomNum) return res.send(response(baseResponse.BATH_ROOM_NUM_EMPTY)); // 2032 : 욕실 수를 입력해 주세요.

    if (!title) return res.send(response(baseResponse.ROOM_TITLE_EMPTY)); // 2033 : 숙소 제목을 입력해 주세요.

    if (!description) return res.send(response(baseResponse.ROOM_DESCRIPTION_EMPTY)); // 2034 : 숙소 설명을 입력해 주세요.

    if (!roomCharge) return res.send(response(baseResponse.ROOM_CHARGE_EMPTY)); // 2035 : 숙박비를 입력해 주세요.

    if (!minDay) return res.send(response(baseResponse.MIN_DAY_EMPTY)); // 2036 : 최소 숙박 일수를 입력해 주세요.


    const updateRoomResponse = await roomService.updateRoom(
        userIdFromJWT,
        roomId,
        buildingType,
        roomType,
        placeType,
        location,
        maxPeople,
        bedroomNum,
        bedNum,
        bathroomNum,
        title,
        description,
        roomCharge,
        minDay
    );

    return res.send(updateRoomResponse);
};