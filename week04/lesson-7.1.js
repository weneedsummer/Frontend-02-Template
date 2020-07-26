// 用状态机实现：字符串“abcabx”的解析
let stateMachine = {
  a: {
    b: 1,
  },
  b: {
    c: 1,
    x: 1,
  },
  c: {
    a: 1,
  },
  x: {
    'end': 1, // 表示结束
  } 
};

function findTargetStr (str){
  let startIndex = -1;
  let startStates = {a : {b: 1}}; // 开始状态
  let nextStates = startStates; 
  for (let i = 0; i < str.length; i++ ){
    if (str[i] in nextStates){
      nextStates = stateMachine[str[i]];
      if (startIndex === -1){
        startIndex = i;
      }
    }else{
      startIndex = -1;
      nextStates = startStates;
    }
    if (('end' in nextStates) && i - startIndex >= 5){
      return true;
    }
  }
  return false;
}

console.log(findTargetStr('abcabx')); // true
console.log(findTargetStr('abcdabcabx')); // true
console.log(findTargetStr('abcdabccabx')); // false
console.log(findTargetStr('abcabcabcx')); // false