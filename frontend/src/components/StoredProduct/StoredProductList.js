import React, { useState } from 'react';
import '../styles.css';

function StoredProductList({ storedProductList, fetchStoredProductList }) {
  const [editingProductId, setEditingProductId] = useState(null);
  const [editedData, setEditedData] = useState({});

  const handleEdit = (productId) => {
    const product = storedProductList.find((productElem) => productElem.product.id === productId);
    setEditingProductId(productId);
    setEditedData({ productId: product.product.id, quantity: product.quantity });
  };

  const handleSaveStorageProductUpdate = async (editedData) => {
    try {
      const response = await fetch('http://localhost:8086/ZTI_project-1.0-SNAPSHOT/api/warehouse/UpdateStoredProduct', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'AuthToken': localStorage.getItem('authToken'),
        },
        body: JSON.stringify(editedData),
      });

      if (response.ok) {
        setEditingProductId(null);
        setEditedData({});
        fetchStoredProductList();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteStorageProduct = async (productId) => {
    try {
      const response = await fetch(
        `http://localhost:8086/ZTI_project-1.0-SNAPSHOT/api/warehouse/DeleteStoredProduct/${productId}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            AuthToken: localStorage.getItem('authToken'),
          },
        }
      );

      if (response.ok) {
        fetchStoredProductList();
      } else {
        console.error('Błąd usuwania produktu');
      }
    } catch (error) {
      console.error('Błąd serwera:', error);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setEditedData((prevData) => ({ ...prevData, [name]: value }));
  };

  return (
    <table>
      <thead>
        <tr>
          <th className={'hidden-column'}>ID</th>
          <th>Nazwa</th>
          <th>Ilość</th>
          <th>Opis</th>
          <th>Akcje</th>
        </tr>
      </thead>
      <tbody>
        {storedProductList.sort((a, b) => a.product.id - b.product.id).map((product) => (
          <tr key={product.product.id}>
            <td className="hidden-column">{product.product.id}</td>
            <td>{product.product.name}</td>
            <td>
              {editingProductId === product.product.id ? (
                <input
                  type="text"
                  name="quantity"
                  value={editedData.quantity || product.quantity}
                  onChange={handleChange}
                />
              ) : (
                product.quantity
              )}
            </td>
            <td>{product.product.description}</td>
            <td>
              {editingProductId === product.product.id ? (
                <React.Fragment>
                  <button onClick={() => handleSaveStorageProductUpdate(editedData)}>Zapisz</button>
                  <button onClick={() => setEditingProductId(null)}>Anuluj</button>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <button onClick={() => handleEdit(product.product.id)}>Modyfikuj</button>
                  <button onClick={() => handleDeleteStorageProduct(product.product.id)}>Usuń</button>
                </React.Fragment>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default StoredProductList;