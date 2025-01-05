import React from 'react'

// function InputGroup({ label1, label2, label3 }) {
//   return (
//     <div className="flex flex-col space-y-6">
//       <InputWrapper label={label1} />
//       {label2 && <InputWrapper label={label2} />}
//       {label3 && <InputWrapper label={label3} />}
//     </div>
//   );
// }

function InputWrapper({ label, name, value, onChange, disabled, type, options }) {
  return (
    <div className="w-full mb-3">
      <label htmlFor={name} className="block text-md text-gray-800">
        {label}:
      </label>
      {options ? (
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className="w-64 bg-gray-100 text-gray-600 border border-gray-200 rounded shadow-md px-3 py-1.5 focus:outline-none focus:border-blue-200"
        >
          <option value="" disabled>
            Selecione uma opção
          </option>
          {options.map((option, index) => (
            <option key={index} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type || "text"}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className="w-64 bg-gray-100 text-gray-600 border border-gray-200 rounded shadow-md px-3 py-1.5 focus:outline-none focus:border-blue-200"
        />
      )}
    </div>
  );
}

InputGroup.defaultProps = {
  inputs: [],
};

function InputGroup({ inputs }) {
  return (
    <div className="flex flex-col space-y-6">
      {inputs.map((input, index) => (
        <InputWrapper key={index} {...input} />
      ))}
    </div>
  );
}
export default InputGroup;
