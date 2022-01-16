module.exports = function (app) {
    const room = require('./roomController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // 6. 숙소 조회 API
    app.get('/rooms', jwtMiddleware, room.getRooms);

    // 7. 숙소 상세 조회 API
    app.get('/rooms/:roomId/contents', jwtMiddleware, room.getRoomContents);

    // 8. 숙소 후기 조회 API
    app.get('/rooms/:roomId/reviews', room.getRoomReviews);

    // 10. 숙소 찜 상태 변경 API
    app.post('/rooms/:roomId/like', jwtMiddleware, room.postRoomLike);
};