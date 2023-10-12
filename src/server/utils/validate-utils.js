const mongoose = require('mongoose');

const validateObjectId = (id, code, msg) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw Object.assign(new Error(msg), { status: code });
    }
};

const validateField = (field, code, msg) => {
    if (!field) {
        throw Object.assign(new Error(msg), { status: code });
    }
};

module.exports = { validateObjectId, validateField };
