### 网络知识基础

#### 面试题 -- 从浏览器地址输入地址到页面渲染的全过程

### 知识点
- tcp协议和udp协议
- 浏览器缓存
- DNS解析
- 浏览器渲染页面


#### http 请求

我们可能知道 js 是通过 XMLHttpRequest 对象（xhr）发出 http 请求，去请求资源，等到服务器的数据返回，那么 xhr 对象实现的 http 请求是什么样的呢？

我们需要了解这个过程！

简单说，**http 本质是 tcp/ip 请求**
这里就说到 tcp 协议了，我们大家基本知道 tcp 协议的三次握手，可能很多人还停留在基本的了解层面，这可能是不够的
首先我们先看这张图
![alt](https://bkimg.cdn.bcebos.com/pic/37d12f2eb9389b504fc2151a2e7df2dde71190efc068?x-bce-process=image/watermark,g_7,image_d2F0ZXIvYmFpa2U4MA==,xp_5,yp_5)