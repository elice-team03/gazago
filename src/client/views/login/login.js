import * as Api from '../api.js';

const userEmail = document.querySelector('#user-mail');
const userPassword = document.querySelector('#password');
const loginForm = document.querySelector('#form-container');

async function loginHandler(event) {
    event.preventDefault();
    const email = userEmail.value;
    const password = userPassword.value;

    try {
        const data = { email, password };
        const login = await Api.post('http://localhost:5001/api/users/login', data);

        if (login.code === 200) {
            alert(login.message);
            window.location.href = '/';
        } else {
            alert(login.message);
        }
    } catch (error) {
        console.error('클라이언트 예외가 발생했습니다:', error);
    }
}

loginForm.addEventListener('submit', loginHandler);
