const { customAlphabet } = require('nanoid');

function generateRandomPassword() {
    const nanoid = customAlphabet('0123456789ABCDEF#$%^&*', 15);
    let randomPassword = nanoid();

    return randomPassword;
}

function generateRandomNumber() {
    const nanoid = customAlphabet('0123456789', 6);
    let randomNumber = nanoid();

    return randomNumber;
}

module.exports = { generateRandomPassword, generateRandomNumber };
