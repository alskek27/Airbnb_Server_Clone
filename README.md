## RC 3기 라이징 테스트 - Airbnb

### 2022-01-08 진행상황
- 클라이언트와 함께 프로젝트 기획서 작성
- Airbnb 서비스 분석
- ERD 설계 시작
    - User
    - Room
    - Search

### 2022-01-09 진행상황
- 1차 피드백 전, ERD 설계 완료
    - RoomImg
    - Reservation
    - Review
    - RoomType
    - Category
    - WishList
        - WishMapping
    - Amenities
        - AmenitiesMapping

### 2022-01-10 진행상황
- 서버 1차 피드백 내용
    - ERD 더 디테일하게
        - User -> 게스트, 호스트, 슈퍼호스트 구분
        - Room -> 위도, 경도 추가
        - Room -> 숙박 장소 정보 추가
    - dev, prod 도메인에 SSL 적용할 것 (완료)
    - 생산성 높일 것
- API 명세서 리스트업 (22개)
- RDS 데이터베이스 구축
- dev 폴더에 노드 템플릿 적용
- Reverse Proxy 적용

### 2022-01-11 진행상황
- ERD 수정
  - User -> mode 컬럼 추가
  - Room -> latitude, longitude 컬럼 추가
  - RoomType -> building, type, detail 컬럼 추가
  - StayPlace 테이블 추가
- API 구현 및 명세서 작성
  - 회원가입 API
  - 로그인 API

### 2022-01-12 진행상황
- API 구현 및 명세서 작성
  - 자동 로그인 API
  - 검색 기록 등록 API
- API dev 서버 반영
  - 회원가입 API
  - 로그인 API
  - 자동 로그인 API
- 개발 이슈
  - 검색 기록 등록 API에서 adults, children, infants, pets 컬럼들이 default 값인 0이 아니라, null로 들어가는 오류 발생
  - int default 0 null -> int unsigned default '0' not null (수정)
  - datagrip 환경에선 default 값이 정상적으로 들어가지만, postman 환경에선 제대로 들어가지 않음
  - searchController.js 파일에서 validation으로 값이 null일 경우, 0으로 변환시켜주는 식으로 처리

### 2022-01-13 진행상황
- API 구현 및 명세서 작성
  - 최근 검색 기록 조회 API
  - 숙소 조회 API
- API dev 서버 반영
  - 검색 기록 등록 API
  - 최근 검색 기록 조회 API
- 클라이언트 개발자 분과 소통
  - 숙소 이미지 처리 -> 클라이언트에서 도전해보고 싶다!
  - 혹시 모르니, 서버에서도 이미지를 보내주는 걸로 결정
- DB에 필요한 데이터 값 입력

### 2022-01-14 진행상황
- API 구현 및 명세서 작성, dev 서버 반영
  - 숙소 상세 조회 API
  - 숙소 후기 조회 API
- 개발 이슈
  - DB에 저장한 숙소 이미지를 읽어올 수 없는 오류 발생
  - 클라이언트 분께 이미지 파일 넘겨드려서 클라이언트에서 해결할 수 있도록 조치

### 2022-01-15 진행상황
- API 구현 및 명세서 작성
  - 위시리스트 생성, 조회, 수정, 상세 조회 API
  - 숙소 찜 상태 변경 API
    - 찜하기, 취소하기 한번에 묶어서 처리
- 수정해야 할 것
  - 숙소 조회에서 찜 상태 보여줄 수 있도록 쿼리문 수정
    - jwt 이용한 회원용 API로 바꾸기

### 2022-01-16 진행상황
- API 구현 및 명세서 작성
  - 위시리스트 삭제 API
- 숙소 조회 API 수정
  - jwt 이용해서 찜 상태 보여줄 수 있도록 수정
- 위시리스트 관련 API 전부 dev 서버에 반영 완료