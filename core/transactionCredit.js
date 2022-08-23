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
const creditAmount = async (req, res, next) => {
    console.log('------------------');
    console.log('REQUEST : creditAmount');
    console.log('------------------');

    const head = {
        api: 'creditAmount',
        apiVersion: 'V1',
        timeStamp: dayjs().utc().format(),
    };

    try {
        // ASSIGNING TENANT_ID IF THE PLATFORM IS MULTY TENANT
        let TENANT_ID = '';
        if (config.IS_MULTY_TENANT_PLATFORM === 'YES') {
            if (config.MULTY_TENANT_MODE === 'QUERY') {
                TENANT_ID = req.query.tenant_id;
            } else if (config.MULTY_TENANT_MODE === 'PARAMS') {
                TENANT_ID = req.params.tenant_id;
            }
        }

        /*  */
        /* ASSIGN ENCRYPTION_KEY, API_KEY & API_ID OF ENTITY */
        const ENCRYPTION_KEY = '';
        const AUTH_API_ID = '';
        const AUTH_API_KEY = '';
        /*  */

        // CREDIT_CONFIRM REQUEST URL
        const CREDIT_CONFIRM_URL =
            config.BASE_URL + '/transaction/confirmCredit';

        const CREDIT_CONFIRM_HEAD = {
            api: 'confirmCredit',
            apiVersion: 'V1',
            timeStamp: dayjs().utc().format(),
            auth: {
                API_ID: AUTH_API_ID,
                API_KEY: AUTH_API_KEY,
            },
        };

        // ASSIGNING DATA RECIVED IN THE REQUEST
        const REQUEST_DATA = req.body.encrypted_data;

        // DECRYPTING DATA RECEIVED
        const DECRYPTED_DATA = await decryptRimitData(
            REQUEST_DATA,
            ENCRYPTION_KEY
        );

        // ERROR RESPONSE IF DECRYPTION FAILED
        if (!DECRYPTED_DATA) {
            result = {
                code: commonCodes.RESULT_CODE_DECRYPTION_FAILED,
                status: commonCodes.STATUS_ERROR,
                message: commonCodes.RESULT_MESSAGE_E2008,
            };

            head.HTTP_CODE = commonCodes.HTTP_CODE_BAD_REQUEST;
            return response.error(res, result, head, data);
        }

        const USER = DECRYPTED_DATA.content.data.beneficiary;
        const TRANSACTION = DECRYPTED_DATA.content.data.transaction;
        const REFUND_REFERENCE = DECRYPTED_DATA.content.data.refund_reference;

        const USER_MOBILE = USER.mobile;
        const USER_COUNTRY_CODE = USER.country_code;
        const USER_ACCOUNT_NUMBER = USER.account_number;
        const USER_BRANCH_CODE = USER.branch_code;

        const TRANSACTION_TYPE = TRANSACTION.type;
        const TRANSACTION_ID = TRANSACTION.txn_id;
        const TRANSACTION_AMOUNT = TRANSACTION.amount;
        const TRANSACTION_DATE = TRANSACTION.date;
        const TRANSACTION_TIME = TRANSACTION.time;

        let REFUND_ID, REFUND_AMOUNT, REFUND_DATE, REFUND_TIME;
        if (TRANSACTION_TYPE === 'REFUND_CREDIT') {
            REFUND_ID = REFUND_REFERENCE.txn_id;
            REFUND_AMOUNT = REFUND_REFERENCE.amount;
            REFUND_DATE = REFUND_REFERENCE.date;
            REFUND_TIME = REFUND_REFERENCE.time;
        }

        /*  */
        /*  */
        /* VERIFY THE USER */
        /* MANAGE SCOPE FOR FAILED TRANSACTIONS (Refer - https://doc.rimit.co/transaction-credit/confirm-credit#result-code) */
        /* VERIFY THE USER ACCOUNT */
        /* VERIFY THE USER ACCOUNT BALANCE AVAILABILITY */
        /* CREDIT USER ACCOUNT WITH txn_amount */
        /*  */
        /*  */

        /*  */
        /* GENERATE A UNIQUE TRANSACTION_REF */
        const TRANSACTION_REF = '';
        /*  */

        /*  */
        /* ASSIGN LATEST ACCOUNT_BALANCE AFTER CREDITING THE TRANSACTION_AMOUNT */
        const ACCOUNT_BALANCE = '';
        /*  */

        const CREDIT_CONFIRM_DATA = {
            txn_id: TRANSACTION_ID,
            txn_reference: TRANSACTION_REF,
            txn_amount: TRANSACTION_AMOUNT,
            txn_type: TRANSACTION_TYPE,
            account_balance: ACCOUNT_BALANCE,
        };

        /*  */
        /* EG FOR FAILED REQUEST : FIND LATEST ACCOUNT BALANCE, IF FOUND INSUFFICIENT, SEND REQUEST AS FAILED */
        const CHECK_ACCOUNT_STATUS = true;
        if (!CHECK_ACCOUNT_STATUS) {
            const CREDIT_CONFIRM_RESULT = {
                code: commonCodes.RESULT_CODE_ACCOUNT_IS_INACTIVE_BLOCKED_CLOSED,
                status: commonCodes.STATUS_FAILED,
                message: commonCodes.RESULT_MESSAGE_E8897,
            };

            const CREDIT_CONFIRM = await confirmTransaction(
                CREDIT_CONFIRM_HEAD,
                CREDIT_CONFIRM_RESULT,
                CREDIT_CONFIRM_DATA,
                CREDIT_CONFIRM_URL,
                ENCRYPTION_KEY
            );

            if (!CREDIT_CONFIRM) {
                console.log(
                    'CREDIT_CONFIRM - CHECK_ACCOUNT_STATUS - REQUEST STATUS'
                );
                console.log(CREDIT_CONFIRM);
            }

            console.log('CREDIT_CONFIRM - CHECK_ACCOUNT_STATUS - RESPONSE');
            console.log(CREDIT_CONFIRM);
            return;
        }
        /*  */

        // IF THE CREDIT AMOUNT IS SUCCESSFUL
        const CREDIT_CONFIRM_RESULT = {
            code: commonCodes.RESULT_CODE_SUCCESS,
            status: commonCodes.STATUS_SUCCESS,
            message: commonCodes.RESULT_MESSAGE_E1001,
        };

        const CREDIT_CONFIRM = await confirmTransaction(
            CREDIT_CONFIRM_HEAD,
            CREDIT_CONFIRM_RESULT,
            CREDIT_CONFIRM_DATA,
            CREDIT_CONFIRM_URL,
            ENCRYPTION_KEY
        );

        if (!CREDIT_CONFIRM) {
            console.log('CREDIT_CONFIRM - REQUEST STATUS');
            console.log(CREDIT_CONFIRM);
            return;
        }

        console.log('*****************');
        console.log('CREDIT_CONFIRM - RESPONSE');
        console.log(CREDIT_CONFIRM);
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
    creditAmount,
};
