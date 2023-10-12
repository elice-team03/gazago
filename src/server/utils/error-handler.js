const createError = require('http-errors');

function errorHandler(err, req, res, next) {
    const errStatus = err.status || 500;

    if (errStatus === 404) {
        res.status(404).json({ code: 404, message: 'Not Found' });
    } else {
        res.status(errStatus).json({ code: errStatus, message: err.message });
    }
}

module.exports = errorHandler;
