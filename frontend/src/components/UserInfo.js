import React from 'react';

class UserInfo extends React.Component {
  render() {
    const userName = localStorage.getItem('username');
    return (
      <div>
        <h4>Nazwa użytkownika: {userName}</h4>
      </div>
    );
  }
}

export default UserInfo;