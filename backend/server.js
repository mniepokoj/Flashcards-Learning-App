'use strict';
const serviceAccount = require('./serviceAccountKey.json');
const admin = require('firebase-admin');
const jwt = require('jsonwebtoken');
const cors = require('cors');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
const secretKey = 'tajny_klucz';
const autoExpirationTime = "24h";

const express = require('express');
const app = express();
app.use(express.json());
app.use(cors());

const PORT = parseInt(process.env.PORT) || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});


function generateToken(userId, username) 
{
  const token = jwt.sign({ userId: userId, username: username }, secretKey, { expiresIn: autoExpirationTime });
  return token;
}

function verifyToken(token) 
{
  try 
  {
    const decodedToken = jwt.verify(token, secretKey);
    return decodedToken;
  } 
  catch (error) 
  {
    return null;
  }
}

app.post('/api/addUser', async (req, res) => 
{
  const username = req.body.username;
  const password = req.body.password;
  if(!username || !password)
  {
    return res.status(400).json({error: 'Username and password are required'});
  }

  try 
  {
    const userRef = db.collection('User_collection').where('username', '==', username);
    const snapshot = await userRef.get();
    if(!snapshot.empty)
      return res.status(409).json({error: 'Username already exists'});

    const newUserIdRef = db.collection('User_collection').doc('new_user_id');
    const newUserIdSnapshot = await newUserIdRef.get();
    const newUserId = newUserIdSnapshot.data().id;
    newUserIdRef.set({id: newUserId + 1});

    const newUserRef = db.collection('User_collection').add({username: username, password: password, user_id: newUserId});
    const newUserSnapshot = await newUserRef;
    const token = generateToken(newUserId, username);
    return res.status(200).json({user_id: newUserIdSnapshot.data().id, token: token});
  } 
  catch (error) 
  {
    console.error('Error retrieving data:', error);
    return res.status(400).json({error: error});
  }
});

app.post('/api/isLoggedIn', async (req, res) => 
{
  const token = req.header('Authorization');

  if(!token)
  {
    return res.status(400).json({error: 'Token is required'});
  }

  try 
  {
    const decodedToken = verifyToken(token);
    if (!decodedToken)
      return res.status(401).json({error: 'Invalid token'});
    else
      return res.status(200).json({user_id: decodedToken.userId, username: decodedToken.username});
  } 
  catch (error) 
  {
    console.error('Error retrieving data:', error);
    return res.status(500).json(error);
  }
});

app.post('/api/logIn', async (req, res) => 
{
  const username = req.body.username;
  const password = req.body.password;
  if(!username || !password)
  {
    return res.status(400).json({error: 'Username and password are required'});
  }

  try 
  {
    const userRef = db.collection('User_collection').where('username', '==', username).where('password','==', password);
    const snapshot = await userRef.get();
    if(snapshot.empty)
      return res.status(401).json({error: 'Invalid username or password'});
    const userDoc = snapshot.docs[0];
    const token = generateToken(userDoc.data().user_id, userDoc.data().username);
    return res.status(200).json({user_id: userDoc.data().user_id, username: userDoc.data().username, token: token});
  } 
  catch (error) 
  {
    console.error('Error retrieving data:', error);
    return res.status(500).json(error);
  }
});

app.get('/api/getFlashcards', async (req, res) => 
{
  const token = req.header('Authorization');
  if(!token)
  {
    return res.status(400).json({error: 'Token is required'});
  }

  try 
  {
    const decodedToken = verifyToken(token);
    if (!decodedToken)
      return res.status(401).json({error: 'Invalid token'});
    const flashCardsRef = db.collection('Flashcards_collection').where('user_id', '==', decodedToken.userId);
    const snapshot = await flashCardsRef.get();
    const flashcardsData = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        item: data.item,
        translation: data.translation,
        id: data.flashcard_id
      };
    });
    return res.status(200).json(flashcardsData);
  } 
  catch (error) 
  {
    console.error('Error retrieving data:', error);
    return res.status(500).json(error);
  }
});

app.put('/api/addFlashcard', async (req, res) => 
{
  const token = req.header('Authorization');
  const item = req.body.item;
  const translation = req.body.translation;
  if(!token || !item || !translation || !token)
  {
    return res.status(400).json({error: 'All fields required'});
  }

  try 
  {
    const decodedToken = verifyToken(token);
    if (!decodedToken)
      return res.status(401).json({error: 'Invalid token'});
    const flashCardsRef = db.collection('Flashcards_collection');

    const newFlashcardIdRef = db.collection('Flashcards_collection').doc('new_flashcard_id');
    const newFlashcardIdSnapshot = await newFlashcardIdRef.get();
    const newFlashcardId = newFlashcardIdSnapshot.data().id;
    newFlashcardIdRef.set({id: newFlashcardId + 1});
    const newFlashcardRef = flashCardsRef.add({item: item, translation: translation, user_id: decodedToken.userId, flashcard_id: newFlashcardId });
    const newFlashcardSnapshot = await newFlashcardRef;
    return res.status(200).json({flashcard_id: newFlashcardId});
  } 
  catch (error) 
  {
    console.error('Error retrieving data:', error);
    return res.status(500).json(error);
  }
});

app.delete('/api/deleteFlashcard', async (req, res) => 
{
  const token = req.header('Authorization');
  const flashcard_id = parseInt(req.query.flashcard_id);

  if (!token || !flashcard_id || isNaN(flashcard_id)) {
    return res.status(400).json({ error: 'All fields required' });
  }

  try 
  {
    const decodedToken = verifyToken(token);
    if (!decodedToken)
      return res.status(401).json({error: 'Invalid token'});

    const flashCardRef = db.collection('Flashcards_collection').where('flashcard_id', '==', flashcard_id);
    const flashcardSnapshot = await flashCardRef.get();
    if (flashcardSnapshot.empty) {
      return res.status(404).json({ error: 'Flashcard not found' });
    }
  
    const deletionPromises = flashcardSnapshot.docs.map(async (doc) => {
      await doc.ref.delete();
    });
  
    await Promise.all(deletionPromises);
    return res.status(200).json({});
  } 
  catch (error) 
  {
    console.error('Error retrieving data:', error);
    return res.status(500).json(error);
  }
});

app.get('/api/', (req, res) => 
{
  res.send('Hello from App Engine backend!');
});

module.exports = app;