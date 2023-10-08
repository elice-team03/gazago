const allowUser = (req, res, next) => {
    const role = req.user?.user.role || null;
    if (role !== 'user') {
        return res.send(
            "<script>alert('로그인이 필요한 페이지입니다');location.href='http://localhost:5001/login';</script>"
        );
    }
    next();
    return;
};

const allowAdmin = (req, res, next) => {
    const role = req.user?.user.role || null;
    if (role !== 'admin') {
        return res.send(
            "<script>alert('접근 권한이 없습니다. 분하쥬');location.href='http://localhost:5001';</script>"
        );
    }
    next();
    return;
};

const allowUserAndAdmin = (req, res, next) => {
    const role = req.user?.user.role || null;
    if (role !== 'user' && role !== 'admin') {
        return res.send(
            "<script>alert('로그인이 필요한 페이지입니다');location.href='http://localhost:5001/login';</script>"
        );
    }
    next();
    return;
};

const allowOrdererNotUserAndUserAndAdmin = (req, res, next) => {
    const role = req.user?.user.role || null;
    if (role !== 'ordererNotUser' && role !== 'user' && role !== 'admin') {
        return res.send(
            "<script>alert('로그인이 필요한 페이지입니다');location.href='http://localhost:5001/login';</script>"
        );
    }
    next();
    return;
};

const blockUserAndAdmin = (req, res, next) => {
    const role = req.user?.user.role || null;
    if (role === 'user' || role === 'admin') {
        return res.send("<script>alert('잘못된 접근입니다');location.href='http://localhost:5001';</script>");
    }
    next();
    return;
};

module.exports = {
    allowUser,
    allowAdmin,
    allowUserAndAdmin,
    allowOrdererNotUserAndUserAndAdmin,
    blockUserAndAdmin,
};
