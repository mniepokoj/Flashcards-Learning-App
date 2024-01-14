import React from 'react';

class AddOrderedProductComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedProduct: '',
      quantity: '',
      isFormOpen: false,
    };
  }

  handleProductChange = (event) => {
    this.setState({ selectedProduct: event.target.value });
  };

  handleQuantityChange = (event) => {
    this.setState({ quantity: event.target.value });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    const { selectedProduct: selectedProductOrder, quantity } = this.state;
    this.handleSaveProductOrder({ product_id: selectedProductOrder, quantity });
    this.setState({ selectedProduct: '', quantity: '' });
  };

  handleCancel = () => {
    this.setState({ isFormOpen: false, selectedProduct: '', quantity: '' });
  };

  handleOpenForm = () => {
    this.setState({ isFormOpen: true });
  };

  handleSaveProductOrder = async (newProductData) => {
    try {
      const response = await fetch('http://localhost:8086/ZTI_project-1.0-SNAPSHOT/api/order/addOrderedProduct', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'AuthToken': localStorage.getItem('authToken'),
        },
        body: JSON.stringify(newProductData),
      });

      if (response.ok) 
      {
        this.props.fetchOrderedProductList();
        this.setState({ isFormOpen: false });
      } else 
      {
        console.error('Błąd dodawania produktu');
      }
    } catch (error) {
      console.error('Błąd serwera:', error);
    }
  };

  render() {
    const { selectedProduct, quantity, isFormOpen } = this.state;
    return (
      <div>
        {!isFormOpen && (
          <button onClick={this.handleOpenForm}>Dodaj zamówienie</button>
        )}

        {isFormOpen && (
          <div>
            <h3>Formularz dodawania produktu</h3>
            <form onSubmit={this.handleSubmit}>
              <label>
                Produkt:<br />
                <select value={selectedProduct} onChange={this.handleProductChange}>
                  <option value="">Wybierz produkt</option>
                  {this.props.productList.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name + ' "' + product.description + '"'}
                    </option>
                  ))}
                </select>
              </label><br />
              <label>
                Ilość:<br />
                <input type="text" value={quantity} onChange={this.handleQuantityChange} />
              </label><br />
              <button type="submit">Dodaj</button>
              <button type="button" onClick={this.handleCancel}>Anuluj</button>
            </form>
          </div>
        )}
      </div>
    );
  }
}

export default AddOrderedProductComponent;