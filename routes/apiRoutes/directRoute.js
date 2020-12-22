const express = require('express');
const router = express.Router();
const registerController = require('../../controller/api/auth/registerController');
router.get('/', function(req, res, next) {
    res.send('Welcome to Hufnaan API');
  });

router.post('/login',()=>{
    res.send('Login API');
});

router.post('/register',registerController.register);

module.exports = router;