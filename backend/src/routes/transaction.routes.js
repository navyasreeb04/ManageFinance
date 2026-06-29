const express = require('express');


const transactionRoutes = express.Router();
const transactionController = require("../controllers/transaction.controllers");
const authMiddleware = require('../middleware/auth.middleware');


transactionRoutes.use(express.json());

/** 
 * - POST /api/transactions/
 * - Create new transaction
 * 
*/


transactionRoutes.post("/",authMiddleware.authMiddleware,transactionController.createTransaction);


/** 
 * - POST /api/transactions/system/initial-funds
 * - Create intial funds transaction from system user
 * 
*/

transactionRoutes.post("/system/initial-funds",authMiddleware.authSystemUserMiddleware,transactionController.createInitialFundsTransaction);

// Add this route
transactionRoutes.get("/", authMiddleware.authMiddleware, transactionController.getUserTransactions);

module.exports = transactionRoutes;