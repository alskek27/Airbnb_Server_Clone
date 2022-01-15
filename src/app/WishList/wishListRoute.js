module.exports = function (app) {
    const wishList = require("./wishListController");
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // 9. 위시리스트 생성 API
    app.post('/wishlists', jwtMiddleware, wishList.postWishList);

    // 11. 내 위시리스트 조회 API
    app.get('/wishlists', jwtMiddleware, wishList.getMyWishLists);

    // 12. 위시리스트 상세 조회 API
    app.get('/wishlists/:wishId/contents', jwtMiddleware, wishList.getWishList);

    // 13. 위시리스트 수정 API
    app.patch('/wishlists/:wishId/set', jwtMiddleware, wishList.patchWishList);
};