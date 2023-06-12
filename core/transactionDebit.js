// global packages
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');
dayjs.extend(utc);
dayjs.extend(timezone);

// UTILITIES
const config = require('../utilities/config');
const commonCodes = require('../utilities/commonCodes');
const response = require('../utilities/response');
const { confirmRequest } = require('../utilities/request');
const { decryptRimitData } = require('../utilities/crypto');

//
// DEBIT AMOUNT - FUND TRANSFER
const debitAmount = async (req, res, next) => {
    console.log('------------------');
    console.log('REQUEST : debitAmount');
    console.log('------------------');

    console.log(req.body);
    console.log('------------------');

    const head = {
        api: 'debitAmount',
        apiVersion: 'V1',
        timeStamp: dayjs().tz('Asia/Calcutta').format('YYYY-MM-DD hh:mm:ss A'),
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
            timeStamp: dayjs()
                .tz('Asia/Calcutta')
                .format('YYYY-MM-DD hh:mm:ss A'),
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
            const data = {};

            head.HTTP_CODE = commonCodes.HTTP_CODE_BAD_REQUEST;
            return response.error(res, result, head, data);
        }

        const USER = DECRYPTED_DATA.content.data.user;
        const TRANSACTION = DECRYPTED_DATA.content.data.transaction;
        const SETTLEMENT = DECRYPTED_DATA.content.data.settlement;

        const USER_MOBILE = USER.mobile;
        const USER_COUNTRY_CODE = USER.country_code;
        const USER_ACCOUNT_NUMBER = USER.account_number;
        const USER_ACCOUNT_CLASS = USER.account_class;
        const USER_ACCOUNT_TYPE = USER.account_type;
        const USER_BRANCH_CODE = USER.branch_code;

        const TRANSACTION_NO = TRANSACTION.txn_number;
        const TRANSACTION_URN = TRANSACTION.txn_urn;
        const TRANSACTION_TYPE = TRANSACTION.txn_type;
        const TRANSACTION_NATURE = TRANSACTION.txn_nature;
        const TRANSACTION_NOTE = TRANSACTION.txn_note;
        const TRANSACTION_DATE = TRANSACTION.txn_date;
        const TRANSACTION_TIME = TRANSACTION.txn_time;
        const TRANSACTION_TIMESTAMP = TRANSACTION.txn_ts;
        const TRANSACTION_AMOUNT = TRANSACTION.txn_amount;
        const TRANSACTION_SERVICE_CHARGE = TRANSACTION.txn_service_charge;
        const TRANSACTION_SERVICE_PROVIDER_CHARGE = TRANSACTION.txn_sp_charge;
        const TRANSACTION_FEE = TRANSACTION.txn_fee;

        const SETTLEMENT_ACCOUNT_TYPE = SETTLEMENT.account_type;
        const SETTLEMENT_ACCOUNT_NUMBER = SETTLEMENT.account_number;

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
            txn_urn: TRANSACTION_URN,
            txn_number: TRANSACTION_NO,
            txn_reference: TRANSACTION_REF,
            txn_amount: TRANSACTION_AMOUNT,
            txn_type: TRANSACTION_TYPE,
            txn_nature: TRANSACTION_NATURE,
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

            const DEBIT_CONFIRM = await confirmRequest(
                DEBIT_CONFIRM_HEAD,
                DEBIT_CONFIRM_RESULT,
                DEBIT_CONFIRM_DATA,
                DEBIT_CONFIRM_URL,
                ENCRYPTION_KEY
            );

            console.log('DEBIT_CONFIRM - CHECK_ACCOUNT_BALANCE - RESPONSE');
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

        const DEBIT_CONFIRM = await confirmRequest(
            DEBIT_CONFIRM_HEAD,
            DEBIT_CONFIRM_RESULT,
            DEBIT_CONFIRM_DATA,
            DEBIT_CONFIRM_URL,
            ENCRYPTION_KEY
        );

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
