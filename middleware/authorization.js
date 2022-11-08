import jwt from 'jsonwebtoken';

const JWT_SECRET = "asdf";

const requireAuth = (req,res, next) => {
    
    const {authorization} = req.headers;

    if (!authorization){
        return res.status(401).json("Unauthorized")
    }

    const token = authorization && authorization.split(' ')[1]
    if (token === null) return res.status(401).json("Unauthorized");

    jwt.verify(token, JWT_SECRET, function(err, decoded) {
        if (err){
            console.log(err);
            return res.status(401).json(err);
        }
        req.body.email = decoded.email;
        return next();
    });
}

export default requireAuth;