/**
 * @author tab
 * @description 按钮
 */
import * as React from 'react';
import './Button.scss';
export interface ButtonProps {
  text: string | number;
  className?: string;
  size?: 'small' | 'large';
  type?: 'primary' | 'info' | 'warn' | 'simple';
  disabled?: boolean;
  onClick?: () => void;
}
declare const Button: React.FC<ButtonProps>;
export default Button;
