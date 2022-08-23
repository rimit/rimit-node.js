const axios = require('axios');
const commonCodes = require('./commonCodes');
const { encryptRimitData, decryptRimitData } = require('../utilities/crypto');

module.exports.confirmTransaction = async (head, result, data, uri, key) => {
    let encryptData = { content: { result: result, data: data } };

    console.log('---------------------');
    console.log('DATA TO BE ENCRYPTED');
    console.log(encryptData);
    console.log('---------------------');

    let stringData = JSON.stringify(encryptData);
    let ecrypted = await encryptRimitData(stringData, key);
    let details = {
        head: head,
        encrypted_data: ecrypted,
    };

    const response = await axios
        .post(uri, details)
        .then((res) => {
            return res.data;
        })
        .catch((error) => {
            console.log(error);
            return false;
        });

    if (response.head.HTTP_CODE === commonCodes.HTTP_CODE_BAD_REQUEST) {
        return response.content;
    }

    console.log('---------------------');
    console.log('DATA TO BE DECRYPTED');
    console.log(response);
    console.log('---------------------');

    let decrypted = await decryptRimitData(response.encrypted_data, key);

    return decrypted.content;
};
