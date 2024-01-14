import React from 'react';
import OrderListComponent from './OrderedProductList';
import AddOrderedProductComponent from './AddOrderedProductComponent';

class OrderProductComponent extends React.Component 
{
  componentDidMount() {
    this.props.fetchOrderProductList();
  }

  render() {
    const { orderProductList } = this.props;
    const { storedProductList, productList, fetchStoredProductList } = this.props;
    return (
      <div>
          <h3>Lista zamówień</h3>
          <OrderListComponent 
          orderProductList={orderProductList} 
          fetchOrderProductList={this.props.fetchOrderProductList}
          storedProductList={storedProductList}
          fetchStoredProductList={fetchStoredProductList}
          fetchDeliveryProductList={this.props.fetchDeliveryProductList}
          />
          <AddOrderedProductComponent productList={productList} fetchOrderedProductList={this.props.fetchOrderProductList} />
      </div>
    );
  }
}

export default OrderProductComponent;