const nodemailer = require('nodemailer');

async function sendEmail(type, email, contentOfEmail) {
    if (type === 'changeDelivery') {
        contentOfEmail.contact = '연락처: ' + String(contentOfEmail.contact);
        contentOfEmail.code = '우편번호: ' + String(contentOfEmail.code);
        contentOfEmail.address = '주소: ' + String(contentOfEmail.address);
        contentOfEmail.subAddress = '상세주소: ' + String(contentOfEmail.subAddress);
    }

    /** 임시 비밀번호 발송하는 메일형식 html inline style */
    let mail = null;

    /** 임시비밀번호 메일발송 템플릿 */
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
                    href="http://kdt-sw-6-team03.elicecoding.com/login"
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
                        font-size: 18px;">
                        로그인 하러가기</a>
            </div>
        </div> 
        `,
    };
    /** 이메일 인증 메일발송 템플릿 */
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
    /** 카탈로그 알림 메일 */
    const formattedPrice0 = `₩${contentOfEmail[0]?.price?.toLocaleString()}`;
    const formattedPrice1 = `₩${contentOfEmail[1]?.price?.toLocaleString()}`;
    const formattedPrice2 = `₩${contentOfEmail[2]?.price?.toLocaleString()}`;
    const templateCatalog = {
        from: process.env.NODEMAILER_ID,
        to: email,
        subject: `[GAZAGO] "이번 달의 핫 아이템, 놓치지 마세요!"`,
        html: `
        <div style="width: 1000px; margin: auto; text-align: center">
            <div style="text-align: center">
                <img src="https://i.imgur.com/onyitJ3.png" alt="" style="width: 200px" />
            </div>
            <div style="text-align: left; margin-top: 2rem">
                <p style="text-align: center; font-size: 30px; font-weight: bold; margin-bottom: 30px">
                    이번 달 핫 아이템
                </p>
                <hr style="background: #395144; height: 3px; border: 0" />

                <div style="margin-inline: auto; display:flex; justify-content:space-between; padding: 2rem 0; ">
                    <div style="text-align:center;position:relative;margin-right: 20px; border: 1px solid black; border-radius: 10px; padding: 1em; width:30%;">
                    <div
                                style="
                                    position: absolute;
                                    width: 50px;
                                    height: 50px;
                                    background: crimson;
                                    border-radius: 100vmax;
                                    line-height: 50px;
                                    text-align: center;
                                    left: -5px;
                                    top: -4px;

                                    color: white;
                                    font-weight: bold;
                                "
                            >
                                1위
                            </div>
                        <div
                            style="  
                                border-radius: 10px;
                                overflow: hidden;
                                background: #ddd;
                                width: 200px;
                                height: 200px;
                                margin: 0 auto;
                            "
                        >
                            <img src="${contentOfEmail[0]?.thumbnailPath}" alt="" style="object-fit: cover; width: 100%" />
                            
                        </div>
                        <div>
                            <span>${contentOfEmail[0]?.brand}</span><span style="margin-left: auto;">${contentOfEmail[0]?.name}</span>
                        </div>
                        <p>${formattedPrice0}</p>
                    </div>
                    <div style="text-align: center;position:relative; margin-right: 20px; border: 1px solid black; border-radius: 10px; padding: 1em; width:30%;">
                    <div
                                style="
                                    position: absolute;
                                    width: 50px;
                                    height: 50px;
                                    background: crimson;
                                    border-radius: 100vmax;
                                    line-height: 50px;
                                    text-align: center;
                                    left: -5px;
                                    top: -4px;

                                    color: white;
                                    font-weight: bold;
                                "
                            >
                                2위
                            </div>
                        <div
                            style="
                            border-radius: 10px;
                            overflow: hidden;
                            background: #ddd;
                            width: 200px;
                            height: 200px;
                            margin: 0 auto;
                            "
                        >
                            <img src="${contentOfEmail[1]?.thumbnailPath}" alt="" style="object-fit: cover; width: 100%" />
                            
                        </div>
                        <div>
                            <span>${contentOfEmail[1]?.brand}</span><span style="margin-left: auto;">${contentOfEmail[1]?.name}</span>
                        </div>
                        <p>${formattedPrice1}</p>
                    </div>
                    <div style="text-align: center; border: 1px solid black; border-radius: 10px; padding: 1em; position:relative; width:30%;">
                    <div
                                style="
                                    position: absolute;
                                    width: 50px;
                                    height: 50px;
                                    background: crimson;
                                    border-radius: 100vmax;
                                    line-height: 50px;
                                    text-align: center;
                                    left: -5px;
                                    top: -4px;

                                    color: white;
                                    font-weight: bold;
                                "
                            >
                                3위
                            </div>
                        <div
                            style="
                            border-radius: 10px;
                            overflow: hidden;
                            background: #ddd;
                            width: 200px;
                            height: 200px;
                            margin: 0 auto
                            "
                        >
                            <img src="${contentOfEmail[2]?.thumbnailPath}" alt="" style="object-fit: cove; width: 100%" />
                            
                        </div>
                        <div >
                            <span>${contentOfEmail[2]?.brand}</span><span style="margin-left: auto;">${contentOfEmail[2]?.name}</span>
                        </div>
                        <p>${formattedPrice2}</p>
                    </div>
                </div>
            </div>
            <a
                    href="http://kdt-sw-6-team03.elicecoding.com/"
                    style="
                        display:inline-block;
                        width: 50%;
                        background: #004225;
                        height: 45px;
                        line-height: 45px;
                        border-radius: 100vmax;
                        color: white;
                        text-decoration: none;
                        font-weight: bold;
                        text-align: center;
                        margin-top: 2em;
                        font-size: 18px;">
                        구매하러 가기</a>
            </div>
        `,
    };
    /** 배송지 정보변경 알림메일 */
    const templateDeliveryInform = {
        from: process.env.NODEMAILER_ID,
        to: email,
        subject: `[GAZAGO] 유저님의 배송지가 다음으로 변경되었습니다`,
        html: `
        <div style="width: 500px; margin: auto; text-align: center">
            <div style="text-align: center">
                <img src="https://i.imgur.com/onyitJ3.png" alt="" style="width: 200px" />
            </div>
            <div style="text-align: left; margin-top: 2rem">
                <p style="text-align: center; font-size: 30px; font-weight: bold; margin-bottom: 30px">
                    배송지 변경 안내
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
                    다음의 배송지 정보로 변경되었습니다.
                </p>
                <p style="font-size: 18px; margin-top: 40px">${contentOfEmail.contact}</p>
                <p style="font-size: 18px;">${contentOfEmail.code}</p>
                <p style="font-size: 18px;">${contentOfEmail.address}</p>
                <p style="font-size: 18px;">${contentOfEmail.subAddress}</p>
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
    if (type === 'changeDelivery') {
        mail = templateDeliveryInform;
    }
    if (type === 'sendCatalog') {
        mail = templateCatalog;
    }
    const transport = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.NODEMAILER_ID,
            pass: process.env.NODEMAILER_SECRET,
        },
    });

    return transport.sendMail(mail, (error) => {
        if (error) {
            throw Object.assign(new Error('이메일 발송이 실패하였습니다'), { status: 400 });
        }
        transport.close();
        return;
    });
}

module.exports = { sendEmail };
