function parseNumber (numStr, base){
  let commonBase = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  commonBase['A'] = 10;
  commonBase['B'] = 11;
  commonBase['C'] = 12;
  commonBase['D'] = 13;
  commonBase['E'] = 14;
  commonBase['F'] = 15;

  let result = 0;
  let length = numStr.length;
  for (let i = length - 1; i > - 1; i-- ){
    result += commonBase[numStr[i].toUpperCase()] * base ** (length - i - 1);
  }
  return result;
}

function stringToNumber (str){
  // 二进制
  if (str.startsWith('0b') || str.startsWith('0B')){
    // 进一步判断是否合法
    let numStr = str.slice(2);
    // 只能存在0和1
    if (numStr.length === 0 || numStr.replace(/[0|1]*/g, '').length){
      // 抛出错误
    }
    return parseNumber(numStr, 2);
  }
  // 八进制
  else if (str.startsWith('0o') || str.startsWith('0O')){
    // 进一步判断是否合法
    let numStr = str.slice(2);
    // 0-7
    if (numStr.length === 0 || numStr.replace(/[0-7]*/g, '').length){
      // 抛出错误
    }
    return parseNumber(numStr, 8);
  }
  // 十进制
  else if (/^[1-9]/.test(str)){

  }
  // 十六进制
  else if (str.startsWith('0x') || str.startsWith('0X')){
    // 进一步判断是否合法
    let numStr = str.slice(2);
    // 0-9, A-F, a-f;
    if (numStr.length === 0 || numStr.replace(/[0-9A-Fa-f]*/g, '').length){
      // 抛出错误
    }
    return parseNumber(numStr, 16);
  }else{
    throw new SyntaxError(`${str}不符合要求`);
  }
}

console.log(stringToNumber('0b11'));
console.log(stringToNumber('0o11'));
console.log(stringToNumber('0x1a'));