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

    if (!roomId)
        return res.send(errResponse(baseResponse.ROOM_ID_EMPTY)); // 2017 : roomId를 입력해 주세요.

    const selectRoomImage = await roomProvider.selectRoomImages(roomId);
    const selectRoomContents = await roomProvider.selectRoomContents(roomId);
    const selectRoomAmenities = await roomProvider.selectRoomAmenities(roomId);
    const selectRoomReviews = await roomProvider.selectRoomReviews(roomId);
    const selectRoomlocation = await roomProvider.selectRoomlocation(roomId);
    const selectRoomHostInfo = await roomProvider.selectRoomHostInfo(roomId);

};

