import { Icon } from '@iconify/react';
import { ChangeEvent, FC, ReactNode, useRef } from 'react';

type Props = {
  label: ReactNode | string;
  name?: string;
  disabled?: boolean;
  checked: boolean;
  onChange: (val: ChangeEvent<HTMLInputElement>) => void;
};

export const UICheckbox: FC<Props> = ({ label, disabled = false, checked, name, onChange }) => {
  const baseStyle = 'h-5 w-5 border rounded';
  const checkedStyle = 'bg-gray-600 border-transparent';
  const disabledStyle = 'bg-gray-200 border-gray-200';
  const uncheckedStyle = 'border-white border-opacity-40';

  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div
      className={`flex items-center cursor-pointer ${disabled && 'opacity-50'}`}
      onClick={() => inputRef.current?.click()}
    >
      <div
        className={`relative ${baseStyle} ${
          disabled ? disabledStyle : checked ? checkedStyle : uncheckedStyle
        }`}
      >
        <input
          ref={inputRef}
          className="absolute opacity-0 w-0 h-0"
          type="checkbox"
          name={name}
          onChange={onChange}
        />
        {checked && (
          <Icon
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white"
            icon="fa6-solid:check"
          />
        )}
      </div>
      <span className={`ml-2 text-sm select-none ${disabled && 'text-gray-500'}`}>{label}</span>
    </div>
  );
};
