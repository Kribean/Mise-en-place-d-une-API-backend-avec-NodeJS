const jwt = require('jsonwebtoken');

module.exports = (req,res,next) =>
{
     
    try{
        console.log('hello it s me 0');
        const token = req.headers.authorization.split(' ')[1];
        console.log('hello it s me 1');
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
        console.log('hello it s me 2');
        const userId = decodedToken.userId;
        console.log('hello it s me 3');
        req.auth = { userId }; 
        console.log('hello it s me 4');
        if(req.body.userId && req.body.userId !== userId){
            console.log('hello it s bad');
            throw 'User ID non valable'
        }else{
            console.log('hello it s good');
            next();
        }

    } catch(error){
        res.status(401).json({error: error | 'Requete non authentifié'})
    }
};