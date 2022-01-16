const jwtMiddleware = require("../../../config/jwtMiddleware");
const wishListProvider = require("../../app/WishList/wishListProvider");
const wishListService = require("../../app/WishList/wishListService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

/**
 * API No. 9
 * API Name : 위시리스트 생성 API
 * [POST] /wishlists
 */
exports.postWishList = async function (req, res) {
    const userIdFromJWT = req.verifiedToken.userId;
    const {listName} = req.body;

    if (!userIdFromJWT) return res.send(response(baseResponse.TOKEN_EMPTY)); // 2000 : JWT 토큰을 입력해주세요.

    if (!listName) return res.send(response(baseResponse.WISHLIST_NAME_EMPTY)); // 2018 : listName을 입력해 주세요.

    const insertWishListResponse = await wishListService.insertWishList(userIdFromJWT, listName);

    return res.send(insertWishListResponse);
};

/**
 * API No. 11
 * API Name : 내 위시리스트 조회 API
 * [GET] /wishlists
 */
exports.getMyWishLists = async function (req, res) {
    const userIdFromJWT = req.verifiedToken.userId;

    if (!userIdFromJWT) return res.send(response(baseResponse.TOKEN_EMPTY)); // 2000 : JWT 토큰을 입력해주세요.

    const selectWishLists = await wishListProvider.selectWishLists(userIdFromJWT);

    return res.send(response(baseResponse.SUCCESS, selectWishLists));
};

/**
 * API No. 12
 * API Name : 위시리스트 상세 조회 API
 * [GET] /wishlists/:wishId/contents
 */
exports.getWishList = async function (req, res) {
    const userIdFromJWT = req.verifiedToken.userId;
    const wishId = req.params.wishId;

    if (!userIdFromJWT) return res.send(response(baseResponse.TOKEN_EMPTY)); // 2000 : JWT 토큰을 입력해주세요.

    if (!wishId) return res.send(response(baseResponse.WISHLIST_ID_EMPTY)); // 2019 : wishId를 입력해 주세요.

    const selectWishList = await wishListProvider.selectWishList(userIdFromJWT, wishId);

    return res.send(response(baseResponse.SUCCESS, selectWishList));
};

/**
 * API No. 13
 * API Name : 위시리스트 수정 API
 * [PATCH] /wishlists/:wishId/set
 */
exports.patchWishList = async function (req, res) {
    const userIdFromJWT = req.verifiedToken.userId;
    const wishId = req.params.wishId;
    const {listName} = req.body;

    if (!userIdFromJWT) return res.send(response(baseResponse.TOKEN_EMPTY)); // 2000 : JWT 토큰을 입력해주세요.

    if (!wishId) return res.send(response(baseResponse.WISHLIST_ID_EMPTY)); // 2019 : wishId를 입력해 주세요.

    if (!listName) return res.send(response(baseResponse.WISHLIST_NAME_EMPTY)); // 2018 : listName을 입력해 주세요.

    const updateWishList = await wishListService.updateWishList(listName, userIdFromJWT, wishId);

    return res.send(updateWishList);
};

/**
 * API No. 13
 * API Name : 위시리스트 삭제 API
 * [PATCH] /wishlists/:wishId/status
 */
exports.deleteWishList = async function (req, res) {
    const userIdFromJWT = req.verifiedToken.userId;
    const wishId = req.params.wishId;

    if (!userIdFromJWT) return res.send(response(baseResponse.TOKEN_EMPTY)); // 2000 : JWT 토큰을 입력해주세요.

    if (!wishId) return res.send(response(baseResponse.WISHLIST_ID_EMPTY)); // 2019 : wishId를 입력해 주세요.

    const deleteWishList = await wishListService.deleteWishList(userIdFromJWT, wishId);

    return res.send(deleteWishList);
};