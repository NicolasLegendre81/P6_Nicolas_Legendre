const express = require('express');
const router = express.Router;
const sauceCtrl = require('../controllers/Sauce');

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

// Route post pour créer une nouvelle sauce
router.post('', auth, multer, sauceCtrl.createSauce);
