const { customAlphabet } = require('nanoid');
const nanoid = customAlphabet('1234567890abcdef', 10);

const shortId = {
    type: String,
    default() {
        return nanoid();
    },
    require: true,
    index: true,
};

module.exports = shortId;

//schema 선언하실 때에 shortId만 적어주시면 됩니다.
//shortId 갱신 안되는 점 수정하겠습니다
