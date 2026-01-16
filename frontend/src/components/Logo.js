import React from 'react';

const Logo = ({ className = "w-10 h-10" }) => {
  return (
    <img 
      src="/neuron-logo.png" 
      alt="Neuron" 
      className={className}
    />
  );
};

export default Logo;
