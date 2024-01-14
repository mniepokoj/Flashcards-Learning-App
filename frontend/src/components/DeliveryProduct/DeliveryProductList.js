import React from 'react';

class DeliveryProductList extends React.Component {
  handleAcceptDelivery = async (deliveryId) => {
    try {
      const response = await fetch(
        `http://localhost:8086/ZTI_project-1.0-SNAPSHOT/api/delivery/receiveDelivery/${deliveryId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            AuthToken: localStorage.getItem('authToken'),
          },
        }
      );
      if (response.ok) {
        this.props.fetchDeliveryProductList();
      } else {
        console.error('Błąd usuwania produktu');
      }
    } catch (error) {
      console.error('Błąd serwera:', error);
    }
  };

  handleCancelDelivery = async (deliveryId) => 
  {
    try {
      const response = await fetch(
        `http://localhost:8086/ZTI_project-1.0-SNAPSHOT/api/delivery/cancellDelivery/${deliveryId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            AuthToken: localStorage.getItem('authToken'),
          },
        }
      );
      if (response.ok) {
        this.props.fetchDeliveryProductList();
      } else {
        console.error('Błąd usuwania produktu');
      }
    } catch (error) {
      console.error('Błąd serwera:', error);
    }
  };

  handleDeleteDelivery = async (deliveryId) => 
  {
    try {
      const response = await fetch(
        `http://localhost:8086/ZTI_project-1.0-SNAPSHOT/api/delivery/confirmCancellDelivery/${deliveryId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            AuthToken: localStorage.getItem('authToken'),
          },
        }
      );
      if (response.ok) {
        this.props.fetchDeliveryProductList();
      } else {
        console.error('Błąd usuwania produktu');
      }
    } catch (error) {
      console.error('Błąd serwera:', error);
    }
  };

  renderDeliveryStatus(statusId) {
    switch (statusId) 
    {
      case 0:
        return 'Wysłane';
      case 1:
        return 'Otrzymane';
      case 2:
        return 'Anulowane';
      case 3:
        return 'Zakończone';
      default:
        return '';
    }
  }

  renderSendStatusButtons = (delivery) => {
    const currentWarehouseId = localStorage.getItem('warehouseId');
    if(!currentWarehouseId)
      return null;
    const warehouseId = parseInt(currentWarehouseId);
    const warehouseFromId = delivery.warehouseFrom.id;
    const warehouseToId = delivery.warehouseTo.id;
    const deliveryId = delivery.deliveryId

    if(warehouseToId === warehouseId)
    {
      return (
        <div>
          <button onClick={() => this.handleAcceptDelivery(deliveryId)}>Potwierdź odbiór</button>
        </div>
      );
    }
    
    if(warehouseFromId === warehouseId)
    {
      return (
        <div>
          <button onClick={() => this.handleCancelDelivery(delivery.deliveryId)}>Anuluj dostawę</button>
        </div>
      );
    }

    return null;
  };



  renderCancelStatusButtons = (delivery) => {
    const currentWarehouseId = localStorage.getItem('warehouseId');
    if(!currentWarehouseId)
      return null;
    const warehouseId = parseInt(currentWarehouseId);

    const warehouseToId = delivery.warehouseTo.id;
    const deliveryId = delivery.deliveryId

    if(warehouseToId === warehouseId)
    {
      return (
        <div>
          <button onClick={() => this.handleDeleteDelivery(deliveryId)}>Usuń</button>
        </div>
      );
    }
    return null;
  };

  renderActionButtons(delivery) 
  {
    switch (delivery.deliveryStatus.statusId) 
    {
      case 0:
        return this.renderSendStatusButtons(delivery);
      case 2:
        return this.renderCancelStatusButtons(delivery);
      default:
        return null;
    }
  }

  render() {
    const { deliveryProductList } = this.props;
    return (
      <div>
        <table>
          <thead>
            <tr>
              <th>Status dostawy</th>
              <th>Nazwa produktu</th>
              <th>Opis produktu</th>
              <th>Ilość</th>
              <th>Magazyn źródłowy</th>
              <th>Magazyn docelowy</th>
              <th>Akcje</th>
            </tr>
          </thead>
          <tbody>
            {deliveryProductList.map((delivery, index) => (
              <tr key={index}>
                <td>{this.renderDeliveryStatus(delivery.deliveryStatus.statusId)}</td>
                <td>{delivery.product.name}</td>
                <td>{delivery.product.description}</td>
                <td>{delivery.quantity}</td>
                <td>{delivery.warehouseFrom.name}</td>
                <td>{delivery.warehouseTo.name}</td>
                <td>
                  {this.renderActionButtons(delivery)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

export default DeliveryProductList;