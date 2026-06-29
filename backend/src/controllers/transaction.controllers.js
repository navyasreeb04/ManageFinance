const transactionModel = require("../models/transaction.model");

const ledgerModel = require("../models/ledger.model");
const accountModel = require("../models/account.model");
const emailService = require("../services/email.service");
const userModel = require("../models/user.model")
const mongoose = require("mongoose");
/**
 * -create new transaction
 * 10-STEP TRANSFER FLOW
        * 1. Validate request
        * 2. Validate idempotency key
        * 3. check account status
        * 4. Derive sender balance from ledger
        * 5. Create transaction(PENDING)
        * 6. Create DEBIT ledger entry
        * 7. Create CREDIT ledger entry
        * 8. Mark transaction COMPLETED
        * 9. Commit MongoDB session
        * 10. Send email notification
 */

// Add to transaction.controllers.js
async function getUserTransactions(req, res) {
    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    try {
        const account = await accountModel.findOne({ user: req.user._id });
        if (!account) {
            return res.status(404).json({ message: 'Account not found' });
        }

        const transactions = await transactionModel
            .find({
                $or: [{ account: account._id }, { toAccount: account._id }]
            })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const transactionsWithDetails = await Promise.all(
            transactions.map(async (tx) => {
                const txObj = tx.toObject();

                // Compare using .equals() for ObjectId
                const isSender = tx.account && tx.account.equals(account._id);
                const isReceiver = tx.toAccount && tx.toAccount.equals(account._id);

                // Fetch names
                let senderName = 'Unknown';
                let receiverName = 'Unknown';

                if (isSender) {
                    // Get receiver name
                    const receiverAcc = await accountModel.findById(tx.toAccount).populate('user');
                    if (receiverAcc && receiverAcc.user) {
                        const receiverUser = typeof receiverAcc.user === 'object'
                            ? receiverAcc.user
                            : await userModel.findById(receiverAcc.user);
                        receiverName = receiverUser?.name || 'Unknown';
                    }
                    senderName = req.user?.name || 'You';
                } else if (isReceiver) {
                    // Get sender name
                    const senderAcc = await accountModel.findById(tx.account).populate('user');
                    if (senderAcc && senderAcc.user) {
                        const senderUser = typeof senderAcc.user === 'object'
                            ? senderAcc.user
                            : await userModel.findById(senderAcc.user);
                        senderName = senderUser?.name || 'Unknown';
                    }
                    receiverName = req.user?.name || 'You';
                }

                txObj.txType = isSender ? 'DEBIT' : (isReceiver ? 'CREDIT' : 'UNKNOWN');
                txObj.senderName = senderName;
                txObj.receiverName = receiverName;
                txObj.counterparty = isSender ? receiverName : senderName;
                txObj.amount = txObj.amount || 0;
                txObj.status = txObj.status || 'PENDING';
                txObj.createdAt = txObj.createdAt || new Date();

                return txObj;
            })
        );

        const total = await transactionModel.countDocuments({
            $or: [{ account: account._id }, { toAccount: account._id }]
        });

        res.status(200).json({
            transactions: transactionsWithDetails,
            totalPages: Math.max(1, Math.ceil(total / parseInt(limit))),
            currentPage: parseInt(page),
        });
    } catch (error) {
        console.error('Error in getUserTransactions:', error);
        res.status(500).json({ message: 'Failed to fetch transactions', error: error.message });
    }
}


