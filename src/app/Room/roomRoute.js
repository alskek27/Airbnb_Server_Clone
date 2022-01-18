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

    // 15. 숙소 예약 API
    app.post('/rooms/:roomId/reservations', jwtMiddleware, room.postRoomReservation);

    // 16. 숙소 예약 조회 API
    app.get('/rooms/reservations-list', jwtMiddleware, room.getReservationList);

    // 17. 숙소 예약 취소 API
    app.patch('/rooms/:roomId/reservations/cancel', jwtMiddleware, room.deleteRoomReservation);

    // 20. 숙소 호스팅 API
    app.post('/rooms/hosting', jwtMiddleware, room.postRoom);

    // 21. 숙소 정보 수정 API
    app.patch('/rooms/:roomId/hosting/details', jwtMiddleware, room.patchRoom);

}