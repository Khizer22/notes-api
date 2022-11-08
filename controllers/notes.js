import jwt from 'jsonwebtoken';

const JWT_SECRET = "asdf";

const handleCreateNote = db => (req,res) => {

    const {title, text, email} = req.body;

    if (!email || !title || !text){
        return res.status(400).json('Missing fields')
    } 

    db.transaction(trx => {
        trx.insert({
            title: title,
            email: email,
            text: text
        })
        .into('notes_table')
        .returning('note_id')
        .then(noteID => {
            return res.status(200).json(noteID[0]); 
        })
        .then(trx.commit)
        .catch(err => {
            trx.rollback;
            return res.status(400).json(err);
        });
    })

}

const handleUpdateNote = db => (req,res) => {
    const id = req.params.id;
    const {title, text, email} = req.body;

    db('notes_table')
        .where({note_id : id, email})
        .update({
            title: title,
            text: text
            // dateCreated: new Date()
        })
        .then(response => {
            if (response){
                return res.status(200).json({note_id: id})
            }else{
                return res.status(400).json('Unable to update note')
            }
        })
        .catch(err => res.status(400).json('Unable to update note')); 
        
}

const handleDeleteNote = db => (req,res) => {
    const id = req.params.id;
    const {email} = req.body;

    db.select('*').from('notes_table').where({ note_id: id, email })
    .del()
    .then(res.status(200).json('deleted'))
    .catch(err => res.status(400).json(err));

}

const handleGetNote = db => (req,res) => {
    const {email} = req.body;

    db.select('*').from('notes_table').where({email})
    .then(notes => {
        res.json(notes);
    })
    .catch(err => res.status(400).json('Error getting notes'));

}

export {handleCreateNote, handleDeleteNote, handleGetNote, handleUpdateNote};