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
    static async findOneUser(userInform) {
        return await User.findOne({ email: userInform });
    }

    static async removeUser(_id) {
        return await User.findByIdAndDelete(_id);
    }

    static async signUpUser(userInform) {
        const { password, email } = userInform;

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await userService.addUser({
            email,
            password: hashedPassword,
        });

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
