import React from 'react';

const Logo = ({ className = "h-10", variant = "default" }) => {
  // variant: "default" (for light backgrounds with dark container), "dark" (for dark backgrounds)
  const containerClass = variant === "dark" 
    ? "" 
    : "bg-slate-900 rounded-lg px-3 py-1";
  
  return (
    <div className={`flex items-center ${containerClass}`}>
      <img 
        src="/neuron-logo.png" 
        alt="Neuron by ELV" 
        className={`${className} object-contain`}
      />
    </div>
  );
};

export default Logo;
