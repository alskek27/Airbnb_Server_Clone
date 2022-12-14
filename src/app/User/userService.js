const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/database");
const secret_config = require("../../../config/secret");
const userProvider = require("./userProvider");
const userDao = require("./userDao");
const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const {connect} = require("http2");

// Service: Create, Update, Delete 비즈니스 로직 처리

exports.createUser = async function (firstName, lastName, birth, email, password) {
    try {
        // 이메일 중복 확인
        const emailRows = await userProvider.emailCheck(email);
        if (emailRows.length > 0)
            return errResponse(baseResponse.USER_REDUNDANT_EMAIL); // 3001 : 중복된 이메일입니다.

        // 비밀번호 암호화
        const hashedPassword = await crypto
            .createHash("sha512")
            .update(password)
            .digest("hex");

        const insertUserInfoParams = [firstName, lastName, birth, email, hashedPassword];
        const connection = await pool.getConnection(async (conn) => conn);
        const userIdResult = await userDao.insertUserInfo(connection, insertUserInfoParams);
        connection.release();

        return response(baseResponse.SUCCESS, {"userId": userIdResult[0].insertId});

    } catch (err) {
        logger.error(`App - createUser Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

exports.postSignIn = async function (email, password) {
    try {
        // 이메일 여부 확인
        const emailRows = await userProvider.emailCheck(email);
        if (emailRows.length < 1) return errResponse(baseResponse.USER_EMAIL_WRONG); // 3002 : 이메일이 잘못되었습니다.

        const selectEmail = emailRows[0].email;

        // 비밀번호 확인
        const hashedPassword = await crypto
            .createHash("sha512")
            .update(password)
            .digest("hex");

        const selectUserPasswordParams = [selectEmail, hashedPassword];
        const passwordRows = await userProvider.passwordCheck(selectUserPasswordParams);

        if (passwordRows[0].password !== hashedPassword) {
            return errResponse(baseResponse.USER_PASSWORD_WRONG); // 3003 : 비밀번호가 잘못되었습니다.
        }

        // 계정 상태 확인
        const userInfoRows = await userProvider.accountCheck(email);

        if (userInfoRows[0].status === "INACTIVE") {
            return errResponse(baseResponse.USER_INACTIVE_ACCOUNT); // 3004 : 비활성화된 계정입니다. 고객센터에 문의해 주세요.
        } else if (userInfoRows[0].status === "DELETED") {
            return errResponse(baseResponse.USER_WITHDRAWAL_ACCOUNT); // 3005 : 탈퇴된 계정입니다. 고객센터에 문의해 주세요.
        }

        //토큰 생성 Service
        let token = await jwt.sign(
            {
                userId: userInfoRows[0].userId,
            }, // 토큰의 내용(payload)
            secret_config.jwtsecret, // 비밀키
            {
                expiresIn: "365d",
                subject: "userInfo",
            } // 유효 기간 365일
        );

        return response(baseResponse.SUCCESS, {'userId': userInfoRows[0].userId, 'jwt': token});

    } catch (err) {
        logger.error(`App - postSignIn Service error\n: ${err.message} \n${JSON.stringify(err)}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

exports.updateUserProfile = async function (userId, introduce) {
    const connection = await pool.getConnection(async (conn) => conn);
    try {
        const checkIntroduce = await userProvider.checkIntroduce(userId);

        if (checkIntroduce[0].introduce == introduce)
            return errResponse(baseResponse.INTRODUCE_SAME); // 3013 : 소개에서 수정된 부분이 존재하지 않습니다.

        const updateProfileResult = await userDao.updateUserProfile(connection, introduce, userId);

        return response(baseResponse.SUCCESS, updateProfileResult[0].info);

    } catch (err) {
        logger.error(`App - updateUserProfile Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    } finally {
        connection.release();
    }
};

exports.updatePersonalInfo = async function (userIdFromJWT, firstName, lastName, gender, birth, email) {
    const connection = await pool.getConnection(async (conn) => conn);
    try {
        const updatePersonalInfoParams = [lastName, firstName, gender, birth, email, userIdFromJWT];
        const updatePersonalInfoResult = await userDao.updatePersonalInfo(connection, updatePersonalInfoParams);

        return response(baseResponse.SUCCESS, updatePersonalInfoResult[0].info);

    } catch (err) {
        logger.error(`App - updatePersonalInfo Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    } finally {
        connection.release();
    }
};