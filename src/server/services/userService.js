const { User } = require('../db');
const bcrypt = require('bcrypt');
const setUserToken = require('../utils/jwt');
const generateRandomPasswrod = require('../utils/generate-password');
const nodemailer = require('nodemailer');
const { sendEmail } = require('../utils/send-email');

class userService {
    static async addUser(newUser) {
        return await User.create(newUser);
    }

    static async addUserOrder(userId, orderId) {
        await User.findByIdAndUpdate(
            { _id: userId },
            {
                $push: { orders: orderId },
            }
        );
    }

    static async addUserDelivery(userId, deliveryId) {
        await User.findByIdAndUpdate(
            { _id: userId },
            {
                delivery: deliveryId,
            }
        );
    }

    static async addUserWishlist(userId, productId) {
        await User.findByIdAndUpdate(
            { _id: userId },
            {
                $push: { wishList: productId },
            }
        );
        const updatedUser = await User.findById({ _id: userId });
        return updatedUser.wishList;
    }

    static async findUser(_id) {
        return await User.findById(_id).populate('orders').populate('delivery').populate('wishList');
    }

    static async findUserByEmail(email) {
        return await User.findOne({ email: email });
    }

    static async removeUserWishlist(userId, productIds) {
        const user = await User.findById(userId);
        for (const productId of productIds) {
            const index = user.wishList.indexOf(productId);

            if (index !== -1) {
                user.wishList.splice(index, 1);
            }
        }

        await user.save();
        return user.wishList;
    }

    /** 회원가입 */
    static async signUpUser(userInform) {
        const { password, email } = userInform;

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await userService.addUser({
            email,
            password: hashedPassword,
        });

        return user;
    }

    /** 로그인 */
    static async signInUser(checkedUser, password, res) {
        const hashedPassword = checkedUser.password;
        const checkPassword = await bcrypt.compare(password, hashedPassword);
        if (!checkPassword) {
            throw Object.assign(new Error('이메일 혹은 패스워드가 일치하지 않습니다'), { status: 400 });
        }

        setUserToken(res, checkedUser);
        return checkedUser.email;
    }

    /** 임시 비밀번호 메일발송 */
    static async changePasswordAndSendByEmail(email) {
        const newPassword = generateRandomPasswrod();
        const newHashedPassword = await bcrypt.hash(newPassword, 10);

        const user = await User.findOne({ email: email });
        if (!user) {
            throw Object.assign(new Error('이메일이 일치하지 않습니다'), { status: 400 });
        }
        await User.updateOne({ email: email }, { password: newHashedPassword });

        sendEmail('resetPassword', email, newPassword);

        return;
    }

    /** 비밀번호 변경. */
    static async changePassword(userInform) {
        const { newPassword, loggedInUser } = userInform;
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        await User.findOneAndUpdate({ _id: loggedInUser._id }, { password: hashedNewPassword });

        return;
    }
}

module.exports = { userService };
