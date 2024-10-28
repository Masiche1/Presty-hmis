const express = require('express');
const router = express.Router();
const PriceList = require('../models/PriceList');

// Create or Update Price List Item
router.post('/', async (req, res) => {
    const priceItem = await PriceList.findOneAndUpdate(
        { name: req.body.name, category: req.body.category },
        req.body,
        { upsert: true, new: true }
    );
    res.status(201).json(priceItem);
});

// Get Price List
router.get('/', async (req, res) => {
    const prices = await PriceList.find();
    res.json(prices);
});

module.exports = router;
