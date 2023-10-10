import * as Api from '/api.js';

// 로그인 회원 정보 가져오는 함수
async function getUserData() {
  try {
      const result = await Api.get('http://localhost:5001/api/users');
      if (result.code === 200) {
          const user = result.data;
          console.log(user);

      } else {
          alert(result.message);
      }
  } catch (error) {
      console.error('데이터를 가져오는 중 오류가 발생했습니다:', error);
  }
}
getUserData();

async function getUserOrderList () {
  try {
    const result = await Api.get('http://localhost:5001/api/users')
    if(result.code === 200) {

    }
  } catch (error) {
    
  }
} 

getUserOrderList();