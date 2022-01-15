const jwtMiddleware = require("../../../config/jwtMiddleware");
const searchProvider = require("../../app/Search/searchProvider");
const searchService = require("../../app/Search/searchService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

/**
 * API No. 4
 * API Name : 검색 기록 등록 API
 * [POST] /search
 */
exports.postSearch = async function (req, res) {
    const userIdFromJWT = req.verifiedToken.userId;
    let {userId, location, checkIn, checkOut, adults, children, infants, pets} = req.body;

    if (!userIdFromJWT)
        return res.send(errResponse(baseResponse.TOKEN_EMPTY)); // 2000 : JWT 토큰을 입력해 주세요.

    if (userIdFromJWT != userId)
        return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH)); // 2015 : 유저 아이디 값을 확인해 주세요.

    if (!userId)
        return res.send(errResponse(baseResponse.USER_USERID_EMPTY)); // 2014 : userId를 입력해 주세요.

    if (!location)
        return res.send(errResponse(baseResponse.LOCATION_EMPTY)); // 2016 : 위치를 입력해 주세요.

    if (!checkIn) checkIn = "0000-00-00";
    if (!checkOut) checkOut = "0000-00-00";
    if (!adults) adults = 0;
    if (!children) children = 0;
    if (!infants) infants = 0;
    if (!pets) pets = 0;

    const insertSearchResponse = await searchService.insertSearch(
        userId, location, checkIn, checkOut, adults, children, infants, pets
    );

    return res.send(insertSearchResponse);
};

/**
 * API No. 5
 * API Name : 검색 기록 조회 API
 * [GET] /search
 */
exports.getSearch = async function (req, res) {
    const userIdFromJWT = req.verifiedToken.userId;

    if (!userIdFromJWT)
        return res.send(errResponse(baseResponse.TOKEN_EMPTY)); // 2000 : JWT 토큰을 입력해 주세요.

    const selectSearchResponse = await searchProvider.selectSearch(userIdFromJWT);

    return res.send(response(baseResponse.SUCCESS, selectSearchResponse));
};