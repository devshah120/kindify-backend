const express = require('express');
const { createCategory, getCategories } = require('../controllers/categoryController');

const router = express.Router();

router.post('/category', createCategory);
router.get('/categories', getCategories);

module.exports = router;
