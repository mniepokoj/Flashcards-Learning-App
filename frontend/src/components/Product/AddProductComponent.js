import React from 'react';

class AddProductComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isAdding: false,
      newProduct: {
        description: '',
        name: '',
        productId: -1,
      },
    };
  }

  handleAddProduct = () => {
    this.setState({
      isAdding: true,
    });
  };

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState((prevState) => ({
      newProduct: {
        ...prevState.newProduct,
        [name]: value,
      },
    }));
  };

  handleSave = async () => {
    try {
      const response = await fetch('http://localhost:8086/ZTI_project-1.0-SNAPSHOT/api/warehouse/addProduct', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'AuthToken': localStorage.getItem('authToken'),
        },
        body: JSON.stringify(this.state.newProduct),
      });
  
      if (response.ok) 
      {
        this.setState({
          isAdding: false,
          newProduct: {
            description: '',
            name: '',
            productId: -1,
          },
        });
        this.props.fetchProductList();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }
    } catch (error) {
      console.error('Wystąpił błąd żądania:', error);
    }
  };

  render() {
    const { isAdding, newProduct } = this.state;

    if (isAdding) {
      return (
        <div>
          <h2>Dodaj nowy typ produktu</h2>
          <input type="text" name="name" value={newProduct.name} onChange={this.handleChange} placeholder="Nazwa" />
          <br />
          <input type="text" name="description" value={newProduct.description} onChange={this.handleChange} placeholder="Opis" />
          <br />
          <button onClick={this.handleSave}>Dodaj produkt</button>
        </div>
      );
    }

    return (
      <button onClick={this.handleAddProduct}>Dodaj nowy produkt</button>
    );
  }
}

export default AddProductComponent;