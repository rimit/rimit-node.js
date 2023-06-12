// global packages
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');
dayjs.extend(utc);
dayjs.extend(timezone);

// UTILITIES
const config = require('../utilities/config');
const { confirmRequest } = require('../utilities/request');

//
// FETCH TRANSACTION STATUS
const txnStatus = async (req, res, next) => {
    /*  */
    /* REQUEST PAYLOAD, FOR USING IN POSTMAN */
    /*
     {
        "txn_type": "",
        "txn_nature": "",
        "txn_number": "",
        "txn_urn": "",
        "txn_reference": "",
        "txn_amount": ""
     }
    */
    /*  */

    console.log('------------------');
    console.log('REQUEST : txnStatus');
    console.log('------------------');

    console.log(req.body);
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
        const TRANSACTION_TYPE = REQUEST_DATA.txn_type;
        const TRANSACTION_NATURE = REQUEST_DATA.txn_nature;
        const TRANSACTION_NUMBER = REQUEST_DATA.txn_number;
        const TRANSACTION_URN = REQUEST_DATA.txn_urn;
        const TRANSACTION_AMOUNT = REQUEST_DATA.txn_amount;
        const TRANSACTION_REF = REQUEST_DATA.txn_reference;
        /*  */

        // TXN_STATUS REQUEST URL
        const TXN_STATUS_URL =
            process.env.BASE_URL + '/transaction/statusCheck';

        const TXN_STATUS_HEAD = {
            api: 'statusCheck',
            apiVersion: 'V1',
            timeStamp: dayjs()
                .tz('Asia/Calcutta')
                .format('YYYY-MM-DD hh:mm:ss A'),
            auth: {
                API_ID: AUTH_API_ID,
                API_KEY: AUTH_API_KEY,
            },
        };

        const TXN_STATUS_DATA = {
            txn_number: TRANSACTION_NUMBER,
            txn_urn: TRANSACTION_URN,
            txn_reference: TRANSACTION_REF,
            txn_amount: TRANSACTION_AMOUNT,
            txn_type: TRANSACTION_TYPE,
            txn_nature: TRANSACTION_NATURE,
        };

        // TXN_STATUS_RESULT MUST BE EMPTY
        const TXN_STATUS_RESULT = {};

        const TXN_STATUS = await confirmRequest(
            TXN_STATUS_HEAD,
            TXN_STATUS_RESULT,
            TXN_STATUS_DATA,
            TXN_STATUS_URL,
            ENCRYPTION_KEY
        );

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
        return res.status(200).send(TXN_STATUS);
    } catch (error) {
        console.log(error);
    }
};

module.exports = {
    txnStatus,
};
