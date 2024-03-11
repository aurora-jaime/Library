const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

router.post('/signup', authController.signup);
router.post('/signin', authController.signin);

router.get('/logout', authController.protect, authController.logout);

router.get('/login', userController.logInUser);
router.get('/new', userController.getNewUser);

module.exports = router;