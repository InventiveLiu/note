import * as React from 'react';
import classnames from 'classnames';
import { numberSplitThousands, keepDecimal } from '../../utils';

import './MoneyBox.scss';

export interface MoneyBoxProps {
  className?: string;
  money: number;
  positive?: boolean;
  size?: 'large' | 'normal' | 'small';
  color?: 'main' | 'sub' | 'black';
}

const MoneyBox: React.FC<MoneyBoxProps> = ({
  className,
  money,
  positive = true,
  size = 'normal',
  color = 'main',
}: MoneyBoxProps) => {
  const [int, decimal] = keepDecimal(money, 2, true).split('.');
  const cls = classnames('ibes-money-box', size, color, className);
  return (
    <div className={cls}>
      <span className="money money-unit">{positive ? '¥' : '-¥'}</span>
      <span className="money-num">{numberSplitThousands(int)}</span>
      <span className="money">{`.${decimal}`}</span>
    </div>
  );
};

export default MoneyBox;
