'use strict';
const serviceAccount = require('./serviceAccountKey.json');

const admin = require('firebase-admin');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const express = require('express');
const app = express();


app.get('/test', async (req, res) => 
{

  let responseCode = 200;
  let responseMessage = 'None';

  try 
  {
    const userRef = db.collection('user_collection').where('username', '==', 'user1');
    const snapshot = await userRef.get();
    if (snapshot.empty) 
    {
        responseMessage = {};
    }
    else
    {
    const userData = snapshot.docs[0].data();
        responseMessage = {
          fishcards: userData.fishcards,
        };
    }
  } catch (error) 
  {
    console.error('Error retrieving data:', error);
    responseCode = 500; // Ustaw kod odpowiedzi na 500 w przypadku błędu
    responseMessage = error;
  }
  return res.status(responseCode).json(responseMessage);
});

app.get('/', (req, res) => 
{
  res.send('Hello from App Enginefd!');
});

const PORT = parseInt(process.env.PORT) || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});

module.exports = app;