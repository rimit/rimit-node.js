module.exports = {
    HTTP_CODE_SUCCESS: 200,
    HTTP_CODE_BAD_REQUEST: 400,
    HTTP_CODE_UNAUTHORIZED: 401,
    HTTP_CODE_NOT_ACCEPTABLE: 406,
    HTTP_CODE_CONFLICT: 409,
    HTTP_CODE_SERVICE_UNAVAILABLE: 503,

    STATUS_SUCCESS: 'SUCCESS',
    STATUS_FAILED: 'FAILED',
    STATUS_HOLD: 'HOLD',
    STATUS_REFUND: 'REFUND',
    STATUS_CANCEL: 'CANCEL',
    STATUS_PROCESSING: 'PROCESSING',
    STATUS_PENDING: 'PENDING',
    STATUS_UNDEFINED: 'UNDEFINED',
    STATUS_ERROR: 'ERROR',

    RESULT_CODE_SUCCESS: 1001,
    RESULT_CODE_HOLD: 1002,
    RESULT_CODE_FAILED: 9999,
    RESULT_CODE_TECHNICAL_ERROR: 2001,
    RESULT_CODE_ERROR_WITH_SERVICE_PROVIDER: 2002,
    RESULT_CODE_SERVICE_NOT_AVAILABLE: 2003,
    RESULT_CODE_AUTHENTICATION_FAILED: 2004,
    RESULT_CODE_SERVER_DOWN: 2005,
    RESULT_CODE_CANNOT_PROCESS_THIS_REQUEST: 2006,
    RESULT_CODE_ENCRYPTION_FAILED: 2007,
    RESULT_CODE_DECRYPTION_FAILED: 2008,
    RESULT_CODE_HASH_VALIDATION_FAILED: 2009,
    RESULT_CODE_NO_ACTIVE_ACCOUNT_FOUND: 2011,
    RESULT_CODE_ACCOUNT_NOT_FOUND_FOR_USER: 2012,
    RESULT_CODE_DOB_MISMATCH: 2013,
    RESULT_CODE_MOBILE_NUMBER_NOT_FOUND: 2014,
    RESULT_CODE_INVALID_ACCOUNT: 2021,
    RESULT_CODE_ACCOUNT_NUMBER_AND_MOBILE_NUMBER_DO_NOT_MATCH: 2022,
    RESULT_CODE_INSUFFICIENT_ACCOUNT_BALANCE: 8899,
    RESULT_CODE_ACCOUNT_NOT_FOUND: 8898,
    RESULT_CODE_ACCOUNT_IS_INACTIVE_BLOCKED_CLOSED: 8897,
    RESULT_CODE_DEBIT_IS_NOT_ALLOWED: 8896,
    RESULT_CODE_CREDIT_IS_NOT_ALLOWED: 8895,
    RESULT_CODE_USER_DECLINED: 8894,
    RESULT_CODE_TIME_EXPIRED: 8893,
    RESULT_CODE_ATTEMPTS_TO_RETRY_EXCEEDED_MAXIMUM: 8892,
    RESULT_CODE_SETTLEMENT_ACCOUNT_NOT_FOUND: 8891,
    RESULT_CODE_ENTITY_IS_INACTIVE: 9988,
    RESULT_CODE_INSUFFICIENT_VIRTUAL_ACCOUNT_BALANCE: 9989,
    RESULT_CODE_TRANSACTION_DETAILS_DO_NOT_MATCH: 2091,
    RESULT_CODE_TRANSACTION_REFERENCE_IS_NOT_UNIQUE: 2092,
    RESULT_CODE_TRANSACTION_REFERENCE_MUST_BE_SAME: 2093,

    RESULT_MESSAGE_E1001: 'The request is successfully processed',
    RESULT_MESSAGE_E1002: 'The status updated as hold',
    RESULT_MESSAGE_E9999: 'Processed request failed',
    RESULT_MESSAGE_E2001: 'Failed due to technical error',
    RESULT_MESSAGE_E2002: 'Error with Service Provider',
    RESULT_MESSAGE_E2003: 'Service not available',
    RESULT_MESSAGE_E2004: 'Authentication Failed',
    RESULT_MESSAGE_E2005: 'Server Down',
    RESULT_MESSAGE_E2006: 'Cannot process this request',
    RESULT_MESSAGE_E2007: 'Encryption failed',
    RESULT_MESSAGE_E2008: 'Decryption failed',
    RESULT_MESSAGE_E2009: 'Hash validation failed',
    RESULT_MESSAGE_E2011: 'No active account found',
    RESULT_MESSAGE_E2012: 'Account not found for user',
    RESULT_MESSAGE_E2013: 'DOB mismatch',
    RESULT_MESSAGE_E2014: 'Mobile number not found',
    RESULT_MESSAGE_E2021: 'Invalid account',
    RESULT_MESSAGE_E2022: 'Account number and mobile number do not match',
    RESULT_MESSAGE_E2091: 'Transaction details do not match',
    RESULT_MESSAGE_E2092: 'Transaction reference is not unique',
    RESULT_MESSAGE_E2093:
        'The transaction reference must be the same as the HOLD',
    RESULT_MESSAGE_E8899: 'Insufficient account balance',
    RESULT_MESSAGE_E8898: 'Account not found',
    RESULT_MESSAGE_E8897: 'Account is inactive / blocked / closed',
    RESULT_MESSAGE_E8896: 'Debit is not allowed',
    RESULT_MESSAGE_E8895: 'Credit is not allowed',
    RESULT_MESSAGE_E8894: 'User declined',
    RESULT_MESSAGE_E8893: 'Time expired',
    RESULT_MESSAGE_E8892: 'Attempts to retry exceeded maximum',
    RESULT_MESSAGE_E8891: 'Settlement account not found',
    RESULT_MESSAGE_E9988: 'Entity is inactive',
    RESULT_MESSAGE_E9989: 'Insufficient virtual account balance',
};
