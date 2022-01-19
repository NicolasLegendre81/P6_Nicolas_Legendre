const express = require('express');
const router = express.Router();
//Import de mes middlewares afin de controller les Autorisations et du multer 
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const sauceCtrl = require('../controllers/Sauce');
//Route get pour voir toutes les sauces
router.get('/', sauceCtrl.getAllSauces);
//Route get pour obtenir une sauce en particulier
router.get('/:id',sauceCtrl.getOneSauce);
// Route post pour créer une nouvelle sauce
router.post('/', auth, multer, sauceCtrl.createSauce);
//Route put modification d'une sauce
router.put('/:id', auth, multer, sauceCtrl.modifySauce);
//Route delete suppression d'une sauce
router.delete('/:id', auth, sauceCtrl.deleteSauce);
//Route like ou dislike
router.post('/:id/like', auth, sauceCtrl.likeOrDislike);


module.exports = router;
