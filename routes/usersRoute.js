const express = require('express');
const userController = require('../controllers/usersController');

const router = express.Router();

const {ensureAuthenticated} = require('../config/auth'); 

router.get('/register', userController.get_register);
router.get('/login', userController.get_login);

router.post('/register', userController.post_register);

router.post('/login', userController.post_login);

router.get('/dashboard', ensureAuthenticated, userController.get_dashboard);

router.get('/logout' , userController.get_logout);

module.exports = router;