import type { ReactNode } from 'react';

type ButtonProps = {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit';
  block?: boolean;
};

function Button({ children, onClick, disabled = false, type = 'button', block = false }: ButtonProps) {
  const className = block ? 'ui-button ui-button--block' : 'ui-button';

  return (
    <button className={className} type={type} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}

export default Button;
