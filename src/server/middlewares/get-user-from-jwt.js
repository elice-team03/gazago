const passport = require('passport');

module.exports = (req, res, next) => {
    if (!req.cookies.authorization) {
        next();
        return;
    }
    return passport.authenticate('jwt', { session: false })(req, res, next);
};
