const { User } = require('../db');
const bcrypt = require('bcrypt');
const setUserToken = require('../utils/jwt');

class userService {
    static async addUser(newUser) {
        return await User.create(newUser);
    }

    static async findAllUsers() {
        return await User.find({});
    }

    static async findUser(_id) {
        return await User.findById(_id).populate('orders').populate('delivery').populate('wishList');
    }
    static async findOneUser(email) {
        return await User.findOne({ email: email });
    }

    static async addUserOrder(userId, orderId) {
        await User.findByIdAndUpdate(
            {
                _id: userId,
            },
            { $push: { orders: orderId } }
        );
        return;
    }
    static async addUserDelivery(userId, deliveryId) {
        await User.findByIdAndUpdate(
            {
                _id: userId,
            },
            {
                delivery: deliveryId,
            }
        );
        return;
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

    static async signUpGuest(userInform) {
        const { email, userName } = userInform;
        const checkEmail = await userService.findOneUser(email);

        if (checkEmail) {
            throw Object.assign(new Error('이미 등록된 이메일입니다'), { status: 400 });
        }
        //TODO: 임시로 비밀번호 없이 회원가입
        return await userService.addUser({
            email,
            userName,
            role: 'guest',
        });
    }

    static async signInUser(checkedUser, password, res) {
        const hashedPassword = checkedUser.password;
        const checkPassword = await bcrypt.compare(password, hashedPassword);
        if (!checkPassword) {
            throw Object.assign(new Error('이메일 혹은 패스워드가 일치하지 않습니다'), { status: 400 });
        }

        setUserToken(res, checkedUser);
        return checkedUser.email;
    }
}

module.exports = { userService };
