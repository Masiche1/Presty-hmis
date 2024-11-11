const mongoose = require('mongoose');

const priceListSchema = new mongoose.Schema({
    category: { type: String, required: true }, // 'Medical', 'Pharmacy', 'Laboratory'
    name: { type: String, required: true },
    price: { type: Number, required: true }
});

module.exports = mongoose.model('PriceList', priceListSchema);
