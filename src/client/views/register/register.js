const registerForm = document.querySelector('#form-container');
const emailInput = document.querySelector('#email-input');
const passwordInput = document.querySelector('#password-input');
const confirmedPwInput = document.querySelector('#confirmpw-input');

const setError = (element, message) => {
    const inputControl = element.parentElement;
    const errDisplay = inputControl.querySelector('.error');

    console.log('element:', element);
    console.log('errDisplay:', errDisplay);

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
    const validEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!validEmail.test(email)) {
        setError(emailInput, '이메일 주소를 정확히 입력해주세요.');
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
    } else {
        setSuccess(passwordInput);
    }

    if (confirmedPassword !== password) {
        setError(confirmedPwInput, '비밀번호가 일치하지 않습니다.');
    } else {
        setSuccess(confirmedPwInput);
    }
};

registerForm.addEventListener('submit', (event) => {
    event.preventDefault();
    validateRegister();
    // 필요에 따라 서버로 데이터를 제출하는 코드를 추가하세요.
});
