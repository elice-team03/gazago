const { User } = require('../db');
const bcrypt = require('bcrypt');
const setUserToken = require('../utils/jwt');
const generateRandomPasswrod = require('../utils/generate-password');
const nodemailer = require('nodemailer');

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
        console.log(user.wishList);
        for (const productId of productIds) {
            console.log(productId);
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
        const { password, email, res } = userInform;

        const hashedPassword = await bcrypt.hash(password, 10);

        return await userService.addUser({
            email,
            password: hashedPassword,
            confirmationToken: generateRandomNumber(),
        });
    }

    static async compareEmailNumber(userId, certificationNumber) {
        const user = await User.findById({ _id: userId });

        if (!user) {
            throw Object.assign(new Error('올바른 메일이 아닙니다'), { status: 400 });
        }

        if (user.confirmationToken !== certificationNumber) {
            throw Object.assign(new Error('인증번호가 일치하지 않습니다. 다시 입력해 주세요'), { status: 400 });
        }

        await User.updateOne({ _id: userId }, { confirmationAt: Date.now() });

        return;
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
        const newPassword = generateRandomPassword();
        const newHashedPassword = await bcrypt.hash(newPassword, 10);

        const user = await User.findOne({ email: email });
        if (!user) {
            throw Object.assign(new Error('이메일이 일치하지 않습니다'), { status: 400 });
        }
        await User.updateOne({ email: email }, { password: newHashedPassword });

        const transport = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.NODEMAILER_ID,
                pass: process.env.NODEMAILER_SECRET,
            },
        });

        /** 임시 비밀번호 발송하는 메일형식 html inline style */
        const mail = {
            from: process.env.NODEMAILER_ID,
            to: email,
            subject: `[GAZAGO] 유저님의 비밀번호가 초기화 되었습니다`,
            html: `
            <div style="width: 500px; margin: auto; text-align: center">
                <div style="text-align: center">
                    <img src="https://i.imgur.com/onyitJ3.png" alt="" style="width: 200px" />
                </div>
                <div style="text-align: left; margin-top: 2rem">
                    <p style="text-align: center; font-size: 30px; font-weight: bold; margin-bottom: 30px">
                        임시 비밀번호 발급
                    </p>
                    <hr style="background: #395144; height: 3px; border: 0" />
                    <p
                        style="
                            font-size: 18px;
                            width: 32ch;
                            text-align: left;
                            word-spacing: -1px;
                            line-height: 1.1;
                            font-weight: bold;
                            word-break: keep-all;
                        "
                    >
                        임시 비밀번호로 로그인 하신 후에, 안전한 비밀번호로 변경 부탁드립니다.
                    </p>
                    <p style="text-indent: 10px; font-size: 18px; margin-top: 40px">임시 비밀번호</p>
                    <p style="border-bottom: 1px solid lightgrey; padding-bottom: 5px">${newPassword}</p>
                    <a
                        href="http://localhost:5001/login"
                        style="
                            display: block;
                            width: 100%;
                            background: #004225;
                            height: 45px;
                            line-height: 45px;
                            border-radius: 100vmax;
                            color: white;
                            text-decoration: none;
                            font-weight: bold;
                            text-align: center;
                            margin-top: 2em;
                            font-size: 18px;
                        "
                    >
                        로그인 하러가기
                    </a>
                </div>
            </div> 
            `,
        };

        return transport.sendMail(mail, (error) => {
            if (error) {
                throw Object.assign(new Error('이메일 발송이 실패하였습니다'), { status: 400 });
            }
            transport.close();
            return;
        });
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
