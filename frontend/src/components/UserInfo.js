import React from 'react';

class UserInfo extends React.Component {
  render() {
    const warehouseName = localStorage.getItem('warehouseName');
    const authToken = localStorage.getItem('authToken');
    const userName = authToken ? authToken.split('_')[0] : '';
    return (
      <div>
        <h4>Nazwa magazynu:    {warehouseName}</h4>
        <h4>Nazwa użytkownika: {userName}</h4>
      </div>
    );
  }
}

export default UserInfo;