const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); //to hash the password before saving it to the database, enhancing security by ensuring that even if the database is compromised, the actual passwords are not exposed in plain text.
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Email is required for creating a user"],
        trim: true, // remove whitespace from both ends of the string
        lowercase: true,
        unique: [true, "Email already exists"], //to ensure that no two users can have the same email address
        match: [/\S+@\S+\.\S+/, 'Please use a valid email address.'] //to validate the email format
    },
    name: {
        type: String,
        required: [true, "Name is required for creating a user"]
    },
    password: {
        type: String,
        required: [true, "Password is required for creating an account"],
        minlength: [6, "Password must be at least 6 characters long"],
        select: false //to exclude the password field from query results by default, enhancing security by preventing accidental exposure of passwords in API responses or database queries.

    },
    transactionPin: {
        type: String,
        select: false,
        default: null
    },
    pinResetOTP: {
        type: String,
        select: false
    },
    pinResetOTPExpiry: {
        type: Date,
        select: false
    },
    passwordResetOTP: {
        type: String,
        select: false
    },
    passwordResetOTPExpiry: {
        type: Date,
        select: false
    },
    systemUser: {
        type: Boolean,
        default: false,
        immutable: true,
        select: false
    }
}, {
    timestamps: true //to automatically add createdAt and updatedAt fields to the user documents, which can be useful for tracking when a user was created or last updated.
})

//pre save hook to hash the password before saving the user document to the database. This ensures that the password is stored securely and not in plain text.
//hashing is one way 
//this function acts as a middleware that runs before the save operation is performed on the user document. It checks if the password field has been modified (to avoid re-hashing an already hashed password) and if so, it hashes the password using bcrypt with a salt round of 10, and then replaces the plain text password with the hashed version before saving it to the database.
// userSchema.pre("save", async function () {
//     if (!this.isModified("password")) {
//         return;
//     }
//     const hash = await bcrypt.hash(this.password, 10);
//     this.password = hash;
//     return;
// })


// userSchema.pre("save", async function () {
//     if (!this.isModified("transactionPin")) {
//         return;
//     }
//      // Hash transactionPin if modified and not null
//     if (this.isModified("transactionPin") && this.transactionPin) {
//         this.transactionPin = await bcrypt.hash(this.transactionPin, 10);
//     }
// });


// SINGLE pre-save hook for BOTH password and transactionPin
userSchema.pre("save", async function () {
    // Hash password if modified
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    // Hash transactionPin if modified and not null
    if (this.isModified("transactionPin") && this.transactionPin) {
        this.transactionPin = await bcrypt.hash(this.transactionPin, 10);
    }
});

userSchema.methods.comparePassword = async function (password) {
    //compare the provided password with the hashed password stored in the database using bcrypt's compare function. This allows you to verify if the provided password is correct without exposing the actual password.
    console.log(password, this.password)
    if (!this.password) {
        console.error('No password hash found for user');
        return false;
    }
    console.log('Comparing:', password, 'with hash:', this.password);
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.compareTransactionPin = async function (pin) {
    if (!this.transactionPin) {
        return false;
    }
    return await bcrypt.compare(pin, this.transactionPin);
};

userSchema.methods.compareTransactionPin = async function (pin) {
    if (!this.transactionPin) {
        console.log('❌ No transactionPin found for user');
        return false;
    }
    const result = await bcrypt.compare(pin, this.transactionPin);
    console.log('compareTransactionPin result:', result);
    return result;
};

const userModel = mongoose.model("User", userSchema);
module.exports = userModel;