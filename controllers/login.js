import bcrypt, { compareSync } from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = "asdf";

const handleLogin = (req,res,db) => {
    
    const {email, password} = req.body;

    if (!email || !password){
        return Promise.reject('Incorrect form submission');
    }

    return db.select('*').from('users_table')
        .where('email','=',email)
        .then(data => {
            const isValid = bcrypt.compareSync(password, data[0].hash);
            if (isValid){
                const {user_id,name, email} = data[0];
                return {
                    name,
                    user_id,
                    email
                };
            }
            else
                throw "Credentials not valid";
                // Promise.reject('credentials not valid');
        })
        .catch(err => Promise.reject('Wrong credentials'));
     
}

const getAuthTokenID = (req,res) => {
    const {authorization} = req.headers;

    if (!authorization){
        return res.status(401).json("Unauthorized")
    }

    const token = authorization && authorization.split(' ')[1]
    if (token === null) return res.status(401).json("Unauthorized");

    jwt.verify(token, JWT_SECRET, function(err, decoded) {
        if (err){
            console.log(err);
            return res.status(401).json("Unauthorized");
        }

        return res.status(200).json(decoded);
      });
}

const signToken = (signdata) => {
    return jwt.sign(signdata,JWT_SECRET, {expiresIn: '1h'});
    //return jwt.sign(jwtPayload,process.env.JWTSECRET);
}

const createSessions = (user) => {
    const {email, name, user_id} = user;
    const token = signToken({email,name});
    return {success: 'true', email, name, token};
}

const loginAuthentication = (db) => (req,res) => {
    const { authorization } = req.headers;
    return authorization ? getAuthTokenID(req,res) :
    handleLogin(req,res,db)
    .then(data =>{
        return data.name && data.email && data.user_id ? createSessions(data) : Promise.reject(data);
    } )
    .then(session => res.json(session))
    .catch(err => res.status(400).json(err));

}

export default loginAuthentication;