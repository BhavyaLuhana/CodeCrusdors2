const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
    historyId: {
        type: String,
        required: true,
    },
    sentence: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        required: true,
    }
});

module.exports = mongoose.model('History', historySchema);