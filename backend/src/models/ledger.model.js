//ledger is used to track when the account is credited or debited and the amount of the transaction. It also keeps track of the balance after each transaction. This is important for maintaining an accurate record of the account's financial history and ensuring that the account balance is always up-to-date.
const mongoose = require('mongoose');

const ledgerSchema = new mongoose.Schema({
    account:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Account",
        required: [true, "Ledger must be associated with an account"],
        index: true, //to optimize queries that filter ledgers by account, improving performance when retrieving ledgers for a specific account.
        immutable: true //once the ledger is created, it cannot be changed. This is important for maintaining an accurate record of the account's financial history and ensuring that the account balance is always up-to-date.
    },
    amount: 
    {
        type: Number,
        required: [true, "Amount is required for creating a ledger entry"],
        min: [0, "Ledger entry cannot be negative"],
        immutable:true
    },
    transaction:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Transaction",
        required: [true, "Ledger must be associated with a transaction"],
        index: true,
        immutable:true
    },
    type:{
        type: String,
        enum: {
            values: ["CREDIT", "DEBIT"],
            message: "Type can be either CREDIT or DEBIT"
        },
        required: [true, "Type is required for creating a ledger entry"],
        immutable:true  
    }
})

function preventLedgerModification(){
    throw new Error("Ledger entries are immutable and can't be modified or deleted");
}

//pre is a middleware function that is executed before the specified operation is performed on the ledgerSchema. In this case, it is used to prevent any modifications or deletions of ledger entries, ensuring that the ledger remains immutable and accurate.

ledgerSchema.pre('updateOne', preventLedgerModification);
ledgerSchema.pre('deleteOne', preventLedgerModification);   
ledgerSchema.pre('findOneAndUpdate', preventLedgerModification);
ledgerSchema.pre('findOneAndDelete', preventLedgerModification);
ledgerSchema.pre('updateMany', preventLedgerModification);
ledgerSchema.pre('deleteMany', preventLedgerModification);
ledgerSchema.pre('findOneAndReplace', preventLedgerModification);
ledgerSchema.pre('remove', preventLedgerModification);

const ledgerModel = mongoose.model("Ledger",ledgerSchema);
module.exports = ledgerModel;