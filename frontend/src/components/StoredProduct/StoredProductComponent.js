import React from 'react';
import StoredProductList from './StoredProductList';
import AddStoredProductComponent from './AddStoredProductComponent';

class StoredProductComponent extends React.Component {
  componentDidMount() {
    this.props.fetchStoredProductList();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.productList !== this.props.productList) {
      this.setState({ productList: this.props.productList });
    }
  }

  handleAddProduct = () => {
    this.setState({ isAddingProduct: true });
  };

  handleCancelAddProduct = () => {
    this.setState({ isAddingProduct: false });
  };

  render() {
    const { storedProductList } = this.props;
    
    return (
      <div>
        <h3>Towary przechowywane w magazynie</h3>
        <StoredProductList
          storedProductList={storedProductList}
          fetchStoredProductList={this.props.fetchStoredProductList}
          onDelete={this.handleDelete}
        />
        <AddStoredProductComponent
          productList={this.props.productList}
          fetchStoredProductList={this.props.fetchStoredProductList}
        />
      </div>
    );
  }
}

export default StoredProductComponent;