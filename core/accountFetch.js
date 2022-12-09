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
const { confirmRequest } = require('../utilities/request');

//
// FETCH ACCOUNT
const accountFetch = async (req, res, next) => {
    console.log('------------------');
    console.log('REQUEST : accountFetch');
    console.log('------------------');

    const head = {
        api: 'accountFetch',
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

        const USER_DATA = {
            mobile: USER_MOBILE,
            country_code: USER_CC,
        };
        // IF SUCCESSFUL, CALL addAccount
        addAccount(USER_DATA);

        // SUCCESS RESPONSE
        result = {
            code: commonCodes.RESULT_CODE_SUCCESS,
            status: commonCodes.STATUS_SUCCESS,
            message: commonCodes.RESULT_MESSAGE_E1001,
        };
        data = {};

        head.HTTP_CODE = commonCodes.HTTP_CODE_SUCCESS;
        console.log('LOG END LINE');
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

//
// ADD ACCOUNT
const addAccount = async (userData) => {
    console.log('------------------');
    console.log('REQUEST : AddAccount');
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

        // ADD_ACCOUNT REQUEST URL
        const ADD_ACCOUNT_URL = config.BASE_URL + '/account/add';

        const ADD_ACCOUNT_HEAD = {
            api: 'accountAdd',
            apiVersion: 'V1',
            timeStamp: dayjs()
                .tz('Asia/Calcutta')
                .format('YYYY-MM-DD hh:mm:ss A'),
            auth: {
                API_ID: AUTH_API_ID,
                API_KEY: AUTH_API_KEY,
            },
        };

        /*  */
        /* ASSIGN USER DATA BASED ON REQUEST DATA ON accountFetch */
        const USER_DATA = {
            mobile: userData.mobile,
            country_code: userData.country_code,
        };
        /*  */

        /*  */
        /* READ ALL ACCOUNTS OF THE USER IN ACCOUNTS DATA */
        const ACCOUNTS_DATA = [
            {
                account_name: '',
                account_number: '',
                branch_code: '',
                branch_name: '',

                account_type: '',
                account_class: '',
                account_status: '',
                account_opening_date: '',
                account_currency: '',
                account_daily_limit: '',

                is_debit_allowed: true,
                is_credit_allowed: true,
                is_cash_debit_allowed: true,
                is_cash_credit_allowed: true,

                salt: '',
            },
        ];
        /*  */

        /*  */
        /* ASSIGN DATA RECEIVED FROM ACCOUNTS_DATA ARRAY */
        let USER_ACCOUNTS = [];
        if (ACCOUNTS_DATA.length > 0) {
            for (const i in ACCOUNTS_DATA) {
                const details = {
                    account_name: ACCOUNTS_DATA[i].account_name,
                    account_number: ACCOUNTS_DATA[i].account_number,
                    branch_code: ACCOUNTS_DATA[i].branch_code,
                    branch_name: ACCOUNTS_DATA[i].branch_name,

                    account_type: ACCOUNTS_DATA[i].account_type,
                    account_class: ACCOUNTS_DATA[i].account_class,
                    account_status: ACCOUNTS_DATA[i].account_status,
                    account_opening_date: ACCOUNTS_DATA[i].account_opening_date,
                    account_currency: ACCOUNTS_DATA[i].account_currency,
                    account_daily_limit: ACCOUNTS_DATA[i].account_daily_limit,

                    is_debit_allowed: ACCOUNTS_DATA[i].is_debit_allowed,
                    is_credit_allowed: ACCOUNTS_DATA[i].is_credit_allowed,
                    is_cash_debit_allowed:
                        ACCOUNTS_DATA[i].is_cash_debit_allowed,
                    is_cash_credit_allowed:
                        ACCOUNTS_DATA[i].is_cash_credit_allowed,

                    auth_salt: ACCOUNTS_DATA[i].salt,
                };

                USER_ACCOUNTS.push(details);
            }
        }
        /*  */

        const ADD_ACCOUNTS_DATA = {
            user: USER_DATA,
            accounts: USER_ACCOUNTS,
        };

        // IF THE ALL ACCOUNTS READ SUCCESSFULLY
        const ADD_ACCOUNT_RESULT = {
            code: commonCodes.RESULT_CODE_SUCCESS,
            status: commonCodes.STATUS_SUCCESS,
            message: commonCodes.RESULT_MESSAGE_E1001,
        };

        const ADD_ACCOUNT_CONFIRM = await confirmRequest(
            ADD_ACCOUNT_HEAD,
            ADD_ACCOUNT_RESULT,
            ADD_ACCOUNTS_DATA,
            ADD_ACCOUNT_URL,
            ENCRYPTION_KEY
        );

        if (!ADD_ACCOUNT_CONFIRM) {
            console.log('ADD_ACCOUNT_CONFIRM - REQUEST STATUS');
            console.log(ADD_ACCOUNT_CONFIRM);
            return;
        }

        console.log('*****************');
        console.log('ADD_ACCOUNT_CONFIRM - RESPONSE');
        console.log(ADD_ACCOUNT_CONFIRM);
        console.log('*****************');

        /*  */
        /*  */

        /* MANAGE RECEIVED RESPONSE */
        /*  */

        /*  */
        /*  */
        return true;
        // res.status(200).send(ADD_ACCOUNT_CONFIRM);
    } catch (error) {
        console.log(error);
    }
};

module.exports = {
    accountFetch,
};
