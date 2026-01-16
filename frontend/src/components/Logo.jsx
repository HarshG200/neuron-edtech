import React from 'react';

const Logo = ({ className = "h-10", showText = false }) => {
  return (
    <div className="flex items-center">
      <img 
        src="/neuron-logo.png" 
        alt="Neuron" 
        className={`${className} object-contain`}
      />
    </div>
  );
};

export default Logo;
