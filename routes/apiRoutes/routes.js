const express = require('express');
const router = express.Router();

const registerController = require('../../controller/api/auth/registerController');

router.post('/register-step-2',registerController.registerStep2);

router.post('/register-step-3',registerController.registerStep3);

router.post('/register-step-4',registerController.registerStep4);

router.post('/register-step-5',registerController.registerStep5);

module.exports = router;