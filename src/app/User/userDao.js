// 이메일 체크
async function selectUserEmail(connection, email) {
  const selectUserEmailQuery = `
        SELECT email 
        FROM User
        WHERE email = ?;
  `;
  const [emailRows] = await connection.query(selectUserEmailQuery, email);
  return emailRows;
}

// userId 회원 조회
async function selectUserId(connection, userId) {
  const selectUserIdQuery = `
        SELECT userId, CONCAT(firstName, ' ', lastName) AS name, email
        FROM User
        WHERE userId = ?;
  `;
  const [userRow] = await connection.query(selectUserIdQuery, userId);
  return userRow;
}

// 유저 생성
async function insertUserInfo(connection, insertUserInfoParams) {
  const insertUserInfoQuery = `
        INSERT INTO User(firstName, lastName, birth, email, password)
        VALUES (?, ?, ?, ?, ?);
  `;
  const insertUserInfoRow = await connection.query(
      insertUserInfoQuery,
      insertUserInfoParams
  );

  return insertUserInfoRow;
}

// 패스워드 체크
async function selectUserPassword(connection, selectUserPasswordParams) {
  const selectUserPasswordQuery = `
        SELECT password
        FROM User 
        WHERE email = ? AND password = ?;
  `;
  const selectUserPasswordRow = await connection.query(
      selectUserPasswordQuery,
      selectUserPasswordParams
  );

  return selectUserPasswordRow;
}

// 유저 계정 상태 체크 (jwt 생성 위해 id 값도 가져온다.)
async function selectUserAccount(connection, email) {
  const selectUserAccountQuery = `
        SELECT status, userId
        FROM User 
        WHERE email = ?;
  `;
  const selectUserAccountRow = await connection.query(
      selectUserAccountQuery,
      email
  );
  return selectUserAccountRow[0];
}

// 프로필 조회
async function selectUserProfile(connection, userId) {
  const selectUserProfileQuery = `
        SELECT userId,
               firstName AS name,
               IFNULL(profileImgUrl, '') AS profileImg,
               DATE_FORMAT(createdAt, '%Y') AS createdAt,
               introduce
        FROM User
        WHERE userId = ?;
  `;
  const selectUserProfileRow = await connection.query(
      selectUserProfileQuery,
      userId
  );
  return selectUserProfileRow[0];
}

// 프로필 체크
async function checkIntroduce(connection, userId) {
  const checkIntroduceQuery = `
        SELECT introduce
        FROM User
        WHERE userId = ?;
  `;
  const checkIntroduceRow = await connection.query(
      checkIntroduceQuery,
      userId
  );
  return checkIntroduceRow[0];
}

// 프로필 수정
async function updateUserProfile(connection, introduce, userId) {
  const updateUserProfileQuery = `
        UPDATE User SET introduce = ?
        WHERE userId = ?;
  `;
  const updateUserProfileRow = await connection.query(
      updateUserProfileQuery,
      [introduce, userId]
  );
  return updateUserProfileRow;
}

// 호스트 체크
async function checkHost(connection, userIdFromJWT) {
  const checkHostQuery = `
        SELECT mode
        FROM User
        WHERE userId = ?;
    `;
  const checkHostRow = await connection.query(
      checkHostQuery,
      userIdFromJWT
  );

  return checkHostRow[0];
}

// 유저 모드 변경
async function changeMode(connection, userIdFromJWT) {
  const changeModeQuery = `
        UPDATE User SET mode = '호스트'
        WHERE userId = ?;
    `;
  const changeModeRow = await connection.query(
      changeModeQuery,
      userIdFromJWT
  );

  return changeModeRow[0];
}

// 계정 개인정보 조회
async function selectPersonalInfo(connection, userIdFromJWT) {
  const selectPersonalInfoQuery = `
        SELECT CONCAT(firstName, ' ' , lastName) AS name,
               IFNULL(gender, '지정되지 않음') AS gender,
               DATE_FORMAT(birth, '%Y년 %m월 %d일') AS birth,
               email,
               IFNULL(phoneNumber, '제공되지 않음') AS phoneNumber
        FROM User
        WHERE userId = ?;
    `;
  const selectPersonalInfoRow = await connection.query(
      selectPersonalInfoQuery,
      userIdFromJWT
  );

  return selectPersonalInfoRow[0];
}

// 계정 개인정보 조회
async function selectPersonalInfo(connection, userIdFromJWT) {
  const selectPersonalInfoQuery = `
        SELECT CONCAT(firstName, ' ' , lastName) AS name,
               IFNULL(gender, '지정되지 않음') AS gender,
               DATE_FORMAT(birth, '%Y년 %m월 %d일') AS birth,
               email
        FROM User
        WHERE userId = ?;
    `;
  const selectPersonalInfoRow = await connection.query(
      selectPersonalInfoQuery,
      userIdFromJWT
  );

  return selectPersonalInfoRow[0];
}

// 계정 개인정보 수정
async function updatePersonalInfo(connection, updatePersonalInfoParams) {
  const updatePersonalInfoQuery = `
    UPDATE User
    SET lastName = ?,
        firstName = ?,
        gender = ?,
        birth = ?,
        email = ?
    WHERE userId = ?;
    `;
  const updatePersonalInfoRow = await connection.query(
      updatePersonalInfoQuery,
      updatePersonalInfoParams
  );

  return updatePersonalInfoRow;
}


module.exports = {
  selectUserEmail,
  selectUserId,
  insertUserInfo,
  selectUserPassword,
  selectUserAccount,
  selectUserProfile,
  checkIntroduce,
  updateUserProfile,
  checkHost,
  changeMode,
  selectPersonalInfo,
  updatePersonalInfo
};
