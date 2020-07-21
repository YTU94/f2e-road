### 原型对象

**定义**

无论什么时候，只要创建一个新函数，就会根据一组特定的规则为该函数创建一个 prototype 属性，这个属性指向函数的原型对象。

> 在默认情况下，所有原型对象都会自动获得一个 constructor(构造函数)属性，这个属性包含一个指向 prototype 属性所在函数的指针。

```js
// 常见创建函数的方式
function foo () {}
// 原型对象 foo.prototype
{constructor: ƒ foo()}
// 存在如下关系
foo.prototype.constructor === foo // true

// 关于 构造函数
function Foo () {}
// 构造一个对象
var f1 = new Foo()
// 继续看 Foo.prototype
{constructor: ƒ Foo()}
// 再看 f1对象
Foo {}
// 引入一个新概念：该实例内部包含一个指针（内部属性）__proto__(俗称隐式原型)
// 要明确一点这个连接存在于实例和构造函数的原型对象之间，而不是存在于实例和构造函数之间 （怎么理解这句话）
// 即：__proto__ 用来连接实例——f1和构造函数的原型对象——Foo.prototype,
f1.__proto__ === Foo.prototype // ture
```

### 隐式原型

在 Firefox、Safari 和 Chrome 中支持一种属性**proto**;而在其他实现中，这个属性是完全看不见的。

**所属**

`__proto__` 隐式原型是实例——Object 的一个属性，

**指向**

`__proto__` 属性指向 该实例的构造函数的原型对象，即 实例 f1 的构造函数 Foo 的原型对象，即 Foo.prototype 指向 的原型对象{constructor: f Foo}****

**总结**
****
这个指针是用来连接 2 个对象的，每个对象都有该属性

### 闭环

1. 函数`function`, 原型对象`prototype`, 构造属性`constructor`

foo.prototype --> 原型对象
原型对象.constructor --> foo

2.

<!-- ![An image](../assets/imgs/hero.jpg) -->
