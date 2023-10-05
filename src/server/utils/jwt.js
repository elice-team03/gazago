const jwt = require('jsonwebtoken');

const setUserToken = (res, user) => {
    const token = jwt.sign({ user }, process.env.JWT_SECRET);
    res.cookie('token', token, { httpOnly: true });
};

module.exports = setUserToken;
