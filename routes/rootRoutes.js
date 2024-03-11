const express = require('express');
const router = express.Router();
const rootController = require('../controllers/rootController');

/* GET home page. */
router.get('/', rootController.getRoot);

router.get('/about', rootController.getAbout);

router.get('/contact', rootController.getContact);

module.exports = router;
