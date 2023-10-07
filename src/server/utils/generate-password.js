const { customAlphabet } = require('nanoid');

module.exports = () => {
    const nanoid = customAlphabet('0123456789ABCDEF#$%^&*', 15);
    const regExp = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()])[a-zA-Z0-9!@#$%^&*()]{15}$/;
    let randomPassword = null;
    let count = 0;
    while (!regExp.test(randomPassword) && count < 10) {
        randomPassword = nanoid();
        count++;
    }

    if (count === 10) {
        // 만약 nanoid가 비밀번호 조건을 충족시키지 못할 때를 대비
        randomPassword = process.env.RANDOM_USER_PASSWORD;
    }

    return randomPassword;
};
