const handleError = (e, Code, errorMessage) => {
    e.stateCode = 500;
    if (e.message === errorMessage) {
        e.message = errorMessage;
        e.stateCode = Code;
    }
};

module.exports = {
    handleError,
};
