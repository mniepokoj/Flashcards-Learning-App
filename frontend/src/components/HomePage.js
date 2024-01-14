import React from 'react';
import ProductManager from './ProductManager';
import UserInfo from './UserInfo';

function HomePage() {
  return (
    <div>
      <h2>Strona główna</h2>
      <UserInfo />
      <ProductManager/>
    </div>
  );
}

export default HomePage;