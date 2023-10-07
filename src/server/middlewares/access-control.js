const allowOnlyUser = (req, res, next) => {
    if (req.user?.user.role !== 'users') {
        return res.send(
            "<script>alert('로그인이 필요한 페이지입니다');location.href='http://localhost:5001/login';</script>"
        );
    }
    next();
    return;
};

module.exports = {
    allowOnlyUser,
};
