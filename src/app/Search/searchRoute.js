module.exports = function (app) {
    const search = require('./searchController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // 4. 검색 기록 등록 API
    app.post('/search', jwtMiddleware, search.postSearch);

    // 5. 검색 기록 조회 API
    app.get('/search', jwtMiddleware, search.getSearch);
};