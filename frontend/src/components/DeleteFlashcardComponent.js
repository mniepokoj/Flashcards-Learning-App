import React from 'react';
import config from '../config';

class DeleteFlashcardComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showMessage: false,
      successMessage: '',
      errorMessage: '',
      flashcards: props.flashcards || [],
    };
  }

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState((prevState) => {
      const { [name]: omittedProperty, ...newFlashcardWithoutProperty } = prevState.newFlashcard;
  
      return {
        newFlashcard: {
          ...newFlashcardWithoutProperty,
          [name]: value,
        },
      };
    });
  };

  handleDelete = async (flashcard_id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${config.backendUrl}/deleteFlashcard?flashcard_id=${flashcard_id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      });

      if (response.ok) 
      {
        const currentFlashcards = this.props.flashcards;
        const isExistingFlashcard = currentFlashcards.some(flashcard => flashcard.id === flashcard_id);
        if (isExistingFlashcard) 
        {
          const updatedFlashcards = currentFlashcards.filter(flashcard => flashcard.id !== flashcard_id);
          this.setState({
            newFlashcard: {
              item: '',
              translation: '',
            },
            showMessage: true,
            successMessage: 'Fiszka została usunięta pomyślnie.',
            errorMessage: '',
            flashcards: updatedFlashcards,
          });
      
          this.props.onFlashcardsUpdate(updatedFlashcards);
        } 
        else 
        {
          this.setState({
            showMessage: true,
            successMessage: '',
            errorMessage: 'Nie udało się usunąć fiszki',
          });
        }
      } 
      else {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }
    } catch (error) 
    {
      console.error('Wystąpił błąd żądania:', error);
      this.setState({
        showMessage: true,
        successMessage: '',
        errorMessage: 'Nie udało się usunąć słówka. ' + error.message,
      });
    }
  };

  render() {
    const { showMessage, successMessage, errorMessage, flashcards } = this.state;
    return (
      
      <div>
        <div>
          <h3>Lista Słówek</h3>
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Translation</th>
                <th>Usuń</th>
              </tr>
            </thead>
            <tbody>
              {flashcards.map((flashcard) => (
                <tr key={flashcard.id}>
                  <td>{flashcard.item}</td>
                  <td>{flashcard.translation}</td>
                  <td>
                    <button onClick={() => this.handleDelete(flashcard.id)}>Usuń</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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

export default DeleteFlashcardComponent;
