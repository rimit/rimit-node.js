const crypto = require('crypto');

const hashData = async (data, salt) => {
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

const hashVerify = async (data, hash, salt) => {
    try {
        const newHash = await hashData(data, salt);
        return newHash === hash;
    } catch (error) {
        return false;
    }
};

module.exports = { hashData, hashVerify };
