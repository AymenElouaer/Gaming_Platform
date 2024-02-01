const express = require('express');
const router = express.Router();
const stripe = require('../controllers/stripe.js');
const auth = require('../middleware/auth.js');

router.post('/payment', auth, stripe.handlePayment);
router.post('/payout', auth, stripe.handlePayout);

module.exports = router;