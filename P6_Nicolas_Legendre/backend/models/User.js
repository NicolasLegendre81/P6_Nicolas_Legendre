const mongoose = require ('mongoose');
//import du plug-in afin de controller que l'adresse mail soit utilisée par un utilisateur unique
const uniqueValidator =require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
    email:{
        type: String,
        required: true,
        unique: true
        },
    password:{
        type: String,
    required:true, 
    },
});

//Utilisation du plug-in de vérification d'unicité d'adresse mail précédement importé
userSchema.plugin(uniqueValidator);
module.exports = mongoose.model('User',userSchema);