async function createTransaction(req, res) {

    /**
     * -1. validate request
     */
    const { account, toAccount, amount, idempotencyKey } = req.body;
    console.log('🔍 Received account:', account);
    console.log('🔍 Received toAccount:', toAccount);
    console.log('🔍 Amount:', amount);
    console.log('🔍 IdempotencyKey:', idempotencyKey);
    if (!account || !toAccount || !amount || !idempotencyKey) {
        return res.status(400).json({
            message: "FromAccount, toAccount, amount and idempotencyKey are required"
        })
    }
    const fromUserAccount = await accountModel.findOne({
        _id: account,
    })
    const toUserAccount = await accountModel.findOne({
        _id: toAccount,
    })

    console.log('🔍 fromUserAccount found:', !!fromUserAccount);
    console.log('🔍 toUserAccount found:', !!toUserAccount);
    if (!fromUserAccount || !toUserAccount) {
        console.log('❌ Account not found - from:', fromUserAccount, 'to:', toUserAccount);
        return res.status(400).json({
            message: "Invalid fromAccount or toAccount"
        })
    }

    /**
     * -2. validate idempotency key
     */

    const isTransactionAlreadyExists = await transactionModel.findOne({
        idempotencyKey: idempotencyKey,
    })
    if (isTransactionAlreadyExists) {
        if (isTransactionAlreadyExists.status === "COMPLETED") {
            return res.status(200).json({
                message: "Transaction already processed",
                transaction: isTransactionAlreadyExists
            })
        }
        if (isTransactionAlreadyExists.status === "PENDING") {
            return res.status(200).json({
                message: "Transaction is still processed",
                transaction: isTransactionAlreadyExists
            })
        }
        if (isTransactionAlreadyExists.status === "FAILED") {
            return res.status(500).json({
                message: "Transaction processing failed, please retry",
            })
        }
        if (isTransactionAlreadyExists.status === "REVERSED") {
            return res.status(500).json({
                message: "Transaction was reversed, please retry",
            })
        }
    }

    /**
    * -3. Check account status
    */

    if (fromUserAccount.status !== "ACTIVE" || toUserAccount.status !== "ACTIVE") {
        return res.status(400).json({
            message: "Both fromAccount and toAccount must be ACTIVE to process transaction"
        })
    }

    /**
    * -4. Derive sender balance from ledger
    */
    const balance = await fromUserAccount.getBalance();
    if (balance < amount) {
        return res.status(400).json({
            message: `Insufficient balance in fromAccount. Current balance is ${balance}. Requested balance is ${amount}`
        })
    }


    let transaction;
    try {

        const session = await mongoose.startSession()
        //starttransaction make sure that if one fails the whole transaction fails maintining the atomicity of the transaction
        //here we make sure either the 5,6,7 steps are done or nothing is done
        session.startTransaction()
        /**
         * -5. Create transaction (PENDING)
         */


        //create client side trnasaction
        transaction = (await transactionModel.create([{
            account,
            toAccount,
            amount,
            idempotencyKey,
            type: req.body.type || "other",
            status: "PENDING"
        }], { session }))[0]

        /**
         * -6. create debit ledger entry
         * 
        */
        //while using session data should be passed in the form of array
        const debitLedgerEntry = await ledgerModel.create([{
            account: account,
            amount: amount,
            transaction: transaction._id,
            type: "DEBIT"
        }], { session })

        await new Promise((resolve) => setTimeout(resolve, 15 * 1000));

        /**
         * -7. create credit ledger entry
         */
        const creditLedgerEntry = await ledgerModel.create([{
            account: toAccount,
            amount: amount,
            transaction: transaction._id,
            type: "CREDIT"
        }], { session })




        /**
         * -8. mark transaction completed
         */
        transaction.status = "COMPLETED"
        // await transaction.save({ session })
        await transactionModel.findOneAndUpdate(
            { _id: transaction._id },
            { status: "COMPLETED" },
            { session }
        )


        /**
         * -9. commit mongoDB session
         */
        await session.commitTransaction()
        session.endSession()
        // In createTransaction function, after successful transaction:
        const sendNotification = req.app.get('sendNotification');
        
        // Notify sender
        sendNotification(
            req.user._id.toString(),
            `₹${amount} sent to ${toAccount}`,
            { type: 'DEBIT', amount, toAccount }
        );

        // Notify receiver
        const receiverUser = await userModel.findOne({ _id: toUserAccount.user });
        if (receiverUser) {
            sendNotification(
                receiverUser._id.toString(),
                `Received ₹${amount} from ${req.user.name}`,
                { type: 'CREDIT', amount, fromAccount: account }
            );
        }

        // ============ BUDGET ALERT CHECK ============
        const { budgets } = req.body;
        const category = req.body.type || 'other';

        if (budgets && budgets[category] && budgets[category].limit > 0) {
            const budgetLimit = budgets[category].limit;

            // Calculate total spent for this category (including this transaction)
            const spentResult = await transactionModel.aggregate([
                {
                    $match: {
                        account: fromUserAccount._id,
                        type: category,
                        status: 'COMPLETED'
                    }
                },
                { $group: { _id: null, total: { $sum: '$amount' } } }
            ]);

            const totalSpent = spentResult.length > 0 ? spentResult[0].total : 0;

            // If exceeded, send notification
            if (totalSpent > budgetLimit) {
                const overAmount = totalSpent - budgetLimit;
                const message = `Budget Alert: You have exceeded your ${category} budget by ₹${overAmount}. Current spending: ₹${totalSpent}, Budget: ₹${budgetLimit}.`;

                // Send WebSocket notification to the sender
                if (sendNotification) {
                    sendNotification(
                        req.user._id.toString(),
                        message,
                        { type: 'BUDGET_ALERT', category, totalSpent, budgetLimit }
                    );
                }

                // Optionally, you can also add a flag in the response
                res.locals.budgetAlert = {
                    exceeded: true,
                    category,
                    totalSpent,
                    budgetLimit,
                    message
                };
            }
        }
    }
    catch (error) {

        return res.status(400).json({
            message: "Transaction is Pending due to some issue, please retry after sometime",
        })
    }

    /**
     * -10. send emailnotification
     */

    await emailService.sendTransactionEmail(req.user.email, req.user.name, amount, toAccount)
    return res.status(200).json({
        message: "Transaction completed successfully",
        transaction: transaction,
        budgetAlert: res.locals.budgetAlert || null
    })

}

async function createInitialFundsTransaction(req, res) {
    const { toAccount, amount, idempotencyKey } = req.body

    if (!toAccount || !amount || !idempotencyKey) {
        return res.status(400).json({
            message: "toAccount, amount and idempotencyKey are required",
        })
    }

    const toUserAccount = await accountModel.findOne({
        _id: toAccount,
    })

    if (!toUserAccount) {
        return res.status(400).json({
            message: "Invaid toAccount"
        })
    }

    const fromUserAccount = await accountModel.findOne({
        user: req.user._id

    })

    if (!fromUserAccount) {
        return res.status(400).json({
            message: "System user account not found"
        })
    }

    const session = await mongoose.startSession()
    session.startTransaction()

    const transaction = new transactionModel({
        account: fromUserAccount._id,
        toAccount,
        amount,
        idempotencyKey,
        status: "PENDING"
    })
    // const debitLedgerEntry = await ledgerModel.create([{
    //     account: fromUserAccount._id,
    //     amount: amount,
    //     transaction: transaction._id,
    //     type: "DEBIT",
    // }], { session })
    await ledgerModel.create([{
        account: toAccount,
        amount: amount,
        transaction: transaction._id,
        type: "CREDIT",
    }], { session })

    transaction.status = "COMPLETED"
    await transaction.save({ session })

    await session.commitTransaction()
    session.endSession()


    return res.status(201).json({
        message: "Initial funds transaction completed successfully",
        transaction: transaction
    })

}

module.exports = { createTransaction, createInitialFundsTransaction, getUserTransactions }
