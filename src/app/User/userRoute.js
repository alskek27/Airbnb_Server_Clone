module.exports = function (app) {
    const user = require('./userController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // 1. 회원가입 API
    app.post('/users/sign-up', user.postUsers);

    // 2. 로그인 API
    app.post('/users/login', user.loginUsers);

    // 3. 자동 로그인 API
    app.get('/users/auto-login', jwtMiddleware, user.check);

    // 18. 프로필 조회 API
    app.get('/users/:userId/profile', jwtMiddleware, user.getProfile);

    // 19. 프로필 수정 API
    app.patch('/users/:userId/profile-edit', jwtMiddleware, user.patchProfile);

    // 23. 개인정보 조회 API
    app.get('/users/personal-info', jwtMiddleware, user.getPersonalInfo);

    // 24. 개인정보 수정 API
    app.patch('/users/personal-info/edit', jwtMiddleware, user.editPersonalInfo);
};