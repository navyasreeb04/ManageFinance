const express = require("express");
const accountModel = require("../models/account.model");
const userModel = require("../models/user.model");
const transactionModel = require("../models/transaction.model");
const ledgerModel = require("../models/ledger.model");

async function createAccountController(req, res) {
    const user = req.user; // Get the authenticated user from the request object

    const account = await accountModel.create({
        user: user._id
    })

    //Auto-credit ₹5000 from System Account
    try {
        // Find system user
        const systemUser = await userModel.findOne({ systemUser: true });
        if (systemUser) {
            const systemAccount = await accountModel.findOne({ user: systemUser._id });
            if (systemAccount) {
                // Create transaction
                const transaction = await transactionModel.create({
                    account: systemAccount._id,
                    toAccount: account._id,
                    amount: 5000,
                    status: 'COMPLETED',
                    idempotencyKey: `system_credit_${account._id}_${Date.now()}`,
                    type: 'other',
                });

                // Create ledger entries
                await ledgerModel.create([
                    {
                        account: systemAccount._id,
                        amount: 5000,
                        transaction: transaction._id,
                        type: 'DEBIT',
                    },
                    {
                        account: account._id,
                        amount: 5000,
                        transaction: transaction._id,
                        type: 'CREDIT',
                    }
                ]);

                console.log(`₹5000 credited to account ${account._id}`);
            }
        }
    } catch (error) {
        console.error('Failed to credit initial funds:', error);
        // Don't fail account creation if funds fail
    }

    res.status(201).json({
        message: "Account created successfully",
        account
    });
}


async function getUserAccountController(req, res) {
    const accounts = await accountModel.find({ user: req.user._id });
    res.status(200).json({
        accounts
    })
}

async function getAccountBalanceController(req, res) {
    const { accountId } = req.params;
    //to chekc if the user is checkign his account balance or others

    const account = await accountModel.findOne({
        _id: accountId,
        user: req.user._id
    })

    if (!account) {
        return res.status(404).json({
            message: "Account not found"
        })
    }

    const balance = await account.getBalance();
    res.status(200).json({
        accountId: account._id,
        balance: balance
    })
}
module.exports = {
    createAccountController,
    getUserAccountController,
    getAccountBalanceController
};