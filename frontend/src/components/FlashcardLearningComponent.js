import React from 'react';

class FlashcardLearningComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentFlashcardIndex: 0,
      userTranslation: '',
      showMessage: false,
      successMessage: '',
      errorMessage: '',
      showCorrectTranslation: false,
      buttonsVisible: true,
      flashcards: props.flashcards || [],
      correctTranslations: Array(props.flashcards.length).fill(false),
      correctCount: 0,
    };
  }

  handleUserTranslationChange = (event) => {
    this.setState({
      userTranslation: event.target.value,
      showMessage: false,
      successMessage: '',
      errorMessage: '',
      showCorrectTranslation: false,
    });
  };

  handleCheckTranslation = () => {
    const { currentFlashcardIndex, userTranslation, flashcards, correctTranslations, correctCount } = this.state;
    const currentFlashcard = flashcards[currentFlashcardIndex];
  
    const isCorrect = this.isTranslationCorrect(userTranslation, currentFlashcard.translation);
  
    const updatedCorrectTranslations = [...correctTranslations];
    updatedCorrectTranslations[currentFlashcardIndex] = isCorrect;
  
    this.setState({
      showMessage: true,
      successMessage: isCorrect ? 'Poprawne tłumaczenie!' : 'Nieprawidłowe tłumaczenie.',
      errorMessage: '',
      showCorrectTranslation: false,
      buttonsVisible: !isCorrect, // Ukryj przyciski, jeśli tłumaczenie jest poprawne
      correctTranslations: updatedCorrectTranslations,
      correctCount: isCorrect ? correctCount + 1 : correctCount,
    });
  };

  handleShowTranslation = () => {
    this.setState({
      showCorrectTranslation: true,
      showMessage: false,
      successMessage: '',
      errorMessage: '',
      buttonsVisible: false,
    });
  };

  isTranslationCorrect = (userTranslation, correctTranslation) => {
    return userTranslation.toLowerCase() === correctTranslation.toLowerCase();
  };

  handleNext = () => {
    const { currentFlashcardIndex, flashcards, correctTranslations } = this.state;

    if (currentFlashcardIndex < flashcards.length ) {
      this.setState((prevState) => ({
        currentFlashcardIndex: prevState.currentFlashcardIndex + 1,
        userTranslation: '',
        showMessage: false,
        successMessage: '',
        errorMessage: '',
        showCorrectTranslation: false,
        buttonsVisible: true,
      }));
    } else {
        const correctCount = correctTranslations.filter((isCorrect) => isCorrect).length;
      this.setState({
        showMessage: true,
        successMessage: 'Osiągnięto koniec fiszek.\nPoprawne odpowiedzi: ' + correctCount +  '/' + this.state.flashcards.length,
        errorMessage: '',
        showCorrectTranslation: false,
        buttonsVisible: true,
      });
    }
  };

  handleRetryIncorrect = () => {
    const { flashcards, correctTranslations } = this.state;
    const incorrectIndices = correctTranslations.reduce(
      (acc, isCorrect, index) => (isCorrect ? acc : [...acc, index]),
      []
    );
  
    if (incorrectIndices.length > 0) {
      const incorrectFlashcards = incorrectIndices.map(index => flashcards[index]);
    console.log(incorrectFlashcards);
      this.setState({
        currentFlashcardIndex: 0,
        userTranslation: '',
        showMessage: false,
        successMessage: '',
        errorMessage: '',
        showCorrectTranslation: false,
        buttonsVisible: true,
        flashcards: incorrectFlashcards,
        correctTranslations: Array(incorrectFlashcards.length).fill(false),
        correctCount: 0,
      });
    } else {
      this.setState({
        showMessage: true,
        successMessage: 'Brak błędnie przetłumaczonych fiszek.',
        errorMessage: '',
      });
    }
  };

  render() {
    const { currentFlashcardIndex, userTranslation, showMessage, successMessage, errorMessage, showCorrectTranslation, flashcards, buttonsVisible, correctCount } = this.state;
    const allFlashcardFinished = currentFlashcardIndex === flashcards.length
    return (
      <div>
        <h2>Flashcard Learning</h2>
        {flashcards.length > 0 && currentFlashcardIndex < flashcards.length && (
          <div>
            <h3>Fiszka {currentFlashcardIndex + 1}</h3>
            <p>Item: {flashcards[currentFlashcardIndex].item}</p>
            <label>
              Tłumaczenie:{' '}
              {showCorrectTranslation ? (
                <span>{flashcards[currentFlashcardIndex].translation}</span>
              ) : (
                <input type="text" value={userTranslation} onChange={this.handleUserTranslationChange} />
              )}
            </label>
            {buttonsVisible && !allFlashcardFinished && (
              <div>
                <button onClick={this.handleCheckTranslation}>Sprawdź tłumaczenie</button>
                <button onClick={this.handleShowTranslation}>Pokaż tłumaczenie</button>
              </div>
            )}
            {!allFlashcardFinished &&
            <button onClick={this.handleNext}>Następna fiszka</button>
            }
          </div>
        )}
        {showMessage && (
          <div>
            {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
          </div>
        )}
        {allFlashcardFinished && (
          <div>
            <p>
              Poprawnie przetłumaczono {correctCount} z {flashcards.length} fiszek.
            </p>
            <button onClick={this.handleRetryIncorrect}>Powtórz błędne</button>
          </div>
        )}
      </div>
    );
  }
}

export default FlashcardLearningComponent;
