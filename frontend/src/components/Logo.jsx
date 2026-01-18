import React from 'react';

const Logo = ({ className = "h-10" }) => {
  return (
    <div className="flex items-center">
      <img 
        src="/neuron-logo.png" 
        alt="Neuron by ELV" 
        className={`${className} object-contain`}
      />
    </div>
  );
};

export default Logo;
