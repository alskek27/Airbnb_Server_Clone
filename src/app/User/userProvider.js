const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const userDao = require("./userDao");

// Provider: Read 비즈니스 로직 처리

exports.retrieveUser = async function (userId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const userResult = await userDao.selectUserId(connection, userId);

  connection.release();

  return userResult[0];
};

exports.emailCheck = async function (email) {
  const connection = await pool.getConnection(async (conn) => conn);
  const emailCheckResult = await userDao.selectUserEmail(connection, email);
  connection.release();

  return emailCheckResult;
};

exports.passwordCheck = async function (selectUserPasswordParams) {
  const connection = await pool.getConnection(async (conn) => conn);
  const passwordCheckResult = await userDao.selectUserPassword(
      connection,
      selectUserPasswordParams
  );
  connection.release();
  return passwordCheckResult[0];
};

exports.accountCheck = async function (email) {
  const connection = await pool.getConnection(async (conn) => conn);
  const userAccountResult = await userDao.selectUserAccount(connection, email);
  connection.release();

  return userAccountResult;
};

exports.selectUserProfile = async function (userId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const userProfileResult = await userDao.selectUserProfile(connection, userId);
  connection.release();

  return userProfileResult;
};

exports.checkIntroduce = async function (userId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const checkIntroduceResult = await userDao.checkIntroduce(connection, userId);
  connection.release();

  return checkIntroduceResult;
};

exports.checkHost = async function (userIdFromJWT) {
  const connection = await pool.getConnection(async (conn) => conn);
  const checkHostResult = await userDao.checkHost(connection, userIdFromJWT);
  connection.release();

  return checkHostResult;
};