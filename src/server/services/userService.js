const { User } = require('../db');
const bcrypt = require('bcrypt');

class userService {
    static async addUser(newUser) {
        return await User.create(newUser);
    }

    static async findAllUsers() {
        return await User.find({});
    }

    static async findUser(_id) {
        return await User.findById(_id);
    }
    static async findOneUser({ userInform }) {
        return await User.findOne({ userInform });
    }

    static async removeUser(_id) {
        return await User.findByIdAndDelete(_id);
    }

    static async signUpUser(userInform) {
        const { password, email, passwordConfirm } = userInform;
        const checkUser = await userService.findOneUser(email);
        if (checkUser) {
            throw Object.assign(new Error('이메일이 사용 중 입니다.'), { status: 400 });
        }

        // 구현예정) 이메일 형식 체크

        if (password !== passwordConfirm) {
            throw Object.assign(new Error('비밀번호가 일치하지 않습니다'), { status: 400 });
        }

        // 구현예정) 비밀번호 특수문자 포함여부 및 자리수 체크

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await userService.addUser({
            email,
            password: hashedPassword,
        });

        if (!user) {
            throw Object.assign(new Error('계정 생성에 실패하였습니다'), { status: 400 });
        }
        return user;
    }

    static async signInUser(userInform) {
        const { email, password } = userInform;
        const checkEmail = await userService.findOneUser(email);
        console.log(checkEmail);
        if (!checkEmail) {
            throw Object.assign(new Error('아이디 또는 비밀번호가 일치하지 않습니다'), { status: 400 });
        }
        const checkPassword = await bcrypt.compare(checkEmail.password, password);
        console.log(checkPassword);
    }
}

module.exports = { userService };
