const crypto = require('crypto');
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

        const encriptedData = { cipher_text: encrypted, iv: iv };

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
        const decriptedData = JSON.parse(decrypted);

        console.log('*** DECRYPTED DATA ***');
        console.log(decriptedData);
        console.log('---------------------');

        return decriptedData;
    } catch (err) {
        console.log(err);
        return false;
    }
};
