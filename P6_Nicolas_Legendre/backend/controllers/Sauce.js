//importation du schéma de sauce
const Sauce = require('../models/Sauce');

//importation du module intégré à node permettant d'intéragir avec les fichiers 
//Renommer,effacer etc..
const fs = require('fs');

//Création d'une nouvelle sauce 
exports.createSauce = (req,res,next) => {
    //Conversion de la chaine js envoyée dans la requête en objet
    const sauceobject =JSON.parse(req.body.sauce);
    //Suppression de l'id envoyée par le frontend
    delete sauceobject._id
    //création de la nouvelle instance 
    const sauce = new Sauce ({
        ...sauceobject,
        //définition de l'url de l'image
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauce.save()
    .then(() => res.status(201).json({message:'La sauce a été sauvegardée'}))
    .catch (error=> res(400).json({error}));
};
