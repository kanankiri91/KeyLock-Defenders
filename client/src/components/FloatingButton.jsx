import React from 'react';
import GarudaImage from "../assets/header.png";

function FloatingButton() {
  const handleClick = () => {
    window.location.href = '/alertme';
  };

  return (
    <div className='button-icon animate__animated animate__jackInTheBox animate__delay-1s'
      style={{
        position: 'fixed',
        bottom: '40px',
        right: '40px',
        zIndex: '1000',
      }}
    >
      <button
        onClick={handleClick}
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: 'transparent',
          borderRadius: '100%',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <img
          src={GarudaImage}
          alt="Floating Icon"
          style={{ width: '90px', height: 'auto' }}
        />
      </button>
    </div>
  );
}

export default FloatingButton;