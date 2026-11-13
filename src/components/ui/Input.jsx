import React from 'react';

function InputWrapper({ label, name, value, onChange, disabled, type, options, ...rest }) {
  return (
    <div className="w-full">
      <label htmlFor={name} className="label">
        {label}
      </label>
      {options ? (
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className="input disabled:bg-neutral-100 disabled:text-neutral-600"
          {...rest}
        >
          <option value="" disabled>
            Selecione uma opção
          </option>
          {options.map((option, index) => (
            <option key={option.value ?? index} value={option.value} disabled={option.disabled}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type || 'text'}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className="input disabled:bg-neutral-100 disabled:text-neutral-600"
          {...rest}
        />
      )}
    </div>
  );
}

function InputGroup({ inputs = [] }) {
  return (
    <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
      {inputs.map((input) => (
        <InputWrapper key={input.name} {...input} />
      ))}
    </div>
  );
}

export default InputGroup;
