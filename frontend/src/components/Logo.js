import React from 'react';

const Logo = ({ className = "w-10 h-10", showText = true, textSize = "text-2xl" }) => {
  return (
    <div className="flex items-center space-x-3">
      <img 
        src="/neuron-logo.png" 
        alt="Neuron Logo" 
        className={className}
      />
      {showText && (
        <div>
          <h1 className={`${textSize} font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent`}>
            Neuron
          </h1>
        </div>
      )}
    </div>
  );
};

export default Logo;
