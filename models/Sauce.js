const mongoose = require('mongoose');
//Mise en place du modèle de sauce. Ce modèle permet l'enregistrement des sauces dans la base de donnée
const sauceSchema = mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  manufacturer: { type: String, required: true },
  description: { type: String, required: true },
  mainPepper: { type: String, required: true },
  imageUrl: { type: String, required: true },
  heat: { type: Number, required: true },
  likes: { type: Number, required: false,default:0 },
  dislikes: { type: Number, required: false,default:0 },
  usersLiked: { type: [String], required: false,default:[]},
  usersDisliked: { type: [String], required: false,default:[]}
});

module.exports = mongoose.model('Sauce', sauceSchema);