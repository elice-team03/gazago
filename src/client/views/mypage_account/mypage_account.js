import * as Api from '/api.js';

let $email = document.querySelector('#userMail');
const newAuthCodeInput = document.querySelector('#newAuthCode');
const confirmedCodeInput = document.querySelector('#confirmedCode');
const submitNewCodeButton = document.querySelector('#submitNewCode');
let $contact = document.querySelector('#phone');
let $code = document.querySelector('#zipcode');
let $address = document.querySelector('#address');
let $subAddress = document.querySelector('#detailAddress');
const editButton = document.querySelector('.edit-btn');

let loggedInUser = null;

// 화면 로드시 로그인한 회원정보 불러오는 함수
async function getUserData() {
    try {
        const result = await Api.get('http://localhost:5001/api/users');
        if (result.code === 200) {
            return result.data;
        }
    } catch (error) {
        console.error('데이터를 가져오는 중 오류가 발생했습니다:', error);
    }
}

async function printUserData(user) {
    $email.value = user.email;
    // console.log(user);
    if (user.delivery) {
        $contact.value = user.delivery.contact;
        $code.value = user.delivery.code;
        $address.value = user.delivery.address;
        $subAddress.value = user.delivery.subAddress;
    }
}
// 회원 정보 수정
async function editUserInfo(event) {
    event.preventDefault();
    const contact = $contact.value;
    const code = $code.value;
    const address = $address.value;
    const subAddress = $subAddress.value;
    const inputData = { contact, code, address, subAddress };
    console.log(inputData);
    try {
        const result = await Api.patch('http://localhost:5001/api/users/delivery', inputData);
        if (result.code === 200) {
            alert('회원 정보 수정 완료');
            // window.location.reload();
        }
    } catch (error) {
        console.error('데이터를 가져오는 중 오류가 발생했습니다:', error);
    }
}

const setError = (element, message) => {
    const inputControl = element.parentElement;
    const errDisplay = inputControl.querySelector('.error');

    errDisplay.innerText = message;
    inputControl.classList.add('error');
    inputControl.classList.remove('success');
};

const setSuccess = (element) => {
    const inputControl = element.parentElement;
    const errDisplay = inputControl.querySelector('.error');

    errDisplay.innerText = '';
    inputControl.classList.remove('error');
    inputControl.classList.add('success');
};

// 비밀번호 유효성 검사
function validatePassword() {
    const newAuthCode = newAuthCodeInput.value;
    const confirmedCode = confirmedCodeInput.value;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/;

    if (!passwordRegex.test(newAuthCode)) {
        setError(newAuthCodeInput, '비밀번호는 최소 8자 이상, 영문, 숫자, 특수문자를 포함해야 합니다.');
        return false;
    } else {
        setSuccess(newAuthCodeInput);
    }

    if (newAuthCode !== confirmedCode) {
        setError(confirmedCodeInput, '비밀번호가 일치하지 않습니다.');
        return false;
    } else {
        setSuccess(confirmedCodeInput);
    }

    return true;
}

// 비밀번호 수정
async function editPassword(event) {
    event.preventDefault();

    if (validatePassword()) {
        const newPassword = newAuthCodeInput.value;
        const data = { newPassword }; // 변경된 비밀번호
        console.log(data);
        try {
            const result = await Api.patch('http://localhost:5001/api/users/password', data);

            if (result.code === 200) {
                alert(result.message);
            } else {
                alert(result.message);
            }
        } catch (error) {
            console.error(error);
        }
    }
}

submitNewCodeButton.addEventListener('click', editPassword);

async function app() {
    loggedInUser = await getUserData();
    printUserData(loggedInUser);
    editButton.addEventListener('click', editUserInfo);
}

app();
