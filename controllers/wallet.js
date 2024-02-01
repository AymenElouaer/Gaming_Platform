const stripeController = require('./stripe.js');
const User = require('../models/users.js');
const Transaction = require('../models/transaction.js');

const depositFunds = async (req, res) => {
    try {
        const { userId, amount, paymentMethodId } = req.body;

        // Charge the user using Stripe
        const paymentIntent = await stripeController.chargeUser(userId, amount, paymentMethodId);

        // Update user balance
        const user = await User.findByIdAndUpdate(userId, { $inc: { balance: amount } }, { new: true });

        // Save deposit transaction
        await Transaction.create({ userId, amount, type: 'deposit' });

        res.json({ user, paymentIntent });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Deposit failed' });
    }
};

const withdrawFunds = async (req, res) => {
    try {
        const { userId, amount } = req.body;

        // Validate sufficient balance
        const user = await User.findById(userId);
        if (!user || user.balance < amount) {
            return res.status(400).json({ error: 'Insufficient balance' });
        }

        // Initiate withdrawal process (using Stripe or other payment provider)

        // Update user balance
        await User.findByIdAndUpdate(userId, { $inc: { balance: -amount } });

        // Save withdrawal transaction
        await Transaction.create({ userId, amount, type: 'withdrawal' });

        res.json({ message: 'Withdrawal initiated' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Withdrawal failed' });
    }
};
module.exports = {
    depositFunds,
    withdrawFunds
}