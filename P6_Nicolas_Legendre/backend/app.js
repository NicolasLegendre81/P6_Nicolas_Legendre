const express = require('express');
const bodyParser = require ('body-parser');
const userRoute = require ('./routes/user');
//const sauceRoute = require ('./routes/Sauce');


const mongoose = require('mongoose');
require('dotenv').config();
mongoose.connect(process.env.DB_URI,{
  useNewUrlParser: true,
  useUnifiedTopology: true 

})
.then(() => console.log('Connexion à MongoDB réussie !'))
.catch(() => console.log('Connexion à MongoDB échouée !'));



const app = express();
//middleware Cors
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

  app.use (bodyParser.json());// permet de rendre les ressources exploitables

  //Routes utilisateurs
  app.use('/api/auth', userRoute);
  //Routes sauces
  //app.use('/api/auth', sauceRoute);



module.exports = app;