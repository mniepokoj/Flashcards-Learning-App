// Footer.js
import React from 'react';

const Footer = () => {
  return (
    <footer style={footerStyle}>
      <div style={lineStyle}></div>
      <p style={authorStyle}>Mateusz Niepokój</p>
    </footer>
  );
};

const footerStyle = {
  padding: '10px',
  textAlign: 'right',
  position: 'fixed',
  bottom: 0,
  left: -40,
  
  width: '100%',
};

const lineStyle = {
  borderTop: '2px solid black',
  margin: '5px 0',
};

const authorStyle = {
  fontSize: '16px',
  margin: '5px 0',
};

export default Footer;