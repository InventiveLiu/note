/**
 * 判断dom是否包含关系
 * @param root 父元素
 * @param dom 子元素
 * @returns
 */
export const domContains = (root: Node | null, dom: Node): boolean => {
  let node: Node | null = dom;
  while (node) {
    if (node === root) {
      return true;
    }
    node = node.parentNode;
  }
  return false;
};

/**
 * 数字千分位格式化
 * @param number
 * @returns
 */
export const numberSplitThousands = (number: number | string = 0): string => {
  const res = `${number}`.replace(/\d+/, (
    n, // 先提取整数部分
  ) => n.replace(/(\d)(?=(\d{3})+$)/g, $1 => `${$1},`));
  return res;
};

/**
 * 保留n为小数，可选择补零
 * @param num
 * @param fraction n位小数，默认为2
 * @param zeroFill 是否补零，默认false
 * @returns
 */
export const keepDecimal = (
  num: number,
  fraction: number = 2,
  zeroFill: boolean = false,
): string => {
  const res = `${Math.round(num * 10 ** fraction) / 10 ** fraction}`;

  if (fraction > 0 && zeroFill) {
    const [int, decimal] = res.split('.');
    const zeroCount = fraction - decimal.length;
    let newDecimal = decimal;
    if (zeroCount > 0) {
      newDecimal += new Array(zeroCount + 1).join('0');
    }
    return `${int}.${newDecimal}`;
  }
  return res;
};
