import React from 'react';
import StoredProductComponent from './StoredProduct/StoredProductComponent';
import OrderProductComponent from './OrderedProduct/OrderProductComponent';
import AddProductComponent from './Product/AddProductComponent';
import DeliveryProductComponent from './DeliveryProduct/DeliveryProductComponent';
import ProductSocketComponent from './Product/ProductSocketComponent';

class ProductManager extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      productList: [],
      orderProductList: [],
      storedProductList: [],
      deliveryProductList: [],
    };
  }

  componentDidMount() {
    this.fetchProductList();
    this.fetchStoredProductList();
    this.fetchDeliveryProductList();
  }

  fetchProductList = () => {
    fetch('http://localhost:8086/ZTI_project-1.0-SNAPSHOT/api/warehouse/getProductList', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'AuthToken': localStorage.getItem('authToken'),
      },
    })
      .then((response) => response.json())
      .then((data) => this.setState({ productList: data }))
      .catch((error) => console.log(error));
  }

  fetchStoredProductList = async () => {
    try {
      const response = await fetch(
        'http://localhost:8086/ZTI_project-1.0-SNAPSHOT/api/warehouse/storedProductList',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            AuthToken: localStorage.getItem('authToken'),
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        this.setState({ storedProductList: data });
      } else {
        console.error('Błąd pobierania produktów');
      }
    } catch (error) {
      console.error('Błąd serwera:', error);
    }
  };

  fetchDeliveryProductList = async () => {
    try {
      const response = await fetch('http://localhost:8086/ZTI_project-1.0-SNAPSHOT/api/delivery/DeliveryList', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'AuthToken': localStorage.getItem('authToken'),
        },
      });

      if (response.ok) 
      {
        const data = await response.json();
        this.setState({ deliveryProductList: data });
      } else {
        console.log('Błąd podczas pobierania zamówionych produktów');
      }
    } catch (error) {
      console.log('Błąd sieci:', error);
    }
  };

  fetchOrderProductList = async () => {
    try {
      const response = await fetch('http://localhost:8086/ZTI_project-1.0-SNAPSHOT/api/order/OrderedProductList', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'AuthToken': localStorage.getItem('authToken'),
        },
      });

      if (response.ok) {
        const data = await response.json();
        this.setState({ orderProductList: data });
      } else {
        console.log('Błąd podczas pobierania zamówionych produktów');
      }
    } catch (error) {
      console.log('Błąd sieci:', error);
    }
  };

  render() {
    const { storedProductList, orderProductList, productList, deliveryProductList } = this.state;
    return (
      <div>
        <StoredProductComponent
          productList={productList}
          storedProductList={storedProductList}
          fetchStoredProductList={this.fetchStoredProductList}
        />
        <br />
        <AddProductComponent fetchProductList={this.fetchProductList} />
        <br />
        <OrderProductComponent
          productList={productList}
          storedProductList={storedProductList}
          fetchStoredProductList={this.fetchStoredProductList}
          deliveryProductList={deliveryProductList}
          orderProductList={orderProductList}
          fetchOrderProductList={this.fetchOrderProductList}
          fetchDeliveryProductList={this.fetchDeliveryProductList}
        />
        <br />
        <DeliveryProductComponent
          deliveryProductList={this.state.deliveryProductList}
          fetchDeliveryProductList={this.fetchDeliveryProductList}
        />
        <br/>
        <ProductSocketComponent
          fetchProductList={this.fetchProductList}
          fetchOrderProductList={this.fetchOrderProductList}
          fetchStoredProductList={this.fetchStoredProductList}
          fetchDeliveryProductList={this.fetchDeliveryProductList}
        />
      </div>
      
    );
  }
}

export default ProductManager;