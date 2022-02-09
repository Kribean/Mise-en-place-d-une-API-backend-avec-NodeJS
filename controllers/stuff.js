

const Sauce =require('../models/Sauce') ;
const fs = require('fs');
/*exports.createThing = (req, res, next) => {
    delete req.body._id;
    const thing = new Thing({
        ...req.body
    })
    thing.save().then(()=>{res.status(201).json({message: 'objet enregistré'})})
    .catch(error => res.status(400).json({error}));
  }*/

  exports.createSauce = (req, res, next) => {

    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({
      ...sauceObject,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
      likes: 0,
      dislikes: 0,
      usersLiked: '',
      usersDisliked: ''
    });
    console.log("ou ou ou 3");
    console.log(sauce);
    sauce.save()
      .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
      .catch(error => res.status(400).json({ error }));
      console.log("ou ou ou 4");
  };


  exports.modifySauce = (req, res, next) => {

    const sauceObject = req.file ?
      {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
      } : { ...req.body };
console.log('debut');
      console.log(req.file);
console.log(req.body.heat+5);
console.log('fin')
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
      .then(() => res.status(200).json({ message: 'Objet modifié !'}))
      .catch(error => res.status(400).json({ error }));
  };

  exports.likeSauce = (req, res, next) => {
      console.log('nou la');
      console.log(req.params);
      console.log('go');
      let sauceObject;
      Sauce.findOne({  _id: req.params.id }).then( (obj)=> {
          function detectUser(tab,id){
              console.log(tab);
              tabId = tab.split(',');
              tabId = tabId.filter((x)=>{return x!=id})
                console.log('hello voici le resultat de la fonction');
                console.log(tabId.join(','));
              return tabId.join(',')

          };
          
          if(req.body.like==1)
          {
              if (obj.dislikes>0)
              {
                  console.log(obj.usersLiked);
                  console.log(req.body.userId);
                  console.log(detectUser(obj.usersLiked,req.body.userId));
                  console.log('kamui');
                sauceObject = {usersLiked:detectUser(obj.usersLiked,req.body.userId)+','+req.body.userId,
                    usersDisliked:detectUser(obj.usersDisliked,req.body.userId),
                     likes:obj.likes+1,
                     dislikes:obj.dislikes-1};
              }else{
                sauceObject = {usersLiked:detectUser(obj.usersLiked,req.body.userId)+','+req.body.userId,
                     usersDisliked:detectUser(obj.usersDisliked,req.body.userId),
                     likes:obj.likes+1,
                     dislikes:0}; 
              }
            
          }else if(req.body.like==-1) {
            if (obj.likes>0)
            {
              sauceObject = {usersLiked:detectUser(obj.usersLiked,req.body.userId),
                usersDisliked:detectUser(obj.usersDisliked,req.body.userId)+','+req.body.userId,
                likes:obj.likes-1,
                dislikes:obj.dislikes+1};
            }else{
              sauceObject = {usersLiked:detectUser(obj.usersLiked,req.body.userId),
                usersDisliked:detectUser(obj.usersDisliked,req.body.userId)+','+req.body.userId,
                likes:0,
                dislikes:obj.dislikes+1}; 
            }
          

          }
          Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Objet modifié !'}))
          .catch(error => res.status(400).json({ error }));
          console.log(sauceObject);}
        );

    
    
    console.log(sauceObject);


      console.log('nou ja fin')
  };


  exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
      .then(sauce => {
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
          Sauce.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
            .catch(error => res.status(400).json({ error }));
        });
      })
      .catch(error => res.status(500).json({ error }));
  };

  exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
      .then(sauce => res.status(200).json(sauce))
      .catch(error => res.status(404).json({ error }));
  }

  exports.getAllSauce = (req, res, next) => {
    
    Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({ error }));
  }