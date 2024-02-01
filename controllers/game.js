const Game = require('../models/game.js');

//get game details
const getGameDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const game = await Game.findById(id);
        res.json(game);
    } catch(error){
        res.status(500).json({ message: 'Internal server error'});
    }
};

const submit