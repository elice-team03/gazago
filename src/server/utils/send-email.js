const nodemailer = require('nodemailer');

function sendEmail(type, email, contentOfEmail) {
    let mail = null;
    //TODO: 함수밖으로 빼라
    const templatePasswordReset = {
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
                <p style="border-bottom: 1px solid lightgrey; padding-bottom: 5px">${contentOfEmail}</p>
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
    const templateEmailCertification = {
        from: process.env.NODEMAILER_ID,
        to: email,
        subject: `[GAZAGO] 유저님의 이메일 인증번호가 도착했습니다`,
        html: `
        <div style="width: 500px; margin: auto; text-align: center">
            <div style="text-align: center">
                <img src="https://i.imgur.com/onyitJ3.png" alt="" style="width: 200px" />
            </div>
            <div style="text-align: left; margin-top: 2rem">
                <p style="text-align: center; font-size: 30px; font-weight: bold; margin-bottom: 30px">
                    이메일 인증번호 발급
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
                    해당 인증번호를 가자고 홈페이지에 입력하시면, 회원가입이 완료됩니다.
                </p>
                <p style="text-indent: 10px; font-size: 18px; margin-top: 40px">이메일 인증번호</p>
                <p style="border-bottom: 1px solid lightgrey; padding-bottom: 5px">${contentOfEmail}</p>
            </div>
        </div> 
        `,
    };
    if (type === 'resetPassword') {
        mail = templatePasswordReset;
    }
    if (type === 'certificateEmail') {
        mail = templateEmailCertification;
    }
    const transport = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.NODEMAILER_ID,
            pass: process.env.NODEMAILER_SECRET,
        },
    });

    /** 임시 비밀번호 발송하는 메일형식 html inline style */

    return transport.sendMail(mail, (error) => {
        if (error) {
            throw Object.assign(new Error('이메일 발송이 실패하였습니다'), { status: 400 });
        }
        transport.close();
        return;
    });
}

module.exports = { sendEmail };
