const Category = require('../models/Category');

exports.createCategory = async (req, res) => {
    try {
        const { donationValue, previousValue, minValue, maxValue, selectedDate } = req.body;
        const category = new Category({
            donationValue,
            previousValue,
            minValue,
            maxValue,
            selectedDate
        });
        await category.save();
        res.status(201).json({ success: true, message: "Category created successfully.", data: category });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error." });
    }
};

exports.getCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.json({ success: true, data: categories });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error." });
    }
};
