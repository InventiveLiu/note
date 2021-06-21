import * as React from 'react';
import './MoneyBox.scss';
export interface MoneyBoxProps {
  className?: string;
  money: number;
  positive?: boolean;
  size?: 'large' | 'normal' | 'small';
  color?: 'main' | 'sub' | 'black';
}
declare const MoneyBox: React.FC<MoneyBoxProps>;
export default MoneyBox;
