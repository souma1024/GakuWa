const express = require('express');
const router = express.Router();
const loginController = require('../controllers/loginController');

//router.post('/login', loginController.handleLogin);
//router.get('/logout', loginController.handleLogout);

router.get("/", (req, res) => {
    res.send("Login API is working");
    });
    
module.exports = router;