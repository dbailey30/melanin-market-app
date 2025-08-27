import React from 'react';

const Button = ({ 
  children, 
  onClick, 
  className = '', 
  variant = 'default',
  size = 'default',
  disabled = false,
  type = 'button',
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
  
  const variants = {
    default: 'bg-orange-600 text-white hover:bg-orange-700',
    secondary: 'bg-orange-100 text-orange-900 hover:bg-orange-200',
    outline: 'border border-orange-600 text-orange-600 hover:bg-orange-50',
    ghost: 'text-orange-600 hover:bg-orange-50',
  };
  
  const sizes = {
    default: 'h-10 py-2 px-4',
    sm: 'h-9 px-3 rounded-md',
    lg: 'h-11 px-8 rounded-md',
  };
  
  const buttonClasses = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;
  
  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export { Button };
export default Button;
