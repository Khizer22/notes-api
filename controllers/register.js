import bcrypt from 'bcrypt';

const handleRegister = db => (req,res) =>{

    const {email, name, password} = req.body;

    if (!email || !name || !password){
        return res.status(400).json('Please enter all fields.')
    }
    
    const saltRounds = 10;
    const hash = bcrypt.hashSync(password,saltRounds);    

    db.transaction(trx => {
        trx.insert({
            name: name,
            email: email,
            hash: hash
        })
        .into('users_table')
        .returning(['name','email'])
        .then(data => {
            return res.status(200).json(data[0]); 
        })
        .then(trx.commit)
        .catch(err => {
            trx.rollback;
            return res.status(400).json(err);
        });
    })
        
}

export default handleRegister;