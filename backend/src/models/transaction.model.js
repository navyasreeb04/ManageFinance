const mongoose = require('mongoose');


const transactionSchema = new mongoose.Schema({
    account:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Account",
        required: [true, "Transaction must be associated with an account"],
        index: true //to optimize queries that filter transactions by account, improving performance when retrieving transactions for a specific account. if we need to get all transactions for a specific account, we can use this index to quickly find the relevant transactions without having to scan the entire collection.
    },
    toAccount:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Account",
        required: [true, "Transaction must be associated with a toAccount"],
        index: true
    },
    status:{
        type: String,
        enum:{
            values: ["PENDING", "COMPLETED", "FAILED","REVERSED"],
            message: "Status can be either PENDING, COMPLETED, FAILED or REVERSED"
        },
        default: "PENDING"
    },
    amount:{
        type: Number,
        required: [true, "Amount is required for creating a transaction"],
        min: [0, "Transaction cannot be negative"]
    },
    type: {
        type: String,
        enum: {
            values: ["food", "rent", "entertainment", "savings", "shopping", "transport", "bills", "education", "health", "other"],
            message: "Invalid transaction type"
        },
        default: "other"
    },
    idempotencyKey:{ //prevents the transaction from being processed multiple times in case of network failures or retries. It ensures that even if the same request is sent multiple times, only one transaction will be created with the same idempotency key. It will be generated in client side and sent to server for processing. If the same idempotency key is received again, the server will recognize it and return the same response as the original request, preventing duplicate transactions.
        type: String,
        required: [true, "Idempotency key is required for creating a transaction"],
        index: true,
        unique: true //to ensure that each transaction has a unique idempotency key, preventing duplicate transactions from being created with the same key.
    }
},{
    timestamps: true
});




const transactionModel = mongoose.model("Transaction",transactionSchema);
module.exports = transactionModel;