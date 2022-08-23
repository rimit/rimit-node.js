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
const debitAmount = async (req, res, next) => {
    console.log('------------------');
    console.log('REQUEST : debitAmount');
    console.log('------------------');

    const head = {
        api: 'debitAmount',
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

        // DEBIT_CONFIRM REQUEST URL
        const DEBIT_CONFIRM_URL = config.BASE_URL + '/transaction/confirmDebit';

        const DEBIT_CONFIRM_HEAD = {
            api: 'confirmDebit',
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

        const USER = DECRYPTED_DATA.content.data.remitter;
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
        if (TRANSACTION_TYPE === 'REFUND_DEBIT') {
            REFUND_ID = REFUND_REFERENCE.txn_id;
            REFUND_AMOUNT = REFUND_REFERENCE.amount;
            REFUND_DATE = REFUND_REFERENCE.date;
            REFUND_TIME = REFUND_REFERENCE.time;
        }

        /*  */
        /*  */
        /* VERIFY THE USER */
        /* MANAGE SCOPE FOR FAILED TRANSACTIONS (Refer - https://doc.rimit.co/transaction-debit/confirm-debit#result-code) */
        /* VERIFY THE USER ACCOUNT */
        /* VERIFY THE USER ACCOUNT BALANCE AVAILABILITY */
        /* DEBIT USER ACCOUNT WITH txn_amount */
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

        const DEBIT_CONFIRM_DATA = {
            txn_id: TRANSACTION_ID,
            txn_reference: TRANSACTION_REF,
            txn_amount: TRANSACTION_AMOUNT,
            txn_type: TRANSACTION_TYPE,
            account_balance: ACCOUNT_BALANCE,
        };

        /*  */
        /* EG FOR FAILED REQUEST : FIND LATEST ACCOUNT BALANCE, IF FOUND INSUFFICIENT, SEND REQUEST AS FAILED */
        const CHECK_LATEST_BALANCE = true;
        if (!CHECK_LATEST_BALANCE) {
            const DEBIT_CONFIRM_RESULT = {
                code: commonCodes.RESULT_CODE_INSUFFICIENT_ACCOUNT_BALANCE,
                status: commonCodes.STATUS_FAILED,
                message: commonCodes.RESULT_MESSAGE_E8899,
            };

            const DEBIT_CONFIRM = await confirmTransaction(
                DEBIT_CONFIRM_HEAD,
                DEBIT_CONFIRM_RESULT,
                DEBIT_CONFIRM_DATA,
                DEBIT_CONFIRM_URL,
                ENCRYPTION_KEY
            );

            if (!DEBIT_CONFIRM) {
                console.log(
                    'DEBIT_CONFIRM - CHECK_LATEST_BALANCE - REQUEST STATUS'
                );
                console.log(DEBIT_CONFIRM);
            }

            console.log('DEBIT_CONFIRM - CHECK_LATEST_BALANCE - RESPONSE');
            console.log(DEBIT_CONFIRM);
            return;
        }
        /*  */

        // IF THE DEBIT AMOUNT IS SUCCESSFUL
        const DEBIT_CONFIRM_RESULT = {
            code: commonCodes.RESULT_CODE_SUCCESS,
            status: commonCodes.STATUS_SUCCESS,
            message: commonCodes.RESULT_MESSAGE_E1001,
        };

        const DEBIT_CONFIRM = await confirmTransaction(
            DEBIT_CONFIRM_HEAD,
            DEBIT_CONFIRM_RESULT,
            DEBIT_CONFIRM_DATA,
            DEBIT_CONFIRM_URL,
            ENCRYPTION_KEY
        );

        if (!DEBIT_CONFIRM) {
            console.log('DEBIT_CONFIRM - REQUEST STATUS');
            console.log(DEBIT_CONFIRM);
            return;
        }

        console.log('*****************');
        console.log('DEBIT_CONFIRM - RESPONSE');
        console.log(DEBIT_CONFIRM);
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
    debitAmount,
};
