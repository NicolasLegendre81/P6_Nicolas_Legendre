const jwt = require('jsonwebtoken');
//Verification du token envoyé par le front-end
module.exports = (req,res,next) =>{
    try {
        const token = req.headers.authorization.split('')[1];
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
        const userId = decodedToken.userId;
        if(req.body.userId && req.body.userId !== userId) {
            throw 'Identifiant utilisateur invalide!';
        }
        else{
            next();
        }
    }
    catch {
        res.status(401).json({
            error: new Error ('Requête invalide!')

        });
    }
};