const jwtMiddleware = require("../../../config/jwtMiddleware");
const userProvider = require("../../app/User/userProvider");
const userService = require("../../app/User/userService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

const regexEmail = require("regex-email");
const {emit} = require("nodemon");

/**
 * API No. 1
 * API Name : 회원가입 API
 * [POST] /users/sign-up
 */
exports.postUsers = async function (req, res) {
    const {firstName, lastName, birth, email, password} = req.body;

    if (!firstName)
        return res.send(response(baseResponse.SIGNUP_FIRSTNAME_EMPTY)); // 2001 : 이름을 입력해 주세요.

    if (!lastName)
        return res.send(response(baseResponse.SIGNUP_LASTNAME_EMPTY)); // 2002 : 성을 입력해 주세요.

    if (!birth)
        return res.send(response(baseResponse.SIGNUP_BIRTH_EMPTY)); // 2003 : 생년월일을 입력해 주세요.

    if (!email)
        return res.send(response(baseResponse.SIGNUP_EMAIL_EMPTY)); // 2004 : 이메일을 입력해 주세요.

    if (email.length > 30)
        return res.send(response(baseResponse.SIGNUP_EMAIL_LENGTH)); // 2005 : 이메일은 30자리 미만으로 입력해 주세요.

    if (!regexEmail.test(email))
        return res.send(response(baseResponse.SIGNUP_EMAIL_ERROR_TYPE)); // 2006 : 이메일을 형식을 정확하게 입력해 주세요.

    if (!password)
        return res.send(response(baseResponse.SIGNUP_PASSWORD_EMPTY)); // 2007 : 비밀번호를 입력해 주세요.

    if (password.length < 6 || password.length > 20)
        return res.send(response(baseResponse.SIGNUP_PASSWORD_LENGTH)); // 2008 : 비밀번호는 6~20자리를 입력해 주세요.


    const signUpResponse = await userService.createUser(
        firstName, lastName, birth, email, password
    );

    return res.send(signUpResponse);
};

/**
 * API No. 2
 * API Name : 로그인 API
 * [POST] /users/login
 */
exports.loginUsers = async function (req, res) {
    const {email, password} = req.body;

    if (!email)
        return res.send(response(baseResponse.SIGNIN_EMAIL_EMPTY)); // 2009 : 이메일을 입력해 주세요.

    if (email.length > 30)
        return res.send(response(baseResponse.SIGNIN_EMAIL_LENGTH)); // 2010 : 이메일은 30자리 미만으로 입력해 주세요.

    if (!regexEmail.test(email))
        return res.send(response(baseResponse.SIGNIN_EMAIL_ERROR_TYPE)); // 2011 : 이메일을 형식을 정확하게 입력해 주세요.

    if (!password)
        return res.send(response(baseResponse.SIGNIN_PASSWORD_EMPTY)); // 2012 : 비밀번호를 입력해 주세요.

    if (password.length < 6 || password.length > 20)
        return res.send(response(baseResponse.SIGNIN_PASSWORD_LENGTH)); // 2013 : 비밀번호는 6~20자리를 입력해 주세요.

    const signInResponse = await userService.postSignIn(email, password);

    return res.send(signInResponse);
};

/**
 * API NO. 3
 * API Name : 자동 로그인 API (JWT 토큰 검증)
 * [GET] /users/auto-login
 */
exports.check = async function(req, res) {
    const userIdFromJWT = req.verifiedToken.userId;
    const checkJWT = await userProvider.retrieveUser(userIdFromJWT);

    if (!userIdFromJWT)
        return res.send(response(baseResponse.TOKEN_EMPTY)); // 2000 : JWT 토큰을 입력해주세요.

    if (!checkJWT)
        return res.send(response(baseResponse.TOKEN_VERIFICATION_FAILURE)); // 3000 : JWT 토큰 검증 실패

    return res.send(response(baseResponse.TOKEN_VERIFICATION_SUCCESS, checkJWT)); // 1001 : JWT 토큰 검증 성공
};