const passport = require('passport');

const jwt = require('./strategies/jwt');

module.exports = () => {
    passport.use(jwt);
};
