export const toSlug = (input: string): string => {
  if (!input) return '';

  // Hexo 默认处理的 ASCII 符号列表 (包含空格)
  // 注意：这里不包含中文标点，所以 "：" 和 "——" 会被保留
  const rSpecial = /[\s~`!@#$%\^&*()\-_=+[\]{}|\\;:"'<>,.?/]+/g;

  return input
    .toString()
    .replace(rSpecial, '-') // 把所有 ASCII 特殊符号和空格替换为 -
    .replace(/-+/g, '-') // 把连续的 - 合并为一个
    .replace(/^-|-$/g, ''); // 去掉开头和结尾的 -
};
