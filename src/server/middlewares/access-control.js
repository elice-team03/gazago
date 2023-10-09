const requiredLogin = (req, res, next) => {
    if (!req.user) {
        return res.send("<script>alert('로그인 해주세요');location.href='http://localhost:5001/login';</script>");
    }
    next();
    return;
};

const checkAdmin = (req, res, next) => {
    if (req.user?.user.role === 'admin') {
        next();
        return;
    }
    return res.send("<script>alert('관리자만 접근이 가능합니다');location.href='http://localhost:5001/';</script>");
};

const blockLogin = (req, res, next) => {
    if (req.user) {
        return res.send("<script>alert('잘못된 접근입니다.');location.href='http://localhost:5001/';</script>");
    }
    next();
    return;
};

module.exports = {
    checkAdmin,
    requiredLogin,
    blockLogin,
};
