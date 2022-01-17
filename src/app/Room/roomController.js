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