module.exports = function (app) {
    const room = require('./roomController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // 6. 숙소 조회 API
    app.get('/rooms', room.getRooms);

    // 7. 숙소 상세 조회 API
    app.get('/rooms/:roomId/contents', room.getRoomContents);
};