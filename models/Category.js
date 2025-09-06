const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    donationValue: { type: Number, required: true },
    previousValue: { type: Number, required: true },
    minValue: { type: Number, required: true },
    maxValue: { type: Number, required: true },
    selectedDate: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Category', categorySchema);