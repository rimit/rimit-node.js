const axios = require('axios');
const commonCodes = require('./commonCodes');
const { encryptRimitData, decryptRimitData } = require('../utilities/crypto');

module.exports.confirmRequest = async (head, result, data, uri, key) => {
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

    const httpCode = response.head.HTTP_CODE;
    if (
        httpCode === commonCodes.HTTP_CODE_BAD_REQUEST ||
        httpCode === commonCodes.HTTP_CODE_UNAUTHORIZED ||
        httpCode === commonCodes.HTTP_CODE_SERVICE_UNAVAILABLE
    ) {
        console.log('---------------------');
        console.log('DECRYPTED FAILED');
        console.log(response);
        console.log('---------------------');
        return response;
    }

    console.log('---------------------');
    console.log('DATA TO BE DECRYPTED');
    console.log(response);
    console.log('---------------------');

    let decrypted = await decryptRimitData(response.encrypted_data, key);

    const responseData = { head: response.head, content: decrypted.content };
    return responseData;
};
