// 特殊行为定义：无法使用普通对象和原形实现
Object: 
  defineProperty|defineProperties: 
    神一样的存在。
  freeze: 
    完全冻住一个对象；对象不能被改变，不能添加新的属性，不能移除已有属性，不能更
    改已有属性的描述符(enumerability, configurability, writability)，不
    能改变已有属性的值。此外，其原型也不能被改变
  preventExtensions: 
    让一个对象变的不可扩展，不能再添加新的属性。对象的[[prototype]](__.proto__)
    也不可更改，但是可以操作其属性，也就是不能重新赋值
  seel: 
    封闭一个对象，组织添加新属性，并且所有已存在的属性不可配置(non-configurable)，
    但是对于那些可写属性(writable)，仍然可以改变其值.

Proxy|Reflect: 
  几乎其所有的方法(代理对象，拦截访问)都无法用普通方式实现

Symbol: 
  创造一种具有唯一性的基本类型数据

Map|Set|WeakMap|WeakSet: 
  可以以对象为key(WeakMap|WeakSet 还可以自动回收未被其他变量或对象引用的对象）

Generator|GeneratorFunction:
  生成器，可以临时将控制权交出去。

类型数组(Int8Array,Uint8Array,Uint8ClampedArray,Int16Array,Uint16Array,
Int32Array,Uint32Array,Float32Array,Float64Array,BigInt64Array,
BigUint64Array):
  内部的数组缓冲区会被创建在内存中，这里是真正的数组(连续的内存地址).javascript没有
  操作内存的语法，所以不可能通过普通对象实现。

ArrayBuffer|DataView:
  配合类型数组使用。

Function:
  将一段字符串变成一个函数。(eval 是解释运行一段代码)
