const { customAlphabet } = require('nanoid');

module.exports = () => {
    const nanoid = customAlphabet('0123456789ABCDEF#$%^&*', 15);
    let randomPassword = nanoid();

    return randomPassword;
};
