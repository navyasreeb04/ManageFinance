const mongoose = require("mongoose");
const ledgerModel = require("../models/ledger.model");
const accountSchema = new mongoose.Schema({
    user:{
        //mongoose.Schema.Types.ObjectId is a special type in Mongoose that represents a unique identifier for a document in a MongoDB collection. It is used to create references between different collections, allowing you to establish relationships between documents. In this case, it is used to reference the User model, indicating that each account belongs to a specific user.
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Account must be associated with a user"],
        index: true //to optimize queries that filter accounts by user, improving performance when retrieving accounts for a specific user.
        //mongoDB uses B+ trees for the implementaion of indexes
    },
    status:{
        type: String,
        enum: {
            values: ["ACTIVE","FROZEN", "CLOSED"],
            message: "Status can be either ACTIVE, FROZEN, or CLOSED"
        },
        default: "ACTIVE"
    },
    currency:{
        type: String,
        required: [true, "Currency is required for creating an account"],
        default: "INR"
    }
},{
    timestamps: true
})


accountSchema.index({ user: 1, status: 1 }); //to optimize queries that filter accounts by both user and status, improving performance when retrieving accounts for a specific user with a specific status.


//accountSchema.methods is the built-in Mongoose property used to add custom instance methods to your documents.
accountSchema.methods.getBalance = async function(){
    //aggregation pipeline of mongodb helps in writing custom queries throguh aggreagte function
    const balanceData = await ledgerModel.aggregate([
        {$match : {account:this._id}},
        {$group:{
            _id:null,
            totalDebit:{
                $sum:{
                    $cond:[
                        {$eq: ["$type","DEBIT"]},//if type==debit add to amount else add 0
                        "$amount",
                        0
                    ]
                }
            },
            totalCredit:{
                $sum:{
                    $cond:[
                        {$eq: ["$type","CREDIT"]},//if type==debit add to amount else add 0
                        "$amount",
                        0
                    ]
                }
            }
        }},
        {
            $project:{
                _id: 0,
                balance: {$subtract: ["$totalCredit","$totalDebit"]}
            }
        }
    ])

    //when the accoutn is new no ledger entries willbe created then balance data returns a empty array
    if(balanceData.length===0)
    {
        return 0;
    }
    return balanceData[0].balance

}
const accountModel = mongoose.model("Account",accountSchema)

module.exports = accountModel;