import * as Api from '/api.js';
import { getUserAddress } from './user_address.js';

const userMailInput = document.querySelector('#userMail');
// const authCodeInput = document.querySelector('#authCode');
const phoneInput = document.querySelector('#phone');
const address1Input = document.querySelector('#address1');
const address2Input = document.querySelector('#address2');
// const address3Input = document.querySelector('#address3');
const editForm = document.querySelector('#form-container');

// 화면 로드시 로그인 회원정보 불러오기
async function getUserData() {
    try {
        const result = await Api.get('http://localhost:5001/api/users');
        if (result.code === 200) {
            const user = result.data;
            console.log(user);
            userMailInput.value = user.email;
            phoneInput.value = user.delivery.contact;
            address1Input.value = user.delivery.code;
            address2Input.value = user.delivery.address;
        } else {
            alert(result.message);
        }
        // address3Input.value = result.address3; 상세주소?
    } catch (error) {
        console.error('데이터를 가져오는 중 오류가 발생했습니다:', error);
    }
}
getUserData();

// 회원 주소 등록
// function editUserAdress() {
//     const address1Input = document.querySelector('#address1');
//     const address2Input = document.querySelector('#address2');
//     getUserAddress();
// }

// 회원 정보 수정
// async function editUserInfo() {
//   try {
//     const result = Api.patch('http://localhost:5001/api/users');
//     if(result.code === 200) { 

//     }
//   } catch (error) {
//     console.error('데이터를 가져오는 중 오류가 발생했습니다:', error);
//   }
// }

// editForm.addEventListener('submit', editUserInfo);



