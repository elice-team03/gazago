function checkUrl(req, url) {
    let arr = [...url];
    let urlConnected = req.originalUrl.split('/')[1];

    return arr.includes(urlConnected);
}

const requiredLogin = (req, res, next) => {
    if (!req.user && checkUrl(req, ['cart', 'mypage', 'order'])) {
        return res.send("<script>alert('로그인 해주세요');location.href='http://localhost:5001/login';</script>");
    }
    next();
    return;
};

const checkAdmin = (req, res, next) => {
    if (req.user?.user.role !== 'admin' && checkUrl(req, ['admin'])) {
        console.log('hi');
        return res.send("<script>alert('관리자만 접근이 가능합니다');location.href='http://localhost:5001/';</script>");
    }
    next();
    return;
};

const blockLogin = (req, res, next) => {
    if (req.user && checkUrl(req, ['login', 'register', 'pw-find'])) {
        return res.send(
            "<script>alert('로그인 된 유저는 접근할 수 없습니다.');location.href='http://localhost:5001/';</script>"
        );
    }
    next();
    return;
};

module.exports = {
    requiredLogin,
    checkAdmin,
    blockLogin,
};
