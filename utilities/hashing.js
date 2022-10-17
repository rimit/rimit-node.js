const crypto = require('crypto');

exports.hashData = async (data, salt) => {
    try {
        const iterations = 2048;
        const hash = crypto
            .pbkdf2Sync(data, salt, iterations, 32, 'sha512')
            .toString('hex');
        return hash;
    } catch (error) {
        return false;
    }
};

exports.hashVerify = async (data, hash, salt) => {
    try {
        const iterations = 2048;
        const newHash = crypto
            .pbkdf2Sync(data, salt, iterations, 32, 'sha512')
            .toString('hex');
        return newHash === hash;
    } catch (error) {
        return false;
    }
};
