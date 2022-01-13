//importation du schéma de sauce
const Sauce = require('../models/Sauce');

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
                    .then(() => res.status(200).json({ message: "Objet supprimé !"}))
                    .catch(error => res.status(400).json({ error }));
            })
        })
        .catch(error => res.status(500).json({ error }));
};

