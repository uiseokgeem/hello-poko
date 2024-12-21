import React from 'react';
import './Logo.css';

const Logo = () => (
  <img 
    src={`${process.env.PUBLIC_URL}/images/poko_logo.png`}
    alt="Logo" 
    className="logo" 
  />
);

export default Logo;