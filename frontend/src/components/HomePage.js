import React, { useState, useEffect } from 'react';
import UserInfo from './UserInfo';
import AddNewFlashcardComponent from './AddNewFlashcardComponent';
import DeleteFlashcardComponent from './DeleteFlashcardComponent';
import FlashcardLearningComponent from './FlashcardLearningComponent';
import config from '../config';

function HomePage() {
  const [selectedButton, setSelectedButton] = useState(null);
  const [flashcards, setFlashcards] = useState([]);

  useEffect(() => {
    const fetchFlashcards = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(config.backendUrl + '/getFlashcards', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token
          },
        });

        if (response.ok) {
          const flashcardsData = await response.json();
          setFlashcards(flashcardsData);
        } else {
          console.error('Failed to fetch flashcards');
        }
      } catch (error) {
        console.error('Error fetching flashcards:', error);
      }
    };

    fetchFlashcards();
  }, []); // Pusty [] sprawia, że useEffect zostanie wykonany tylko raz po zamontowaniu komponentu

  const handleButtonClick = (buttonId) => {
    setSelectedButton(buttonId);
  };

  const onFlashcardsUpdate = (updatedFlashcards) => {
    const sortedFlashcards = updatedFlashcards.slice().sort((a, b) => {
      return a.id - b.id;
    });
  
    setFlashcards(sortedFlashcards);
  };

  return (
    <div>
      <h2>Strona główna</h2>
      <UserInfo />
      <button onClick={() => handleButtonClick('AddFlashcardComponent')}>Dodaj nowe słowo</button>
      <button onClick={() => handleButtonClick('DeleteFlashcardComponent')}>Usuń słowo</button>
      <button onClick={() => handleButtonClick('FlashcardLearningComponent')}>Zacznij naukę</button>
      
      {selectedButton === 'AddFlashcardComponent' && (
      <AddNewFlashcardComponent flashcards={flashcards} onFlashcardsUpdate={onFlashcardsUpdate} /> )}

      {selectedButton === 'DeleteFlashcardComponent' && (
      <DeleteFlashcardComponent flashcards={flashcards} onFlashcardsUpdate={onFlashcardsUpdate} /> )}

      {selectedButton === 'FlashcardLearningComponent' && (
      <FlashcardLearningComponent flashcards={flashcards} /> )}
    </div>
  );
}

export default HomePage;