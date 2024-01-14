import React from 'react';
import DeliveryProductList from './DeliveryProductList';

class DeliveryProductComponent extends React.Component 
{
  componentDidMount() 
  {
    this.props.fetchDeliveryProductList();
  }

  render() {
    const { deliveryProductList } = this.props;
    return (
      <div>
          <h3>Lista towarów w trakcie dostarczania</h3>
        <DeliveryProductList 
        deliveryProductList={deliveryProductList} 
        fetchDeliveryProductList={this.props.fetchDeliveryProductList}/>
      </div>
    );
  }
}

export default DeliveryProductComponent;