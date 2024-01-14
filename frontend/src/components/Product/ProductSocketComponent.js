import React from 'react';

class ProductSocketComponent extends React.Component {
  constructor(props) {
    super(props);
    this.socket = null;
  }

  handleMessages = (message) => 
  {
    switch (message)
    {
      case "ProductChange":
        this.props.fetchProductList();
        break;
      case "StoredProductChange":
        this.props.fetchStoredProductList();
        break;
      case "OrderProductChange":
        this.props.fetchOrderProductList();
        break;
      case "DeliveryProductChange":
        this.props.fetchDeliveryProductList();
        break;
      default:
        console.log("unexpected message");
        break;
    }
  };

  componentDidMount() 
  {
    const authToken = localStorage.getItem('authToken');
    this.socket = new WebSocket(`ws://localhost:8086/ZTI_project-1.0-SNAPSHOT/websocketendpoint?token=${authToken}`);
    this.socket.onopen = () => {
      console.log('WebSocket connected');
    };
    this.socket.onmessage = event => 
    {
      const message = event.data;
      this.handleMessages(message);
    };

    this.socket.onclose = event => 
    {
      console.log('WebSocket disconnected:', event.code, event.reason);
    };
  }

  componentWillUnmount() 
  {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.close();
    }
  }

  render() 
  {

    return (
      <div>
      </div>
    );
  }
}

export default ProductSocketComponent;