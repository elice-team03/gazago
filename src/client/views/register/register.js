import * as Api from '../api.js';

const registerForm = document.querySelector('#form-container');
const emailInput = document.querySelector('#email-input');
const passwordInput = document.querySelector('#password-input');
const confirmedPwInput = document.querySelector('#confirmpw-input');

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

// 회원가입 유효성 검사
const validateRegister = () => {
    const email = emailInput.value;
    const password = passwordInput.value;
    const confirmedPassword = confirmedPwInput.value;

    // 이메일 유효성 검사
    const validEmail = /^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$/;
    if (!validEmail.test(email)) {
        setError(emailInput, '이메일 주소를 정확히 입력해주세요.');
        return false;
    } else {
        setSuccess(emailInput);
    }

    // 비밀번호 유효성 검사
    const num = password.search(/[0-9]/g);
    const eng = password.search(/[a-z]/gi);
    const spe = password.search(/[`~!@@#$%^&*|₩₩₩'₩";:₩/?]/gi);
    if (password.length < 8 || password.length > 16 || num < 0 || eng < 0 || spe < 0) {
        setError(
            passwordInput,
            '비밀번호는 최소 8자리 이상 16자리 이내로, 영문, 숫자, 특수문자를 조합하여 입력해주세요.'
        );
        return false;
    } else {
        setSuccess(passwordInput);
    }

    if (confirmedPassword !== password) {
        setError(confirmedPwInput, '비밀번호가 일치하지 않습니다.');
        return false;
    } else {
        setSuccess(confirmedPwInput);
    }

    return { email, password };
};

registerForm.addEventListener('submit', async function (event) {
    event.preventDefault();
    
    // 유효성 검사를 먼저 실행하고, 검사가 성공적이면 API 호출
    if (validateRegister()) {
        const { email, password } = validateRegister();

        try {
            const data = { email, password };
            const join = await Api.post('http://localhost:5001/api/users/register', data);

            if (join.code === 201) {
                // 서버에서 받은 메시지를 사용
                alert(join.message);
                window.location.href = '../login';
            } else {
                alert(join.message);
                window.location.href = '/';
            }
        } catch (error) {
            alert("클라이언트 예외가 발생했습니다: " + error);
        }
    }
});
