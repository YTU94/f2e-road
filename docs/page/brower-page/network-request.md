### 网络请求

作为前端开发，日常接触最多的就是网络请求，因为很多数据都是服务器的数据库获取的，那么这个获取大多数都是通过 http 请求去请求数据资源，
好的这里就说到了我们的 http 请求，那么 http 请求的本质是什么呢？

#### http 请求

我们可能知道 js 是通过 XMLHttpRequest 对象（xhr）发出 http 请求，去请求资源，等到服务器的数据返回，那么 xhr 对象实现的 http 请求是什么样的呢？

我们需要了解这个过程！

简单说，**http 本质是 tcp/ip 请求**
这里就说到 tcp 协议了，我们大家基本知道 tcp 协议的三次握手，可能很多人还停留在基本的了解层面，这可能是不够的
首先我们先看这张图
![alt](https://bkimg.cdn.bcebos.com/pic/37d12f2eb9389b504fc2151a2e7df2dde71190efc068?x-bce-process=image/watermark,g_7,image_d2F0ZXIvYmFpa2U4MA==,xp_5,yp_5)
