const express = require('express');
const userController = require('../controllers/usersController');

const router = express.Router();

router.get('/register', userController.get_register);
router.get('/login', userController.get_login);

router.post('/register', userController.post_register);

module.exports = router;