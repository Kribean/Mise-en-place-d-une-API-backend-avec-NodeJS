//utilisation des variables d'environnements (permet une meilleure gestion sécuritaire)
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

//connection à la base de données
mongoose.connect(process.env.DATABASE_ACCESS,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

  const userRoutes = require('./routes/user');
  const sauceRoutes = require('./routes/sauce');

  const app = express();
  app.use(express.json());

  //définition des accès possible via le front
  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });
//connexion aux routes
  app.use('/api/sauces',sauceRoutes); //routes vers les actions dédiées aux sauces
  app.use('/api/auth', userRoutes); //routes vers les actions dédiées à l'utilisateur
  app.use('/images', express.static(path.join(__dirname, 'images'))); //permet de l'enregistrement des images dans le dossier image
  module.exports = app;