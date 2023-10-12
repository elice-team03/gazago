import * as Api from '/api.js';

const userMailInput = document.querySelector('#userMail');
// const authCodeInput = document.querySelector('#authCode');
const phoneInput = document.querySelector('#phone');
const zipcodeInput = document.querySelector('#zipcode');
const addressInput = document.querySelector('#address');
const detailAddressInput = document.querySelector('#detailAddress');
const editButton = document.querySelector('.edit-btn');

// 화면 로드시 로그인한 회원정보 불러오는 함수
async function getUserData() {
    try {
        const result = await Api.get('http://localhost:5001/api/users');
        if (result.code === 200) {
            const user = result.data;
            console.log(user);
            userMailInput.value = user.email;
            phoneInput.value = user.delivery?.contact;
            zipcodeInput.value = user.delivery?.code;
            addressInput.value = user.delivery?.address;
            detailAddressInput.value = user.delivery?.subAddress;
        } else {
            alert(result.message);
        }
    } catch (error) {
        console.error('데이터를 가져오는 중 오류가 발생했습니다:', error);
    }
}
getUserData();

// 회원 정보 수정
async function editUserInfo() {
  try {
    const result = Api.patch('http://localhost:5001/api/users');
    if(result.code === 200) { 
      alert('회원 정보 수정 완료');
      // window.location.reload();
    }
  } catch (error) {
    console.error('데이터를 가져오는 중 오류가 발생했습니다:', error);
  }
}

editButton.addEventListener('click', editUserInfo);



