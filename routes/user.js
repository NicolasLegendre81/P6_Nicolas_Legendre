//importation d'express
const express = require ('express');

// creation d'un routeur
const router = express.Router();

//import du controller
const userControl = require ('../controllers/users');

//Creation d'un new user
router.post('/signup',userControl.signup);

//Connection d'un utilisateur
router.post('/login', userControl.login);


module.exports =router;