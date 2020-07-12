// 0xxxxxxx 0 ~ 2**7 - 1
// 110xxxxx 10xxxxxx 2**(6*1+5) - 1
// 1110xxxx 10xxxxxx 10xxxxxx 2**(6*2+4) - 1
// 11110xxx 10xxxxxx 10xxxxxx 10xxxxxx 2**(6*3+3) - 1
// 111110xx 10xxxxxx 10xxxxxx 10xxxxxx 10xxxxxx 2**(6*4+2) - 1
// 1111110x 10xxxxxx 10xxxxxx 10xxxxxx 10xxxxxx 10xxxxxx 2**(6*5+1) - 1

let uft8BinaryTemplate = [
  '0xxxxxxx',
  '110xxxxx 10xxxxxx',
  '1110xxxx 10xxxxxx 10xxxxxx',
  '11110xxx 10xxxxxx 10xxxxxx 10xxxxxx',
  '111110xx 10xxxxxx 10xxxxxx 10xxxxxx 10xxxxxx',
  '1111110x 10xxxxxx 10xxxxxx 10xxxxxx 10xxxxxx 10xxxxxx'
];
function UTF8_Enconding(string){
  let buffer;
  let unicodeArray = [];
  let byteLength = 0;
  for (let i = 0; i < string.length; i++){
    let uncode = string.charCodeAt(i);
    let len = getByteLength(uncode)
    byteLength += len;
    unicodeArray.push({
      binaryCode: Number(uncode).toString(2),
      bytes: len
    });
  }
  buffer = new ArrayBuffer(byteLength);
  let int8 = new Uint8Array(buffer);
  let lastIndex = 0;
  for (let i = 0; i < unicodeArray.length; i++ ){
    let item = unicodeArray[i];
    let template = uft8BinaryTemplate[item.bytes - 1].split('');
    let binaryCodeStr = item.binaryCode;
    let j = template.length - 1;
    let k = binaryCodeStr.length - 1;
    while(true){
      if (j < 0){
        break;
      }
      if (template[j] === ' ' || template[j] !== 'x'){
        j --;
        continue;
      }
      if (k < 0){
        template[j] = '0';
      }else{
        template[j] = binaryCodeStr[k];
      }
      k --;
      j --;
    }
    let codes = template.join('').split(' ');
    let codeLength = codes.length;
    console.log(codes);
    for (let index = 0; index < codeLength; index++ ){
      int8[lastIndex] = parseInt(codes[index], 2)
      lastIndex += 1;
    }
  }
  
  return int8; //buffer;
}

function getByteLength (code){
  if (code < 2**7){
    return 1;
  }
  for (let i = 1; i < 6; i ++){
    if (code < 2**(6 * i + 6 - i)){
      return i + 1;
    }
  }
}

console.log(UTF8_Enconding('abc您好')); // [97,  98,  99, 230, 130, 168, 229, 165, 189]
