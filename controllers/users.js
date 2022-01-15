//import de l'algorithme afin de hasher le mdp
const bcrypt = require ('bcrypt');
//import du package jsonwebtoken afin d'attribuer un token a l'utilisateur lors de la connexion
const jwt = require ('jsonwebtoken');
//Le module sanitize permet de nettoyer le corps de la requête
const sanitize = require ('mongo-sanitize')

// Import du package password-validator a des fins de controle du format du mot de passe
const passwordValidator = require('password-validator');

//importation du modèle User
 const User = require('../models/User');

//creation du schema pour le mdp
const passwordSchema = new passwordValidator();

passwordSchema
.is().min(8) //contient au minimum 8 caractéres
.has().uppercase() // doit contenir au moins une majuscule
.has().lowercase() // doit contenir une minuscule
.has().digits() //doit contenir au moins un chiffre
.has().symbols()//contient un caractére spécial au minimum
.has().not().spaces()//ne contient pas d'espaces
.is().not().oneOf(['Passw0rd-','One*234']);//Blackliste
 

//creation d'un nouvel utilisateur et hashage du mdp a l'aide de bcrypt
exports.signup = (req,res, next) => {
    const email = sanitize(req.body.email);
    const password = sanitize(req.body.password)
    //Si le mot de passe est au format attendu 
    //le salage du mdp est effectué 10 fois,la valeur peut être augmentée afin d'augmenter
    //la sécurité mais la fonction mettra plus de temps a être exécutée dans ce cas
    if(passwordSchema.validate(req.body.password)){
        bcrypt.hash(password,10)
        .then(hash =>{
            const user = new User ({
                email:email,
                password:hash
            });
            user.save()
                .then(() => res.status(201).json({message: 'Un nouvel utilisateur a été crée!'}))
                .catch(error=> res.status(400).json({error}));
        })
        .catch(error => res.status(500).json({error}))}
    else{
        res.status(400).json({ message:'Votre mot de passe doit comporter au moins 8 caractéres dont une majuscule,une minuscule,un chiffre et un caractére spécial et aucun espace'})
    }

};

//Verification pour permettre la connection d'un utilisateur existant
exports.login = (req,res,next) =>{
    const email = sanitize(req.body.email);
    const password = sanitize(req.body.password);
    //recherche de l'utilisateur dans la base de données
    User.findOne({email:email})
        .then(user => {
            if (!user) {
                return res.status(401).json({message:'Utilisateur introuvable'});
            }
            //Si l'utilisateur est trouvé on compare le mot de passe renseigné et celui enregistré
            bcrypt.compare(password, user.password)
                .then (valid =>{
                    if (!valid) {                        
                       return res.status(401).json({error:'Mot de passe incorect'});
                    }
                    res.status(200).json ({
                        userId: user._id,
                                token: jwt.sign
                                (
                                    {userId: user._id},
                                    'RANDOM_TOKEN_SECRET',
                                    {expiresIn: '24h'})

                    });
                })
                .catch(error => res.status(500).json({ error }));

            })
    .catch(error => res.status(500).json({ error }));
};


