/**
 * 判断dom是否包含关系
 * @param root 父元素
 * @param dom 子元素
 * @returns
 */
export declare const domContains: (root: Node | null, dom: Node) => boolean;
/**
 * 数字千分位格式化
 * @param number
 * @returns
 */
export declare const numberSplitThousands: (number?: number | string) => string;
/**
 * 保留n为小数，可选择补零
 * @param num
 * @param fraction n位小数，默认为2
 * @param zeroFill 是否补零，默认false
 * @returns
 */
export declare const keepDecimal: (
  num: number,
  fraction?: number,
  zeroFill?: boolean,
) => string;
