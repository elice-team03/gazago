GAZAGO : 캠핑용품 편집샵
====
![156202b42d984ce6a8190464c2e43215 (2)](https://github.com/elice-team03/gazago/assets/87300419/c860f127-8a96-4457-8600-cbbf7b09f3f1)<br/>
### 어디로든 가고싶은 당신을 위해
다양한 사용자를 위한, 다양한 브랜드의 캠핑용품 편집샵 GAZAGO   

팀원 소개
----
|이름|역할|링크|
|------|---|---|
|윤보영| 팀장, 프론트엔드|[깃허브](https://github.com/BoyoungYun)|
|오성현| 프론트엔드||
|김범수| 프론트엔드||
|김설화| 프론트엔드||
|이준영| 백엔드|[깃허브](https://github.com/given02)|
|박제성| 백엔드||

주요 페이지 화면
----
|이미지1|이미지2|
|------|---|
|이미지3|이미지4|

주요 기능
----
|<img src="https://github.com/elice-team03/gazago/assets/133957930/fcf147b9-6a56-4bff-a3b7-f23c15315f1f" width="300px">|영상2|
|------|---|
|영상3|<img src="https://github.com/elice-team03/gazago/assets/126126067/ea9f871b-1ac6-468c-b284-b85c923f7a49" width="300px"/>|

역할 & 배운 점 & 아쉬운 점
----
### Frontend
#### 윤보영
* aaaaaaaaa
  * bbbbbbbbbb
* cccccccccc
#### 오성현
* 회원가입
  * 사용자가 입력한 이메일과 비밀번호를 정규식을 사용하여 유효성을 검사
  * 이를 통해 사용자가 형식에 맞지 않는 데이터를 제출하는 것을 방지
  * 이미 가입된 회원은 오류 메세지를 통한 에러 처리
* 로그인 및 비밀번호 찾기
  * 클라이언트에서 입력된 데이터를 API 통해 서버로 전송
  * 유효하지 않은 이메일 또는 비밀번호를 입력지
* 마이페이지 내 정보
  * 사용자는 전화번호, 우편 번호, 주소 및 상세 주소를 수정
  * 비밀번호 변경 시, 코드는 새로운 비밀번호의 유효성을 검사
  * 회원 정보 변경 API와 비밀번호 변경 API를 분리하여 코드의 모듈화와 보안 강화에 중점
#### 김범수

#### 김설화

### Backend
#### 이준영

#### 박제성
- **유저 가입 및 인증 시스템**
  * **jwt-cookie**, **passport**를 사용하여 구현
  * 회원가입, 로그인, 로그아웃, 비밀번호 변경, 비밀번호 찾기
  * 페이지별 접근통제 미들웨어 구현 (GUEST, USER, ADMIN)
- **메일링 시스템**
  * **node-mailer**를 사용하여 구현
  * 비밀번호 찾기 (임시비밀번호 메일발송)
  * 배송지 변경 (변경정보 메일발송)
- **스케쥴링**
  * **node-cron**을 활용하여 전회원 대상 일정주기로 판매량 BEST3 아이템 카탈로그 발송
  * **node-memoryUsage** 기능으로 서버 메모리 감지하여 사용메모리 70% 초과 시 스케쥴링 중단기능 구현  
기술 스택
----
### Frontend
### Backend

기획
----
### 1. [프론트 피그마](https://www.figma.com/file/3v9IIxkNrYgIHYfiEu5lxp/Untitled?type=design&node-id=0-1&mode=design&t=UPp46GXNZMoWPAIc-0)
### 2. [API 명세서](https://www.postman.com/grey-shadow-358682/workspace/elice-project-1-team-3/request/25191700-a6b53621-9ccb-4152-bb93-924740d36b78)
### 3. ERD
![image](https://github.com/elice-team03/gazago/assets/39878215/c21c5052-0638-4ac6-8964-d5d752980adf)

수상 내역
----
![image](https://github.com/elice-team03/gazago/assets/87300419/d3f9b151-30fd-409d-9470-e793b12d751d)
