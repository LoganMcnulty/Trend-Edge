import React from "react";

const Input = ({ name, label, error, ...rest }) => {
  const handleClick = () => {
    console.log("Click me!")
  }

  return (
    <div className="form-group">
      <label htmlFor={name}>{label}</label>
      <input {...rest} 
      name={name} 
      id={name} 
      className="form-control" 
      onClick={() => handleClick}
      />
      {error && <div className="alert alert-danger">{error}</div>}
    </div>
  );
};

export default Input;
