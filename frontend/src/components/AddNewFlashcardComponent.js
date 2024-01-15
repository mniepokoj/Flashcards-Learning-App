import React from 'react';
import config from '../config';

class AddNewFlashcardComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      newFlashcard: {
        item: '',
        translation: '',
      },
      showMessage: false,
      successMessage: '',
      errorMessage: '',
      flashcards: props.flashcards || [],
    };
  }

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState((prevState) => ({
      newFlashcard: {
        ...prevState.newFlashcard,
        [name]: value,
      },
    }));
  };

  handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      const { item, translation } = this.state.newFlashcard;

      const isValidItem = /^[a-zA-Z\s]+$/.test(item) && item.trim().length > 0;
      const isValidTranslation =
        /^[a-zA-Z\s]+$/.test(translation) && translation.trim().length > 0;

      if (!isValidItem || !isValidTranslation) {
        this.setState({
          showMessage: true,
          successMessage: '',
          errorMessage: 'Nieprawidłowy format danych.',
        });
        return;
      }

      const response = await fetch(config.backendUrl + '/addFlashcard', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({
          item,
          translation,
        }),
      });

      if (response.ok) {
        const currentFlashcards = this.props.flashcards;
        const { flashcard_id } = await response.json();
        const updatedFlashcards = [...currentFlashcards, { item, translation, flashcard_id }];

        this.setState({
          newFlashcard: {
            item: '',
            translation: '',
          },
          showMessage: true,
          successMessage: 'Słówko zostało dodane pomyślnie.',
          errorMessage: '',
          flashcards: updatedFlashcards,
        });

        this.props.onFlashcardsUpdate(updatedFlashcards);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }
    } catch (error) {
      console.error('Wystąpił błąd żądania:', error);
      this.setState({
        showMessage: true,
        successMessage: '',
        errorMessage: 'Nie udało się dodać słówka. ' + error.message,
      });
    }
  };

  render() {
    const { newFlashcard, showMessage, successMessage, errorMessage } = this.state;

    return (
      <div>
        <h2>Dodaj nowe tłumaczenie</h2>
        <input
          type="text"
          name="item"
          value={newFlashcard.item}
          onChange={this.handleChange}
          placeholder="Treść"
        />
        <br />
        <input
          type="text"
          name="translation"
          value={newFlashcard.translation}
          onChange={this.handleChange}
          placeholder="Tłumaczenie"
        />
        <br />
        <button onClick={this.handleSave}>Dodaj nową kartę</button>

        {showMessage && (
          <div>
            {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
          </div>
        )}
      </div>
    );
  }
}

export default AddNewFlashcardComponent;
