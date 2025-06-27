import React from 'react';

const Button = ({ children, onClick, type = 'button', variant = 'primary', ...props }) => {
  let style = {
    padding: '12px 24px',
    borderRadius: '12px',
    fontWeight: 600,
    fontFamily: 'Inter, Playfair Display, serif',
    fontSize: 18,
    cursor: 'pointer',
    border: 'none',
    transition: 'background 0.2s, box-shadow 0.2s',
    boxShadow: '0 2px 12px #0008',
    margin: 0
  };
  switch (variant) {
    case 'primary':
      style = { ...style, background: '#fff', color: '#000' };
      break;
    case 'secondary':
      style = { ...style, background: '#232323', color: '#fff', border: '1.5px solid #333' };
      break;
    case 'danger':
      style = { ...style, background: '#f87171', color: '#fff', border: '1.5px solid #c53030' };
      break;
    case 'calligraphic':
      style = { ...style, background: 'transparent', color: '#fff', fontFamily: 'Playfair Display, serif', fontSize: 24, boxShadow: 'none' };
      break;
    default:
      style = { ...style, background: '#232323', color: '#fff' };
  }
  return (
    <button type={type} onClick={onClick} style={style} {...props}>
      {children}
    </button>
  );
};

export default Button; 