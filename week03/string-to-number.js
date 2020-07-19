function toStr (obj){
  return Object.prototype.toString.call(obj);
}

// ---------------- StringToNumber ----------------
/* 过滤：非字符串、空串、加号、减号; 默认为非法输入 */

// 方法一：利用内置函数或类型转换

function StringToNumber (str){
  if (toStr(str) !== '[object String]' || str === '' 
    || str === '+' || str === '-'){
      throw new Error(`${str !== '' ? str : '空串'}不能转换为数字`);
  }
  return Number(str); // +str; str - 0;
}

// 方法二：把每个字符串单独映射到对应数字

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

function StringToNumber  (str){
  if (toStr(str) !== '[object String]' || str === '' 
    || str === '+' || str === '-'){
      throw new Error(`${str !== '' ? str : '空串'}不能转换为数字`);
  }
  let sign = 1; 
  let first = str[0];
  let result = 0;

  if (first === '-'){
    sign = -1;
  }

  if (first === '-' || first === '+'){
    str = str.slice(1);
  }
  // console.log(sign, str);
  // 二进制
  if (str.startsWith('0b') || str.startsWith('0B')){
    // 进一步判断是否合法
    let numStr = str.slice(2);
    // 只能存在0和1
    if (numStr.length === 0 || numStr.replace(/[0|1]*/g, '').length){
      // 抛出错误
      throw new SyntaxError(`${str}不能转化为数字`);
    }
    result = parseNumber(numStr, 2);
  }
  // 八进制
  else if (str.startsWith('0o') || str.startsWith('0O')){
    // 进一步判断是否合法
    let numStr = str.slice(2);
    // 0-7
    if (numStr.length === 0 || numStr.replace(/[0-7]*/g, '').length){
      // 抛出错误
      throw new SyntaxError(`${str}不能转化为数字`);
    }
    result =  parseNumber(numStr, 8);
  }
  // 十六进制
  else if (str.startsWith('0x') || str.startsWith('0X')){
    // 进一步判断是否合法
    let numStr = str.slice(2);
    // 0-9, A-F, a-f;
    if (numStr.length === 0 || numStr.replace(/[0-9A-Fa-f]*/g, '').length){
      // 抛出错误
      throw new SyntaxError(`${str}不能转化为数字`);
    }
    result = parseNumber(numStr, 16);
  }
  // 十进制
  else if (!isNaN(str)){
    // 分为三段，整数，小数，指数
    let [intege, decimal, exp] = str.split(/\.|e/);
    if (intege){
      result += parseNumber(intege, 10);
    }
    // 小数部分，需要处理精度问题
    if (decimal){
      let decimalNum = parseNumber(decimal, 10);
      result = result * (10 ** decimal.length) + decimalNum;
      result /= 10 ** decimal.length;
    }
    // 指数部分，需要处理精度问题
    if (exp){
      let expNum = parseNumber(exp, 10);
      if (expNum >= decimal.length){
        result *= 10 ** expNum;
      }else{
        let len = decimal.length;
        result *= 10 ** len;
        result /=  10 ** (len - expNum);
      }
    }
  }else{
    throw new SyntaxError(`${str}不能转化为数字`);
  }
  console.log(result * sign);
  return result * sign;
}


StringToNumber ('0b11'); // 3
StringToNumber ('-0b11'); // -3
StringToNumber ('0o11'); // 9
StringToNumber ('0o17'); // 15
StringToNumber ('0x1a'); // 26
StringToNumber ('+0x1ab9B'); // 109467
StringToNumber ('0.2'); // 0.2
StringToNumber ('.2'); // 0.2
StringToNumber ('2.2'); // 2.2
StringToNumber ('2.'); // 2
StringToNumber ('2.3343e3'); // 2334.3
StringToNumber ('2.313e2'); // 231.3
// StringToNumber ('0b13'); // 抛错
// StringToNumber ('0o19'); // 抛错
// StringToNumber ('0w13'); // 抛错
// StringToNumber ('0x1r'); // 抛错