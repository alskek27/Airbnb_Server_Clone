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