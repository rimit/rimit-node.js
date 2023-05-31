# Rimit-Node.js

Software Development Kit for Node.js

## File structure

The developer kit contains the following directories.

#### `/utilities`

-   **commonCodes**\
    Common code file helps to maintain and manage ERROR/ FAILED/ SUCCESS codes in the workflow.
-   **config**\
    The config file helps to manage all workflow related to configurations.
-   **crypto**\
    To manage encryption and decryption of data.
-   **hashing**\
    To generate and verify the hash value to ensure data integrity.
-   **response**\
    To manage the response to webhook requests for `accountFetch` and `accountStatement`.
-   **request**\
    To manage REST requests for `confirmDebit` and `confirmCredit`.

#### `/core`

-   **accountFetch**\
    Used to find a user's account details.
-   **accountStatement**\
    Used to find a user's account balance and account transactions.
-   **transactionDebit**\
    Used to manage debit transactions.
-   **transactionCredit**\
    Used to manage credit transactions.
-   **statusCheck**\
    Used to find the latest status of the transaction.