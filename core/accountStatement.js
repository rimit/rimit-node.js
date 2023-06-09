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
const { decryptRimitData } = require('../utilities/crypto');

//
// CHECK ACCOUNT BALANCE
const accountStatement = async (req, res, next) => {
    console.log('------------------');
    console.log('REQUEST : accountStatement');
    console.log('------------------');

    console.log(req.body);
    console.log('------------------');

    const head = {
        api: 'accountStatement',
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

        let result;
        let data = {};
        let TRANSACTION_DATA = [];

        /*  */
        /* ASSIGN ENCRYPTION_KEY OF ENTITY */
        const ENCRYPTION_KEY = '';
        /*  */

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

        const USER_MOBILE = DECRYPTED_DATA.content.data.mobile;
        const USER_CC = DECRYPTED_DATA.content.data.country_code;
        const ACC_NO = DECRYPTED_DATA.content.data.account_number;
        const ACC_BRANCH = DECRYPTED_DATA.content.data.branch_code;

        const START_DATE = DECRYPTED_DATA.content.data.start_date;
        const END_DATE = DECRYPTED_DATA.content.data.end_date;

        /*  */
        /*  */
        /* VERIFY THE USER */
        /* MANAGE SCOPE FOR ERRORS (Refer - https://doc.rimit.co/account/account-statement#response-code) */
        /*  */
        /*  */

        /*  */
        /* EG FOR FAILED RESPONSE : FIND USER ACCOUNT, IF NOT FOUND, SEND RESPONSE AS FAILED */
        const FIND_ACCOUNT = true;
        if (!FIND_ACCOUNT) {
            result = {
                code: commonCodes.RESULT_CODE_INVALID_ACCOUNT,
                status: commonCodes.STATUS_FAILED,
                message: commonCodes.RESULT_MESSAGE_E2021,
            };
            data = {};
            head.HTTP_CODE = commonCodes.HTTP_CODE_SUCCESS;
            return response.success(res, head, result, data, ENCRYPTION_KEY);
        }
        /*  */

        /*  */
        /* FIND THE ACCOUNT BALANCE AND ASSIGN. KEEP 0 IF NO BALANCE FOUND*/
        let ACC_BALANCE = '0';
        /*  */

        /*  */
        /* FIND ALL TRANSACTIONS BETWEEN START_DATE & END_DATE IN THE RESPECTIVE ACCOUNT */
        const ACCOUNT_TRANSACTION = [
            {
                txn_id: '',
                date: '',
                time: '',
                debit_amount: '',
                credit_amount: '',
                balance: '',
                description: '',
            },
            {
                txn_id: '',
                date: '',
                time: '',
                debit_amount: '',
                credit_amount: '',
                balance: '',
                description: '',
            },
        ];
        /*  */

        /*  */
        /* ASSIGN DATA RECEIVED FROM ACCOUNT_TRANSACTION ARRAY */
        if (ACCOUNT_TRANSACTION.length > 0) {
            for (const i in ACCOUNT_TRANSACTION) {
                const details = {
                    txn_id: ACCOUNT_TRANSACTION[i].txn_id,
                    date: ACCOUNT_TRANSACTION[i].date,
                    time: ACCOUNT_TRANSACTION[i].time,
                    debit_amount: ACCOUNT_TRANSACTION[i].debit_amount,
                    credit_amount: ACCOUNT_TRANSACTION[i].credit_amount,
                    balance: ACCOUNT_TRANSACTION[i].balance,
                    description: ACCOUNT_TRANSACTION[i].description,
                };
                TRANSACTION_DATA.push(details);
            }
        }
        /*  */

        const USER_ACCOUNT_DATA = {
            account_number: ACC_NO,
            branch_code: ACC_BRANCH,
            balance_amount: ACC_BALANCE,
            start_date: START_DATE,
            end_date: END_DATE,
            transactions_count: ACCOUNT_TRANSACTION.length.toString(),
        };

        result = {
            code: commonCodes.RESULT_CODE_SUCCESS,
            status: commonCodes.STATUS_SUCCESS,
            message: commonCodes.RESULT_MESSAGE_E1001,
        };
        data = {
            account: USER_ACCOUNT_DATA,
            transactions: TRANSACTION_DATA,
        };

        head.HTTP_CODE = commonCodes.HTTP_CODE_SUCCESS;
        return response.success(res, head, result, data, ENCRYPTION_KEY);
    } catch (error) {
        console.log(error);
        result = {
            code: commonCodes.RESULT_CODE_SERVICE_NOT_AVAILABLE,
            status: commonCodes.STATUS_ERROR,
            message: commonCodes.RESULT_MESSAGE_E2003,
        };

        head.HTTP_CODE = commonCodes.HTTP_CODE_SERVICE_UNAVAILABLE;
        return response.error(res, result, head, data);
    }
};

module.exports = {
    accountStatement,
};
