const { User } = require('../db');
const { handleError } = require('../utils/error-handle');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const signUp = async (req, res, next) => {
    const { email, password, passwordConfirm } = req.body;
    const ERROR_MESSAGE_DUPLICATED_EMAIL = '사용 중인 이메일입니다';
    const ERROR_MESSAGE_NOT_EQUAL_PASSWORD = '비밀번호가 일치하지 않습니다';

    //구현예정) 이메일 형식 일치여부

    //이메일 중복 확인
    try {
        const checkEmail = await User.findOne({ email });
        if (checkEmail) {
            throw new Error(ERROR_MESSAGE_DUPLICATED_EMAIL);
        }
    } catch (e) {
        handleError(e, 400, ERROR_MESSAGE_DUPLICATED_EMAIL);
        next(e);
        return;
    }

    //재입력 비밀번호 일치확인
    try {
        if (password !== passwordConfirm) throw new Error(ERROR_MESSAGE_NOT_EQUAL_PASSWORD);
    } catch (e) {
        handleError(e, 400, ERROR_MESSAGE_NOT_EQUAL_PASSWORD);
        next(e);
        return;
    }

    //구현예정) 비밀번호 특수문자 체크

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        email,
        password: hashedPassword,
    });

    res.status(201).json({ user: user });
};

const signIn = async (req, res, next) => {
    const { email, password } = req.body;
    const ERROR_MESSAGE_INVALID_EMAIL_AND_PASSWORD = '이메일 또는 비밀번호가 일치하지 않습니다';
    let user = {};

    //이메일 존재여부 체크
    try {
        const checkEmail = await User.findOne({ email });
        if (!checkEmail) {
            throw new Error(ERROR_MESSAGE_INVALID_EMAIL_AND_PASSWORD);
        }
        user = checkEmail;
    } catch (e) {
        handleError(e, 400, ERROR_MESSAGE_INVALID_EMAIL_AND_PASSWORD);
        next(e);
        return;
    }

    //비밀번호 일치여부 체크
    try {
        if (!(await bcrypt.compare(password, user.password))) {
            user = null;
            throw new Error(ERROR_MESSAGE_INVALID_EMAIL_AND_PASSWORD);
        }
    } catch (e) {
        handleError(e, 400, ERROR_MESSAGE_INVALID_EMAIL_AND_PASSWORD);
        next(e);
        return;
    }

    const token = jwt.sign({ user }, process.env.JWT_SECRET);

    res.end();
};

module.exports = {
    signUp,
    signIn,
};
