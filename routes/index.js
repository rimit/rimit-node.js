var express = require('express');
var router = express.Router();

// UTILITIES
const config = require('../utilities/config');

const { accountFetch } = require('../core/accountFetch');
const { accountStatement } = require('../core/accountStatement');
const { debitAmount } = require('../core/transactionDebit');
const { creditAmount } = require('../core/transactionCredit');
const { withdrawAmount } = require('../core/transactionCashWithdraw');
const { depositAmount } = require('../core/transactionCashDeposit');
const { txnStatus } = require('../core/transactionStatus');

const { withdrawSuccess } = require('../core/transactionCashWithdraw');
const { depositSuccess } = require('../core/transactionCashDeposit');

if (config.MULTY_TENANT_MODE === 'PARAMS') {
    router.post('/account/fetch/:tenant_id', accountFetch);
    router.post('/account/statement/:tenant_id', accountStatement);

    router.post('/transaction/debit-amount/:tenant_id', debitAmount);
    router.post('/transaction/credit-amount/:tenant_id', creditAmount);

    router.post('/transaction/withdraw-amount/:tenant_id', withdrawAmount);
    router.post('/transaction/deposit-amount/:tenant_id', depositAmount);
} else {
    router.post('/account/fetch', accountFetch);
    router.post('/account/statement', accountStatement);

    router.post('/transaction/debit-amount', debitAmount);
    router.post('/transaction/credit-amount', creditAmount);

    router.post('/transaction/withdraw-amount', withdrawAmount);
    router.post('/transaction/deposit-amount', depositAmount);
}

router.post('/transaction/depositSuccess', depositSuccess);
router.post('/transaction/withdrawSuccess', withdrawSuccess);
router.post('/transaction/status', txnStatus);

module.exports = router;
