// global packages
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
dayjs.extend(utc);

// UTILITIES
const config = require('../utilities/config');
const commonCodes = require('../utilities/commonCodes');
const response = require('../utilities/response');
const { decryptRimitData } = require('../utilities/crypto');

// FETCH ACCOUNT
const accountFetch = async (req, res, next) => {
    console.log('------------------');
    console.log('REQUEST : accountFetch');
    console.log('------------------');

    const head = {
        api: 'accountFetch',
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

        let result;
        let data = {};
        let USER_ACCOUNTS = [];

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
        const DOB = DECRYPTED_DATA.content.data.dob;

        /*  */
        /*  */
        /* VERIFY THE USER */
        /* MANAGE SCOPE FOR ERRORS (Refer - https://doc.rimit.co/account/account-fetch#response-code) */
        /*  */
        /*  */

        /*  */
        /* EG FOR FAILED RESPONSE : FIND USER, IF NOT FOUND, SEND RESPONSE AS FAILED */
        const FIND_USER = true;
        if (!FIND_USER) {
            result = {
                code: commonCodes.RESULT_CODE_MOBILE_NUMBER_NOT_FOUND,
                status: commonCodes.STATUS_FAILED,
                message: commonCodes.RESULT_MESSAGE_E2014,
            };
            data = {};
            head.HTTP_CODE = commonCodes.HTTP_CODE_SUCCESS;
            return response.success(res, head, result, data, ENCRYPTION_KEY);
        }
        /*  */

        /*  */
        /* READ ALL ACCOUNTS OF THE USER IN ACCOUNTS DATA */
        const ACCOUNTS_DATA = [
            {
                account_name: 'ATHISH BALU',
                account_number: '11223333',
                branch_code: 'BR001',
                branch_name: 'KANNUR',
                account_type: 'SAVING_ACCOUNT',
                account_class: 'SAVING',
                txn_amount_limit: '5000',
                account_status: 'ACTIVE',
                account_opening_date: '2020-09-01',

                is_debit_allowed: true,
                is_credit_allowed: true,
                is_cash_debit_allowed: true,
                is_cash_credit_allowed: true,
            },
            {
                account_name: 'ATHISH BALU K',
                account_number: '613274841345',
                branch_code: 'BR002',
                branch_name: 'ERNAKULAM',
                account_type: 'GOLD_LOAN',
                account_class: 'GOLD',
                txn_amount_limit: '200000',

                account_status: 'ACTIVE',
                account_opening_date: '2020-12-10',

                is_debit_allowed: true,
                is_credit_allowed: true,
                is_cash_debit_allowed: false,
                is_cash_credit_allowed: false,
            },
        ];
        /*  */

        /*  */
        /* ASSIGN DATA RECEIVED FROM ACCOUNTS_DATA ARRAY */
        if (ACCOUNTS_DATA.length > 0) {
            for (const i in ACCOUNTS_DATA) {
                const details = {
                    account_name: ACCOUNTS_DATA[i].account_name,
                    account_number: ACCOUNTS_DATA[i].account_number,
                    branch_code: ACCOUNTS_DATA[i].branch_code,
                    branch_name: ACCOUNTS_DATA[i].branch_name,
                    account_type: ACCOUNTS_DATA[i].account_type,
                    account_class: ACCOUNTS_DATA[i].account_class,
                    txn_amount_limit: ACCOUNTS_DATA[i].txn_amount_limit,
                    account_status: ACCOUNTS_DATA[i].account_status,
                    account_opening_date: ACCOUNTS_DATA[i].account_opening_date,

                    is_debit_allowed: ACCOUNTS_DATA[i].is_debit_allowed,
                    is_credit_allowed: ACCOUNTS_DATA[i].is_credit_allowed,
                    is_cash_debit_allowed:
                        ACCOUNTS_DATA[i].is_cash_debit_allowed,
                    is_cash_credit_allowed:
                        ACCOUNTS_DATA[i].is_cash_credit_allowed,
                };

                USER_ACCOUNTS.push(details);
            }
        }
        /*  */

        result = {
            code: commonCodes.RESULT_CODE_SUCCESS,
            status: commonCodes.STATUS_SUCCESS,
            message: commonCodes.RESULT_MESSAGE_E1001,
        };
        data = {
            accounts: USER_ACCOUNTS,
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
    accountFetch,
};
