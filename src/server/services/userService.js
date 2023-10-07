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

        const mail = {
            from: process.env.NODEMAILER_ID,
            to: email,
            subject: `[GAZAGO] 유저님의 비밀번호가 초기화 되었습니다`,
            html: `
            <div style="background: rgba(57, 81, 68, 0.3); padding: 5em; border-radius: 20px; 
            text-align: center;">
            <div style="display: inline-block; width: 200px; height: 200px; overflow:hidden; border-radius: 10px">
            <img src="https://i.imgur.com/onyitJ3.png" alt="" object-fit: cover; > </div>
            <h1 style="color:crimson; font-size:28px;">유저님의 비밀번호가 초기화 되었습니다.</h1>
            <p style="font-size:23px">비밀번호는 ${newPassword} 입니다.</p>
            <p style="font-size:23px">로그인 후 비밀번호를 변경하여 주시기 바랍니다.</p>
            <p style="font-size:23px">THANK YOU</p> 
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
