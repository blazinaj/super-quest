import React, { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  onClick: () => void;
  primary?: boolean;
  secondary?: boolean;
  small?: boolean;
  disabled?: boolean;
  icon?: ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  primary = false,
  secondary = false,
  small = false,
  disabled = false,
  icon
}) => {
  const baseClasses = "flex items-center justify-center font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500";

  const sizeClasses = small ? "px-3 py-1 text-sm" : "px-4 py-2";

  const colorClasses = primary
    ? "bg-yellow-500 hover:bg-yellow-600 text-gray-900 focus:ring-yellow-500"
    : secondary
      ? "bg-indigo-700 hover:bg-indigo-600 text-indigo-100 focus:ring-indigo-500"
      : "bg-gray-600 hover:bg-gray-500 text-white focus:ring-gray-500";

  const disabledClasses = disabled
    ? "opacity-50 cursor-not-allowed"
    : "cursor-pointer";

  return (
    <button
      className={`${baseClasses} ${sizeClasses} ${colorClasses} ${disabledClasses}`}
      onClick={onClick}
      disabled={disabled}
    >
      {icon}
      {children}
    </button>
  );
};

export default Button;