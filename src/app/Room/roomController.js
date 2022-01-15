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
    const location = req.query.location;

    if (!location)
        return res.send(errResponse(baseResponse.LOCATION_EMPTY)); // 2016 : 위치를 입력해 주세요.

    const selectRoomListResponse = await roomProvider.selectRoomList(location);

    return res.send(response(baseResponse.SUCCESS, selectRoomListResponse));
};

/**
 * API No. 7
 * API Name : 숙소 상세 조회 API
 * [GET] /rooms/:roomId/contents
 */
exports.getRoomContents = async function (req, res) {
    const roomId = req.params.roomId;

    if (!roomId) return res.send(errResponse(baseResponse.ROOM_ID_EMPTY)); // 2017 : roomId를 입력해 주세요.

    const selectRoomImages = await roomProvider.selectRoomImages(roomId);
    const selectRoomContents = await roomProvider.selectRoomContents(roomId);
    const selectRoomHostInfo = await roomProvider.selectRoomHostInfo(roomId);

    const result = {
        "roomImages" : selectRoomImages,
        "roomInfo" : selectRoomContents,
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