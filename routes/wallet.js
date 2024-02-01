const express = require('express');
const router = express.Router();
const walletController = require('../controllers/wallet.js');
const auth = require('../middleware/auth');

// Route to deposit funds
router.post('/deposit', auth, walletController.depositFunds);

// Route to withdraw funds
router.post('/withdraw', auth, walletController.withdrawFunds);

module.exports = router;
