//importation du schéma de sauce
const Sauce = require('../models/Sauce');
//importation du module mongo-sanatize afin de nettoyer le corps de la requête
const sanitize = require("mongo-sanitize");

//importation du module intégré à node permettant d'intéragir avec les fichiers 
//Renommer,effacer etc..
const fs = require('fs');

//Obtenir toutes les sauces
exports.getAllSauces = (req, res, next) => {

    Sauce.find()
    .then( sauces => res.status(200).json(sauces))
    .catch( error => res.status(400).json({ error }))
};
// Obtenir une seule sauce
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({_id : req.params.id})
    .then( sauce => res.status(200).json(sauce))
    .catch( error => res.status(404).json({ error }))
};

//Création d'une nouvelle sauce 
exports.createSauce = (req,res,next) => {
    //Conversion de la chaine js envoyée dans la requête en objet
    const sauceParser = JSON.parse(req.body.sauce);
    const sauceObject = sanitize(sauceParser);
    //Suppression de l'id envoyée par le frontend
    delete sauceObject._id;
    
    //création de la nouvelle instance 
    const sauce = new Sauce ({
        ...sauceObject,
        //définition de l'url de l'image
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,

    });
    sauce.save()
    
     .then(() => res.status(201).json({
        message: 'Sauce enregistrée !'
      }))
      // On ajoute un code erreur en cas de problème
        .catch(error => res.status(400).json({
        error
      }));

};
//Modification d'une sauce
exports.modifySauce = (req,res,next)=>{
    const sauceObject = req.file ?{
    ...JSON.parse(req,body.sauce),
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
} : {...req.body};
Sauce.updateOne({ _id: req.params.id} , {...sauceObject, _id: req.params.id})
    .then(()=> res.status(200).json({ message: 'La sauce a été modifiée'}))
    .catch(()=> res.status(400).json({ error}))
};
//suppression d'une sauce
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then( sauce => {
            const filename = sauce.imageUrl.split("/images/")[1]; //On récupère le deuxième élément [1] du tableau pour avoir le nom du fichier
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: "La sauce a été supprimée !"}))
                    .catch(error => res.status(400).json({ error }));
            })
        })
        .catch(error => res.status(500).json({ error }));
};
//Liker ou Disliker une sauce
exports.likeOrDislike = (req,res,next) => {
    Sauce.findOne({_id:req.params.id})
    .then(sauce =>{
        const liked = req.body.like;
        const user = req.body.userId;
        //Si la sauce est likée
        if(liked === 1) {
            if(!sauce.usersLiked.includes(user) && !sauce.usersDisliked.includes(user)){
            sauce.likes++;
            sauce.usersLiked.push(user);}
            else if (sauce.usersDisliked.includes(user)){
                sauce.likes++,
                sauce.dislikes--,
                sauce.usersLiked.push(user),
                sauce.usersDisliked.splice(sauce.usersDisliked.indexOf(user),1);
            }

        }
        //Si la sauce est dislikée
        if(liked === -1){
            if(!sauce.usersDisliked.includes(user)&& !sauce.usersLiked.includes(user)){
            sauce.dislikes++;
            sauce.usersDisliked.push(user);}
            else if(sauce.usersLiked.includes(user)){
                sauce.likes--,
                sauce.dislikes++,
                sauce.usersDisliked.push(user),
                sauce.usersLiked.splice(sauce.usersLiked.indexOf(user),1);
            }

        }
        Sauce.updateOne(
            {_id: req.params.id},
            {
            likes: sauce.likes,
            dislikes: sauce.dislikes,
            usersLiked: sauce.usersLiked,
            usersDisliked: sauce.usersDisliked,
            _id: req.params.id
            }
        )
        .then(() => res.status(200).json({ message: "Votre évaluation a été prise en considération"}))
        .catch(error => res.status(400).json({error}));
    })
    .catch(error => res.status(404).json({error}));
    
}
