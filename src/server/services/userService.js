const { User } = require('../db');
const bcrypt = require('bcrypt');
const setUserToken = require('../utils/jwt');
const generateRandomPasswrod = require('../utils/generate-password');
const nodemailer = require('nodemailer');
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

    static async findPasswordByEmail(email) {
        const newPassword = generateRandomPasswrod();
        const newHashedPassword = await bcrypt.hash(newPassword, 10);

        const user = await User.findOneAndUpdate({ email: email }, { password: newHashedPassword });

        if (!user) {
            throw Object.assign(new Error('이메일이 일치하지 않습니다'), { status: 400 });
        }

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
                    >로그인 하러가기</a
                >
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

        // const user = await User.findOneAndUpdate({ email: email }, {});
    }
}

module.exports = { userService };
