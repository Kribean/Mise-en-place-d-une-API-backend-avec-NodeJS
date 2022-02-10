

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
              return [tabId.join(','),tab.split(',').includes(id)]

          };
          
          if(req.body.like==1)
          {

            sauceObject = {usersLiked:detectUser(obj.usersLiked,req.body.userId)[0]+','+req.body.userId,
            likes:obj.likes+1,};

            
          }else if(req.body.like==-1) {

              sauceObject = {
                usersDisliked:detectUser(obj.usersDisliked,req.body.userId)[0]+','+req.body.userId,
                dislikes:obj.dislikes+1};

          

          }else if(req.body.like==0)
          {
            console.log('000000000000000tttt');
            console.log(detectUser(obj.usersLiked,req.body.userId)[1]);
            console.log(detectUser(obj.usersLiked,req.body.userId)[0]);
            console.log(req.body.userId);

            if(detectUser(obj.usersLiked,req.body.userId)[1])
            {
              
              sauceObject = {usersLiked:detectUser(obj.usersLiked,req.body.userId)[0],
              likes:obj.likes-1,};

            }else if(detectUser(obj.usersDisliked,req.body.userId)[1])
            {
              sauceObject = {
                usersDisliked:detectUser(obj.usersDisliked,req.body.userId)[0],
                dislikes:obj.dislikes-1};

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