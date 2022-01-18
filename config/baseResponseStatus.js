module.exports = {

    // Success
    SUCCESS : { "isSuccess": true, "code": 1000, "message":"성공" },

    // Common
    TOKEN_EMPTY : { "isSuccess": false, "code": 2000, "message":"JWT 토큰을 입력해 주세요." },
    TOKEN_VERIFICATION_FAILURE : { "isSuccess": false, "code": 3000, "message":"JWT 토큰 검증 실패" },
    TOKEN_VERIFICATION_SUCCESS : { "isSuccess": true, "code": 1001, "message":"JWT 토큰 검증 성공" },

    //Request error
    SIGNUP_FIRSTNAME_EMPTY : { "isSuccess": false, "code": 2001, "message":"이름을 입력해 주세요." },
    SIGNUP_LASTNAME_EMPTY : { "isSuccess": false, "code": 2002, "message":"성을 입력해 주세요." },
    SIGNUP_BIRTH_EMPTY : { "isSuccess": false, "code": 2003, "message":"생년월일을 입력해 주세요." },
    SIGNUP_EMAIL_EMPTY : { "isSuccess": false, "code": 2004, "message":"이메일을 입력해 주세요." },
    SIGNUP_EMAIL_LENGTH : { "isSuccess": false, "code": 2005, "message":"이메일은 30자리 미만으로 입력해 주세요." },
    SIGNUP_EMAIL_ERROR_TYPE : { "isSuccess": false, "code": 2006, "message":"이메일을 형식을 정확하게 입력해 주세요." },
    SIGNUP_PASSWORD_EMPTY : { "isSuccess": false, "code": 2007, "message": "비밀번호를 입력해 주세요." },
    SIGNUP_PASSWORD_LENGTH : { "isSuccess": false, "code": 2008, "message":"비밀번호는 6~20자리를 입력해 주세요." },

    SIGNIN_EMAIL_EMPTY : { "isSuccess": false, "code": 2009, "message":"이메일을 입력해 주세요" },
    SIGNIN_EMAIL_LENGTH : { "isSuccess": false, "code": 2010, "message":"이메일은 30자리 미만으로 입력해 주세요." },
    SIGNIN_EMAIL_ERROR_TYPE : { "isSuccess": false, "code": 2011, "message":"이메일을 형식을 정확하게 입력해 주세요." },
    SIGNIN_PASSWORD_EMPTY : { "isSuccess": false, "code": 2012, "message": "비밀번호를 입력해 주세요." },
    SIGNIN_PASSWORD_LENGTH : { "isSuccess": false, "code": 2013, "message":"비밀번호는 6~20자리를 입력해 주세요." },

    USER_USERID_EMPTY : { "isSuccess": false, "code": 2014, "message": "userId를 입력해 주세요." },
    USER_ID_NOT_MATCH : { "isSuccess": false, "code": 2015, "message": "유저 아이디 값을 확인해 주세요." },
    LOCATION_EMPTY : { "isSuccess": false, "code": 2016, "message": "위치를 입력해 주세요." },
    ROOM_ID_EMPTY : { "isSuccess": false, "code": 2017, "message": "roomId를 입력해 주세요." },
    WISHLIST_NAME_EMPTY : { "isSuccess": false, "code": 2018, "message": "listName을 입력해 주세요." },
    WISHLIST_ID_EMPTY : { "isSuccess": false, "code": 2019, "message": "wishId를 입력해 주세요." },

    CHECK_IN_DATE_EMPTY : { "isSuccess": false, "code": 2020, "message": "체크인 날짜를 입력해 주세요." },
    CHECK_OUT_DATE_EMPTY : { "isSuccess": false, "code": 2021, "message": "체크아웃 날짜를 입력해 주세요." },
    ADULTS_EMPTY : { "isSuccess": false, "code": 2022, "message": "성인 인원을 입력해 주세요." },
    CHILDREN_EMPTY : { "isSuccess": false, "code": 2023, "message": "어린이 인원을 입력해 주세요." },
    INFANTS_EMPTY : { "isSuccess": false, "code": 2024, "message": "유아 인원 입력해 주세요." },
    PETS_EMPTY : { "isSuccess": false, "code": 2025, "message": "반려동물 수를 입력해 주세요." },

    BUILDING_TYPE_EMPTY : { "isSuccess": false, "code": 2026, "message": "건물 유형을 입력해 주세요." },
    ROOM_TYPE_EMPTY : { "isSuccess": false, "code": 2027, "message": "숙소 유형을 입력해 주세요." },
    PLACE_TYPE_EMPTY : { "isSuccess": false, "code": 2028, "message": "공간 유형을 입력해 주세요." },
    MAX_PEOPLE_EMPTY : { "isSuccess": false, "code": 2029, "message": "게스트 수를 입력해 주세요." },
    BED_ROOM_NUM_EMPTY : { "isSuccess": false, "code": 2030, "message": "침실 수를 입력해 주세요." },
    BED_NUM_EMPTY : { "isSuccess": false, "code": 2031, "message": "침대 수를 입력해 주세요." },
    BATH_ROOM_NUM_EMPTY : { "isSuccess": false, "code": 2032, "message": "욕실 수를 입력해 주세요." },
    ROOM_TITLE_EMPTY : { "isSuccess": false, "code": 2033, "message": "숙소 제목을 입력해 주세요." },
    ROOM_DESCRIPTION_EMPTY : { "isSuccess": false, "code": 2034, "message": "숙소 설명을 입력해 주세요." },
    ROOM_CHARGE_EMPTY : { "isSuccess": false, "code": 2035, "message": "숙박비를 입력해 주세요." },
    MIN_DAY_EMPTY : { "isSuccess": false, "code": 2036, "message": "최소 숙박 일수를 입력해 주세요." },

    // Response error
    USER_REDUNDANT_EMAIL : { "isSuccess": false, "code": 3001, "message":"중복된 이메일입니다." },
    USER_EMAIL_WRONG : { "isSuccess": false, "code": 3002, "message": "이메일이 잘못되었습니다." },
    USER_PASSWORD_WRONG : { "isSuccess": false, "code": 3003, "message": "비밀번호가 잘못되었습니다." },
    USER_INACTIVE_ACCOUNT : { "isSuccess": false, "code": 3004, "message": "비활성화된 계정입니다. 고객센터에 문의해 주세요." },
    USER_WITHDRAWAL_ACCOUNT : { "isSuccess": false, "code": 3005, "message": "탈퇴된 계정입니다. 고객센터에 문의해 주세요." },

    ROOM_NOT_EXIST : { "isSuccess": false, "code": 3006, "message": "해당 숙소가 존재하지 않습니다." },
    WISHLISTS_NOT_EXITS : { "isSuccess": false, "code": 3007, "message": "해당 위시리스트가 존재하지 않습니다." },
    NOT_WISHLIST_USER : { "isSuccess": false, "code": 3008, "message": "해당 계정의 위시리스트가 아닙니다." },

    ROOM_HOST_USER : { "isSuccess": false, "code": 3009, "message": "호스트는 자신의 숙소를 예약할 수 없습니다." },
    MAX_PEOPLE_EXCEED : { "isSuccess": false, "code": 3010, "message": "최대 숙박 인원을 초과하였습니다." },

    RESERVATION_NOT_EXIST : { "isSuccess": false, "code": 3011, "message": "예약 정보가 존재하지 않습니다." },
    RESERVATION_EXIST : { "isSuccess": false, "code": 3012, "message": "이미 예약된 숙소입니다." },

    INTRODUCE_SAME : { "isSuccess": false, "code": 3013, "message": "소개에서 수정된 부분이 존재하지 않습니다." },

    //Connection, Transaction 등의 서버 오류
    DB_ERROR : { "isSuccess": false, "code": 4000, "message": "데이터 베이스 에러"},
    SERVER_ERROR : { "isSuccess": false, "code": 4001, "message": "서버 에러"},
}
