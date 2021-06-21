/**
 * @author tab
 * @description 图标
 */
import * as React from 'react';
import './Icon.scss';
export interface IconProps {
  type: string;
  size?: number;
  className?: string;
}
declare const Icon: React.FC<IconProps>;
export default Icon;
