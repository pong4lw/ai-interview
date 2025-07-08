import React from 'react';

export const Button = ({ onClick, children, disabled = false }: any) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-400"
  >
    {children}
  </button>
);
