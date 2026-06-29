const express = require("express");
const authMiddleware = require("../middleware/auth.middleware");
const accountController = require("../controllers/account.controllers");

const router = express.Router();

/** 
 * POST /api/accounts/
 * create a new account
 * protected route, requires authentication, token must be provided in the request header
 */
router.post("/", authMiddleware.authMiddleware, accountController.createAccountController);


/** 
 * GET /api/accounts/
 * Get all accounts of the logged in user
 * protected route, requires authentication, token must be provided in the request header
 */

router.get("/", authMiddleware.authMiddleware, accountController.getUserAccountController);


/** 
 * GET /api/accounts/balance/:accountId
 
 */

router.get("/balance/:accountId", authMiddleware.authMiddleware, accountController.getAccountBalanceController);

module.exports = router;