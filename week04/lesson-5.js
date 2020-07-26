// 找到字符串 abcdef;

function findStr (str){
  let target = 'abcdef';
  let i = 0; // 表示abcdef字符串的位置
  let j = 0; // 表示 str 的位置
  
  while (true){
    if (j >= str.length || i >=target.length){
      break;
    }
    if (str[j] === target[i]){
      j ++;
      i ++;
    } else if (i !== 0){
      i = 0;
    } else {
      j ++;
    }
  }
  
  if (i === target.length){
    return true;
  }
  return false;
}

console.log(findStr('abcdef')); // true
console.log(findStr('abcdefa')); // true
console.log(findStr('abcdsef')); // false
console.log(findStr('aaabcdefa')); // true