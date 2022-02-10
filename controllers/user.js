require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const User = require('../models/User')
/**
 * @name signup
 * @param {objet} [req] requete contenant l'email et le mot de passe liée à la page signup
 * @param {objet} [res] après étape de sauvegarde, envoie un message si l'étape à fonctionnée où pas
 */
exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password,10) //hashage du code avec 10 tours
    .then(hash=>{
        const user = new User({
            email: req.body.email,
            password:hash
        });
        user.save()
        .then(()=>res.status(201).json({message:'Utilisateur créé!'}))
        .catch(error => res.status(400).json({error}))
            
        
    })
    .catch(error => res.status(500).json({error}))

};

/**
 * @name login
 * @param {objet} [req] requete contenant l'email et le mot de passe liée à la page login
 * @param {objet} [res] envoie un message si l'étape à fonctionnée où pas
 * @returns renvoie sur la page des produits
 */
exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
      .then(user => {
        if (!user) {
          return res.status(401).json({ error: 'Utilisateur non trouvé !' });
        }
        bcrypt.compare(req.body.password, user.password) //compare le mot de passe rentré au mot de passe présent en base de donnée
          .then(valid => {
            if (!valid) {
              return res.status(401).json({ error: 'Mot de passe incorrect !' });
            }
            res.status(200).json({
              userId: user._id,
              token: jwt.sign(
                  {userId:user._id},
                  process.env.SECRET_KEY,
                  {expiresIn: '24h'}
              )
            });
          })
          .catch(error => res.status(500).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
  };