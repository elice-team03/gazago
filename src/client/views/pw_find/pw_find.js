import * as Api from '../api.js';

const emailInput = document.querySelector('#userMail');
const emailForm = document.querySelector('#form-container');

// 임시 비밀번호 전송 핸들러
async function sendEmailHandler(event) {
    event.preventDefault();

    try {
        const email = emailInput.value;
        const data = { email };
        const result = await Api.post('http://localhost:5001/api/users/password', data);
        if (result.code === 200) {
            alert(result.message);
        } else {
            alert(result.message);
        }
    } catch (error) {
        console.error(error);
    }
}

emailForm.addEventListener('submit', sendEmailHandler);
