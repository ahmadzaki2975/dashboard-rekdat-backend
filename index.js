const express = require('express');
const app = express();
const port = 5000;
const knex = require('knex');

const dotenv = require('dotenv');
dotenv.config();

const db = knex({
  client: 'pg',
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER, 
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: 5432
  }
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/bmkg', (req, res) => {
  try{
    db.select('*').from('bmkg').then(data => {
      res.json(data);
    });
  }
  catch(err){
    console.log(err);
  }
});

app.listen(port, () => {
  console.log(`Backend listening at http://localhost:${port}`);
});