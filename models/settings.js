const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const settingsSchema = new Schema({
    dailyBudget: {
        type: String,
        required: false
    },
    weeklyBudget: {
        type: String,
        required: false
    },
    monthlyBudget: {
        type: String,
        required: false
    },
    categories: {
        type: String,
        required: true
    },
    members: {
        type: String,
        required: false
    },
    currency: {
        type: String,
        required: false
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

module.exports = mongoose.model('Settings', settingsSchema);