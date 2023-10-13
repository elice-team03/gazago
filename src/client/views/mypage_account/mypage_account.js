import * as Api from '/api.js';

const $email = document.querySelector('#userMail');
const $contact = document.querySelector('#phone');
const $code = document.querySelector('#zipcode');
const $address = document.querySelector('#address');
const $subAddress = document.querySelector('#detailAddress');
const editButton = document.querySelector('.edit-btn');

let loggedInUser = null;

// 화면 로드시 로그인한 회원정보 불러오는 함수
async function getUserData() {
    try {
        const result = await Api.get('/api/users');
        if (result.code === 200) {
            return result.data;
        }
    } catch (error) {
        console.error('데이터를 가져오는 중 오류가 발생했습니다:', error);
    }
}

async function printUserData(user) {
    $contact.value = user.delivery.contact;
    $code.value = user.delivery.code;
    $address.value = user.delivery.address;
    $subAddress.value = user.delivery.subAddress;
}

// 회원 정보 수정
async function editUserInfo(event) {
    event.preventDefault();
    const contact = $contact.value;
    const code = $code.value;
    const address = $address.value;
    const subAddress = $subAddress.value;
    const inputData = { contact, code, address, subAddress };
    try {
        const result = await Api.patch('/api/users/delivery', inputData);
        if (result.code === 200) {
            alert('회원 정보 수정 완료');
            // window.location.reload();
        }
    } catch (error) {
        console.error('데이터를 가져오는 중 오류가 발생했습니다:', error);
    }
}

async function app() {
    loggedInUser = await getUserData();
    printUserData(loggedInUser);
    editButton.addEventListener('click', editUserInfo);
}

app();