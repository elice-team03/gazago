const { customAlphabet } = require('nanoid');

const shortId = {
    type: String,
    default: () => {
        const nanoid = customAlphabet('0123456789ABCDEF', 8);
        return nanoid();
    },
    required: true,
    index: true,
};

module.exports = shortId;
