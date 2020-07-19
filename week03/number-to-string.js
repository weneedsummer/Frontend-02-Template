
// ---------------- NumberToString ----------------

const numStr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

// 方法一：利用内置函数或类型转换
function NumberToString (num){
  if (toStr(num) !== '[object Number]'){
    throw new TypeError(`${num !== '' ? num : '空串'}不是Number类型`);
  }
  return String(num); // num + ''; (num).toString();
}


function toStr (obj){
  return Object.prototype.toString.call(obj);
}
// 方法二：利用模运算得出每一位数字对应的字符串数字
function NumberToString (num){
  if (toStr(num) !== '[object Number]'){
    throw new TypeError(`${num}不是Number类型`);
  }
  let sign = '';
  if (num < 0){
    sign = '-';
  }
  let newNum = Math.abs(num);
  let integerStr = IntegerToString(newNum);
  let decialStr = DecimalToString(newNum);
  let result;
  if (decialStr){
    result = integerStr + '.' + decialStr;
  }else{
    result = integerStr;
  }
  console.log(sign + result);
  return sign + result;
}

// 处理整数部分
function IntegerToString (num){
  let integer = Math.floor(num);
  let result = '';
  while (true){
    if (integer === 0){
      break;
    }
    result = numStr[integer % 10] + result;
    integer = Math.floor(integer / 10);
  }
  return result || '0';
}

// 处理小数部分
function DecimalToString (num){
  let numCopy = num;
  let result = '';
  while (true){
    if (numCopy % 1 === 0){
      break;
    }
    numCopy = numCopy * 10;
    result += numStr[Math.floor(numCopy % 10)];
  }
  return result;
}

NumberToString(.2); // 0.2
NumberToString(-.2); // -0.2
NumberToString(0.2); // 0.2
NumberToString(+2.); // 2
NumberToString(2.2); // 2.2
NumberToString(2.22223); // 2.22223
NumberToString(2.2222e3); // 2222.2