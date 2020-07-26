// 用状态机实现：字符串“abababx”的解析
let stateMachine = {
  a: {
    b: 1,
  },
  b: {
    a: 1,
    x: 1,
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
    if (('end' in nextStates) && i - startIndex + 1 >= 7){
      return true;
    }
  }
  return false;
}

console.log(findTargetStr('abcabx')); // false
console.log(findTargetStr('abcdabcabx')); // false
console.log(findTargetStr('abcdabccabx')); // false
console.log(findTargetStr('abcabababxc')); // true