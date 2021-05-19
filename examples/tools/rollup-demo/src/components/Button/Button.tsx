/**
 * @author tab
 * @description 按钮
 */

import * as React from 'react';
import classnames from 'classnames';

import './Button.scss';

export interface ButtonProps {
  text: string | number;
  className?: string;
  size?: 'small' | 'large';
  type?: 'primary' | 'info' | 'warn' | 'simple';
  disabled?: boolean;
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({
  className,
  text,
  size = 'small',
  type = 'primary',
  disabled = false,
  onClick,
}: ButtonProps) => {
  const classes = classnames(
    'ibes-ui-button',
    `button-${size}`,
    `button-${type}`,
    className,
    {
      'button-disabled': disabled,
    },
  );

  return (
    <div className={classes} onClick={disabled ? undefined : onClick}>
      {text}
    </div>
  );
};

export default Button;
