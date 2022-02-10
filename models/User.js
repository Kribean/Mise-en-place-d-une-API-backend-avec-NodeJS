const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

//définition des paramètres liées à l'utilisateur qui sera enregistré en base de donnée
const userSchema = mongoose.Schema({
    email : {type: String, required:true, unique: true},
    password : {type: String, required:true}
});
userSchema.plugin(uniqueValidator);
module.exports = mongoose.model('User',userSchema);