import express from 'express';
import cors from 'cors';
import knex from 'knex';
//morgan?

import handleRegister from './controllers/register.js';
import handleLoginAuthentication from './controllers/login.js';
import {handleCreateNote, handleDeleteNote, handleGetNote, handleUpdateNote} from './controllers/notes.js';
import requireAuth from './middleware/authorization.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//TEST
app.options('*',cors());
var allowCrossDomain = function(req,res,next) {
  res.header('Access-Control-Allow-Origin', '*'); //set to specific IP
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();  
}
app.use(allowCrossDomain);

//TEMP TESTING
const db = knex ({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    port : 5432,
    user : 'notesuser',
    password : 'password',
    database : 'notesdb',
    ssl: false
    }
});

// const db = knex ({
//   client: 'pg',
//   connection: {
//     connectionString : process.env.DATABASE_URL,
//     ssl: {
//       rejectUnauthorized: false
//     }      
//   }
// });

app.get('/',(req,res) => {
  res.send('getting root');
  console.log("HELLO");
})

app.post('/login',handleLoginAuthentication(db));
app.post('/register', handleRegister(db));
app.get('/note',requireAuth,handleGetNote(db));
app.post('/note',requireAuth,handleCreateNote(db));
app.delete('/note/:id',requireAuth,handleDeleteNote(db));
app.put('/note/:id',requireAuth,handleUpdateNote(db));

const PORT = 5000;

app.listen(PORT,() => {
    //will run after listen happens
    //console.log(`app is running on port: ${process.env.PORT}`);
    console.log(`app is running on port: ${PORT}`);
})

// console.log(process.env);
// const PORT = process.env.PORT;
// console.log(PORT);