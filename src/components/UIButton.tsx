import { HTMLProps, ReactNode } from 'react';
import { CircularProgress } from 'src/components/CircularProgress';
import { FCC } from 'src/types/FCC';

type ButtonType = 'solid' | 'opacity' | 'stroke';

type ButtonProps = {
  type?: ButtonType;
  disabled?: boolean;
  color?: 'default' | 'orange' | 'blue' | 'blur-white' | 'gray' | 'danger';
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  processing?: boolean;
};

export type UIButtonProps = HTMLProps<HTMLDivElement> & ButtonProps;

export const UIButton: FCC<UIButtonProps> = ({
  type = 'solid',
  disabled,
  children,
  className,
  color = 'default',
  startIcon,
  endIcon,
  processing = false,
  onClick,
  ...others
}) => {
  const buttonBg =
    color === 'blur-white'
      ? 'bg-white bg-opacity-10 backdrop-blur-2xl'
      : color === 'orange'
        ? 'from-[#FF6240] to-[#FFA940]'
        : color === 'blue'
          ? 'from-[#1677FF] to-[#16B9FF]'
          : color === 'gray'
            ? 'bg-gray-700'
            : color == 'danger'
              ? 'bg-[#ED1522]'
              : 'from-[#FB1FFF] to-[#8247FF]';

  const renderContent = () => (
    <div className="flex items-center justify-center">
      {startIcon && <div className="mr-4 -mt-0.5">{startIcon}</div>}
      {children}
      {endIcon && <div className="ml-4 -mt-0.5">{endIcon}</div>}
      {processing && (
        <div className="absolute w-full h-full left-0 top-0 backdrop-blur-xl items-center justify-center flex">
          <div className="w-5">
            <CircularProgress width="full" />
          </div>
        </div>
      )}
    </div>
  );

  if (type === 'solid')
    return (
      <div
        onClick={(e) => (disabled ? null : onClick ? onClick(e) : null)}
        className={`inline-block text-white px-6 py-3 pt-3.5 rounded-xl cursor-pointer relative overflow-hidden btn--solid ${
          disabled ? 'opacity-20 cursor-not-allowed' : 'hover:opacity-90 active:opacity-80'
        } bg-gradient-to-r ${buttonBg} ${className}`}
        {...others}
      >
        {renderContent()}
      </div>
    );

  if (type === 'stroke')
    return (
      <div
        onClick={(e) => (disabled ? null : onClick ? onClick(e) : null)}
        className={`btn btn--stroke ${
          disabled ? 'opacity-20 cursor-not-allowed' : 'hover:opacity-90 active:opacity-80'
        } ${className}`}
        {...others}
      >
        {renderContent()}
      </div>
    );

  return null;
};
