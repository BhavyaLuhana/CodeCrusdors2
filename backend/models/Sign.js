const mongoose = require('mongoose');

const signSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model('Sign', signSchema);