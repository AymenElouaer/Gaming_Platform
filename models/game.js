const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
    startTime: {
        type: Date,
        required: true
    },

    deadline: {
        type: Date,
        required: true
    },
    // other fields
});

const Game = mongoose.model('Game', gameSchema);

module.exports = Game;