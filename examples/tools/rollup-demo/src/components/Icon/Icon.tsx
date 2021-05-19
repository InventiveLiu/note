/**
 * @author tab
 * @description 图标
 */

import React from 'react';
import classnames from 'classnames';

import './Icon.scss';

export interface IconProps {
  type: string;
  size?: number;
  className?: string;
}

const Icon: React.FC<IconProps> = ({
  className,
  type,
  size = 16,
}: IconProps) => (
  <i
    className={classnames('ibes-ui-icon', `icon-${type}`, className, {
      [`icon-${size}`]: size > 0,
    })}
  />
);

export default Icon;
