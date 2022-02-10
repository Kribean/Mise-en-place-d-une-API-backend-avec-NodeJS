

const Sauce =require('../models/Sauce') ;
const fs = require('fs');

  /**
  * @name createSauce
  * @param {object} [req] req contient le nom, description, url de l'image de la sauce 
  * @param {object} [res] retourne le statut de la fin du traitement de la requete sous forme de message 
  */
  exports.createSauce = (req, res, next) => {


    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({
      ...sauceObject,
      userId:req.token.userId,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,

    });

    sauce.save()
      .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
      .catch(error => res.status(400).json({ error }));
     
  };

 /**
  * @name modifySauce
  * @param {object} [req] req contient le nom, description, url de l'image de la sauce 
  * @param {object} [res] retourne le statut de la fin du traitement de la requete sous forme de message 
  */
  exports.modifySauce = (req, res, next) => {
    Sauce.findOne({  _id: req.params.id })
    .then((sauce)=>{
      if(sauce.userId==req.token.userId)
      {

      
      const sauceObject = req.file ?
      {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
      } : { ...req.body };

    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
      .then(() => res.status(200).json({ message: 'Objet modifié !'}))
      .catch(error => res.status(400).json({ error }));
    }else{
      res.status(401).json({ message:"vous n'etes pas authorisé à modifier cette sauce" });
    }

    })
    
  };

 /**
  * @name likeSauce
  * @param {object} [req] req contient l'id du produit, de l'utilisateur qui like et de la valeur de son like (1,-1,0)
  * @param {object} [res] retourne le statut de la fin du traitement de la requete sous forme de message 
  */
  exports.likeSauce = (req, res, next) => {
    Sauce.findOne({  _id: req.params.id })
    .then((sauce)=>{
      if(req.body.like==1){
        sauce.likes+=1;
        sauce.usersLiked.push(req.body.userId);
      }else if(req.body.like==-1){
        sauce.dislikes+=1;
        sauce.usersDisliked.push(req.body.userId);

      }else if(req.body.like==0){
        if(sauce.usersLiked.includes(req.body.userId)){
          sauce.likes-=1;
          sauce.usersLiked=sauce.usersLiked.filter((id)=>id!=req.body.userId);

        }else if(sauce.usersDisliked.includes(req.body.userId)){
          sauce.dislikes-=1;
          sauce.usersDisliked=sauce.usersDisliked.filter((id)=>id!=req.body.userId);

        }

      }
      sauce.save()
      .then(() => res.status(200).json({ message: 'Objet modifié !'}))
      .catch(error => res.status(400).json({ error }));
    })

  }

  /**
  * @name deleteSauce
  * @param {object} [req] req contient le nom, description, url de l'image de la sauce 
  * @param {object} [res] retourne le statut de la fin du traitement de la requete sous forme de message 
  * @returns supprime l'élément sélectionné
  */
  exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
      .then(sauce => {
        if(sauce.userId==req.token.userId)
        {
  
          const filename = sauce.imageUrl.split('/images/')[1];
          fs.unlink(`images/${filename}`, () => {
            Sauce.deleteOne({ _id: req.params.id })
              .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
              .catch(error => res.status(400).json({ error }));
          });
  
      }else{
        res.status(401).json({ message:"vous n'etes pas authorisé à supprimer cette sauce" });
      }
      })
      .catch(error => res.status(500).json({ error }));
  };

  /**
  * @name getOneSauce
  * @param {object} [req] req contient le nom, description, url de l'image de la sauce 
  * @param {object} [res] retourne le produit sélectionné
  */
  exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
      .then(sauce => res.status(200).json(sauce))
      .catch(error => res.status(404).json({ error }));
  }

  /**
  * @name getOneSauce
  * @param {object} [req] req contient le nom, description, url de l'image de la sauce 
  * @param {object} [res] retourne tous les produits
  */
  exports.getAllSauce = (req, res, next) => {
    
    Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({ error }));
  }