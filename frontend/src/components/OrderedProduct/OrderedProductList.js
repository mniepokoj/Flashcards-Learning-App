import React from 'react';

class OrderedProductList extends React.Component {
  handleDeleteOrder = async (orderedProductId) => {
    try {
      const response = await fetch(
        `http://localhost:8086/ZTI_project-1.0-SNAPSHOT/api/order/deleteOrderedProduct/${orderedProductId}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            AuthToken: localStorage.getItem('authToken'),
          },
        }
      );
      if (response.ok) {
        this.props.fetchOrderProductList();
      } else {
        console.error('Błąd usuwania produktu');
      }
    } catch (error) {
      console.error('Błąd serwera:', error);
    }

    console.log(`Usunięcie zamówienia o ID: ${orderedProductId}`);
  };

  handleAcceptOrder = async (order) => {
    console.log(this.props)
    try {
      const response = await fetch(
        `http://localhost:8086/ZTI_project-1.0-SNAPSHOT/api/delivery/addDeliveryProduct/${order.orderedProductId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            AuthToken: localStorage.getItem('authToken'),
          },
        }
      );
      if (response.ok) 
      {
        this.props.fetchDeliveryProductList();
        this.props.fetchOrderProductList();
      } else {
        console.error('Błąd usuwania produktu');
      }
    } catch (error) {
      console.error('Błąd serwera:', error);
    }
  };

  render() {
    const { orderProductList, storedProductList } = this.props;
    const warehouseId = parseInt(localStorage.getItem('warehouseId'));
  
    const sortedOrderProductList = orderProductList.sort((a, b) => {
      if (a.warehouseId !== b.warehouseId) {
        return a.warehouseId - b.warehouseId;
      } else {
        return a.orderedProductId - b.orderedProductId;
      }
    });
  
    return (
      <table>
        <thead>
          <tr>
            <th>Nazwa</th>
            <th>Opis</th>
            <th>Ilość</th>
            <th>Magazyn zgłaszający</th>
            <th>Akcje</th>
          </tr>
        </thead>
        <tbody>
          {sortedOrderProductList.map((order) => {
            const storedProduct = storedProductList.find(
              (storedProduct) => storedProduct.product.id === order.product.id
            );
            const isOwnWarehouse = parseInt(order.warehouseId) === warehouseId;
            const isAcceptable =
              storedProduct && storedProduct.quantity >= order.productQuantity;
  
            return (
              <tr key={order.orderedProductId}>
                <td>{order.product.name}</td>
                <td>{order.product.description}</td>
                <td>{order.productQuantity}</td>
                <td>{order.warehouseName}</td>
                <td>
                  {isOwnWarehouse && (
                    <div>
                      <button
                        onClick={() =>
                          this.handleDeleteOrder(order.orderedProductId)
                        }
                      >
                        Anuluj
                      </button>
                    </div>
                  )}
  
                  {!isOwnWarehouse && isAcceptable && (
                    <div>
                      <button onClick={() => this.handleAcceptOrder(order)}>
                        Zaakceptuj zamówienie
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  }
}

export default OrderedProductList;