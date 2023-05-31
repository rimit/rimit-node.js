const { encryptRimitData } = require('../utilities/crypto');
exports.success = async (res, head, result, data, key) => {
    let encryptData = { content: { result: result, data: data } };
    let datas = JSON.stringify(encryptData);
    let ecrypted = await encryptRimitData(datas, key);

    res.send({
        head: head,
        encrypted_data: ecrypted,
    });
};

exports.error = async (res, result, head, data) => {
    const details = { result: result, data: data };

    res.send({
        head: head,
        content: details,
    });
};
