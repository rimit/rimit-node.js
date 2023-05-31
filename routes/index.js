var express = require('express');
var router = express.Router();

// UTILITIES
const config = require('../utilities/config');

const { accountFetch } = require('../core/accountFetch');
const { accountStatement } = require('../core/accountStatement');
const { debitAmount } = require('../core/transactionDebit');
const { creditAmount } = require('../core/transactionCredit');
const { txnStatus } = require('../core/transactionStatus');

if (config.MULTY_TENANT_MODE === 'PARAMS') {
    router.post('/account/fetch/:tenant_id', accountFetch);
    router.post('/account/statement/:tenant_id', accountStatement);

    router.post('/transaction/debit-amount/:tenant_id', debitAmount);
    router.post('/transaction/credit-amount/:tenant_id', creditAmount);
} else {
    router.post('/account/fetch', accountFetch);
    router.post('/account/statement', accountStatement);

    router.post('/transaction/debit-amount', debitAmount);
    router.post('/transaction/credit-amount', creditAmount);
}

router.post('/transaction/status', txnStatus);

module.exports = router;
