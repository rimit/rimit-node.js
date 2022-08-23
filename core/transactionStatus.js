// global packages
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
dayjs.extend(utc);

// UTILITIES
const config = require('../utilities/config');
const commonCodes = require('../utilities/commonCodes');
const response = require('../utilities/response');
const { confirmTransaction } = require('../utilities/request');
const { decryptRimitData } = require('../utilities/crypto');

// FETCH ACCOUNT
const txnStatus = async (req, res, next) => {
    console.log('------------------');
    console.log('REQUEST : txnStatus');
    console.log('------------------');

    try {
        /*  */
        /* ASSIGN ENCRYPTION_KEY, API_KEY & API_ID OF ENTITY */
        const ENCRYPTION_KEY = '';
        const AUTH_API_ID = '';
        const AUTH_API_KEY = '';
        /*  */

        /*  */
        /* ASSIGNING DATA RECIVED IN THE REQUEST  */
        const REQUEST_DATA = req.body;
        /*  */

        /*  */
        /* ASSIGNING DATA RECIVED IN THE REQUEST  */
        const TRANSACTION_TYPE = REQUEST_DATA.type;
        const TRANSACTION_ID = REQUEST_DATA.id;
        const TRANSACTION_AMOUNT = REQUEST_DATA.amount;
        const TRANSACTION_REF = REQUEST_DATA.reference;
        /*  */

        // TXN_STATUS REQUEST URL
        const TXN_STATUS_URL = config.BASE_URL + '/transaction/status';

        const TXN_STATUS_HEAD = {
            api: 'status',
            apiVersion: 'V1',
            timeStamp: dayjs().utc().format(),
            auth: {
                API_ID: AUTH_API_ID,
                API_KEY: AUTH_API_KEY,
            },
        };

        const TXN_STATUS_DATA = {
            txn_id: TRANSACTION_ID,
            txn_reference: TRANSACTION_REF,
            txn_amount: TRANSACTION_AMOUNT,
            txn_type: TRANSACTION_TYPE,
        };

        // TXN_STATUS_RESULT MUST BE EMPTY
        const TXN_STATUS_RESULT = {};

        const TXN_STATUS = await confirmTransaction(
            TXN_STATUS_HEAD,
            TXN_STATUS_RESULT,
            TXN_STATUS_DATA,
            TXN_STATUS_URL,
            ENCRYPTION_KEY
        );

        if (!TXN_STATUS) {
            console.log('TXN_STATUS - REQUEST STATUS');
            console.log(TXN_STATUS);
            return;
        }

        console.log('*****************');
        console.log('TXN_STATUS - RESPONSE');
        console.log(TXN_STATUS);
        console.log('*****************');

        /*  */
        /*  */

        /* MANAGE RECEIVED RESPONSE */
        /*  */

        /*  */
        /*  */
        return;
    } catch (error) {
        console.log(error);
    }
};

module.exports = {
    txnStatus,
};
