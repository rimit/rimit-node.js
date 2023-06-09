const crypto = require('crypto');
const { hashData, hashVerify } = require('./hashing');

module.exports.encryptRimitData = async (data, key) => {
    try {
        const iv = crypto.randomBytes(8).toString('hex');

        console.log('---------------------');
        console.log('*** ENCRYPT - KEY *** ', key);
        console.log('*** ENCRYPT - IV *** ', iv);
        console.log('*** ENCRYPT - DATA *** ', data);
        console.log('---------------------');

        const algorithm = 'aes-256-cbc';
        const cipher = crypto.createCipheriv(algorithm, key, iv);

        let encrypted = cipher.update(data, 'utf8', 'base64');
        encrypted += cipher.final('base64');

        // CREATE SALT FROM cipher_text
        const salt = iv + iv;
        const hash = await hashData(data, salt);

        const encriptedData = { cipher_text: encrypted, iv: iv, hash: hash };

        console.log('*** ENCRYPTED DATA ***');
        console.log(encriptedData);
        console.log('---------------------');

        return encriptedData;
    } catch (err) {
        console.log(err);
        return false;
    }
};
module.exports.decryptRimitData = async (data, key) => {
    try {
        const iv = data.iv;
        const encrypted = data.cipher_text;

        console.log('---------------------');
        console.log('*** DECRYPT - KEY *** ', key);
        console.log('*** DECRYPT - IV *** ', iv);
        console.log('*** DECRYPT - DATA *** ', encrypted);
        console.log('---------------------');

        const algorithm = 'aes-256-cbc';
        const decipher = crypto.createDecipheriv(algorithm, key, iv);

        let decrypted = decipher.update(encrypted, 'base64', 'utf8');
        decrypted += decipher.final('utf8');
        const decriptedString = decrypted;
        const decriptedData = JSON.parse(decriptedString);

        console.log('*** DECRYPTED DATA ***');
        console.log(decriptedString);
        console.log(decriptedData);
        console.log('---------------------');

        // CHECK THE cipher_text IS CORRECT
        const salt = iv + iv;
        const validateHash = await hashVerify(decriptedString, data.hash, salt);
        if (!validateHash) {
            console.log('Valid Hash');
            console.log(validateHash);
            return false;
        }

        return decriptedData;
    } catch (err) {
        console.log(err);
        return false;
    }
};
