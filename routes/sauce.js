const express = require('express')  
const router = express.Router();

const sauceCtrl =require('../controllers/sauce') ;
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

router.post('/',auth,multer, sauceCtrl.createSauce );//route liée au controller permettant la création d'une sauce

  router.get('/:id',auth, sauceCtrl.getOneSauce);//route liée au controller permettant de sélectionner qu'une sauce

  router.put('/:id',auth,multer, sauceCtrl.modifySauce); //route liée au controller permettant la de modifier les caractéristique d'une sauce
  
  router.post('/:id/like',auth, sauceCtrl.likeSauce);//route liée au controller permettant de liker ou disliker une sauce

  router.delete('/:id',auth, sauceCtrl.deleteSauce );//route liée au controller permettant la suppression d'une sauce

router.get('/',auth, sauceCtrl.getAllSauce);//route liée au controller permettant l'affichade de toutes les sauces

  module.exports = router;