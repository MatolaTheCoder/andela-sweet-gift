import React from 'react'

function InputGroup({ label1, label2, label3 }) {
    return (
      <div className="flex flex-col space-y-6">
        <InputWrapper label={label1} />
        {label2 && <InputWrapper label={label2} />}
        {label3 && <InputWrapper label={label3} />}
      </div>
    );
  }
  
  function InputWrapper({ label, name, value, onChange, disabled, type }) {
    return (
      <div className="w-full mb-3">
        <label htmlFor={name} className="block text-md text-gray-800">{label}:</label>
        <input
          type={type || "text"}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className="w-64 bg-gray-100 text-gray-600 border border-gray-200 rounded shadow-md px-3 py-1.5 focus:outline-none focus:border-blue-200"
        />
      </div>
    );
  }

  export default InputGroup;
