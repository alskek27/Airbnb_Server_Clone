module.exports = function (app) {
    const user = require('./userController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // 1. 회원가입 API
    app.post('/users/sign-up', user.postUsers);

    // 2. 로그인 API
    app.post('/users/login', user.loginUsers);

    // 3. 자동 로그인 API
    app.get('/users/auto-login', jwtMiddleware, user.check);
};