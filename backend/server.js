'use strict';
const serviceAccount = require('./serviceAccountKey.json');

const admin = require('firebase-admin');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Hello from App Enginefd!');
});

const PORT = parseInt(process.env.PORT) || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});

module.exports = app;