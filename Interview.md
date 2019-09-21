 # 面试题汇总
## JS 
> 面向对象的三个基本特征：封装、继承、多态
> JavaScript的语言特性  
JavaScript 是一种动态的，弱类型脚本语言。动态性是指，在一个 JS对象中 需要为一个属性赋值时，不需要事先创建一个字段，直接在赋值时使用即可；弱类型是指 JS 中数据类型无需在声明时指定。
### 1.继承
1. 你知道javascript中的继承吗  
2. javascript是怎么实现继承的
3. 说一说继承的几种方式
4. ES5 与 ES6 中的继承有什么不同 
5. 如何声明一个类 

*面试官提问时，不要像挤牙膏似的问什么说什么，要将答案有逻辑的表达出来。比如说第一题，不能光回答一个 “知道” 就完事了，面试官的意思肯定是要你介绍一遍。*  

JS 使用原型来实现继承。有多种实现继承的方式。  
1. 第一种是只利用原型链，这种方法创建出来的实例会共享原型链中的属性
```
function SuperType() {
  this.colors = ['blue', 'red']
}
function SubType(){}
SubType.prototype = new SuperType()
let instance1 = new Subtype()
let instance2 = new Subtype()
instance1.colors.push('yellow')
instance2.colors.length()  // 3
```
2. 第二种是借用构造函数，使用这种方法时可以在子类构造函数中向父类构造函数传递参数，并且通过子类型构造函数创建的对象其内包含的是由超类型构造函数生成的实例属性/方法 的副本，而不是通过原型对象的共享。但是会造成函数无法复用的问题
```
function SuperType(name) {
  this.name = name
}
function SubType(name, age){
  SuperType.call(this, name)
  this.age = age
}
let instance1 = new Subtype('zmn', 20)
```
3. 第三种是组合继承。将原型链和借用构造函数组合起来实现继承。利用原型链实现对原型属性和方法的继承，通过借用构造函数实现对实例属性的继承。缺点是组合继承无论如何都会调用两次超类型构造函数，一次在创建子类原型时，一次在子类构造函数中。因此子类的原型会包含超类型构造函数的所有属性，而子类的实例需要对这些实例进行重写（也就是在子类构造函数中借用父类构造函数）来屏蔽掉原型中的属性。导致空间浪费以及效率低下。
```
function SuperType(name) {
  this.name = name
}
function SubType(name, age){
  SuperType.call(this, name)
  this.age = age
}
SubType.prototype = new SuperType()
SubType.prototype.constructor = subType
SubType.prototype.sayAge = function() {
  console.log(this.age)
}
```
4. 原型式继承。通过 Object.create(O) 实现，返回一个以 O 为原型的对象。在没有必要定义一个构造函数时，可以通过该方法在一个对象的基础上生成另一个对象，不过依然有原型链“共享属性”的缺点。
5. 寄生式继承。和原型式继承非常相似，创建一个仅用于封装继承的函数，在这个函数内部用某种方法，比如Object.create()生成一个基于某个对象的其他对象，然后对这个对象进行添加属性或方法等操作，最后返回这个对象。同样适用于只关注对象的时候，不过如果在这个封装函数中为对象添加方法，会导致函数不能复用从而降低效率。
6. 寄生组合式继承。是引用类型最理想的继承范式，可以解决组合继承的问题。
子类对超类实现继承需要的无非是超类原型的一个副本而已，因此可以利用寄生式继承来继承超类型的原型，然后再将结果指定给子类型的原型。此时只会在子类构造函数中调用一次超类构造函数，并且避免了在 subType.prototype 上创建不必要的，多余的属性。
```
function inheritPrototype(subType, superType) {
  var prototype = Object.create(superType.prototype);
  prototype.constructor = subType;
  subType.prototype = prototype;
}
```
ES6 中通过构造函数的语法糖 class 的 extends 来实现继承
```
class B extends A {
  constructor() {
    super();  // super 代表父类实例，调用 super 后才可以用this
    this.age = 12;
  }
}
```
一共有两条继承链：  
假设class B extends A，实例对象分别是insB、insA:
* 作为对象时，代表构造函数的继承  B.__proto__=A;
* 作为函数时，代表方法的继承  B.prototype.__proto__=A.prototype;
* A.prototype.constructor=A;   //类的原型的构造函数指向类本身。
* insA.__proto__=A.prototype;   //类的实例的原型指向创建它的构造函数的原型。
* insB.__proto__.__proto__=insA.__proto__;   //子类实例的原型的原型指向父类实例的原型  

声明类的方法有两种，一种是通过构造函数，一种是通过ES6的class语法
### 2.原型链
1. 解释一下原型链  
JS 将原型链作为作为实现继承的主要方式。每个构造函数都有一个原型对象，原型对象都包含一个指向构造函数的指针，而实例对象都包含一个指向原型对象的内部指针。当原型对象等于另外一个类型的实例时，该原型对象将包含一个指向另一个原型的指针，如果另一个原型又是另一个构造函数的实例，层层递进，就构成了实例与原型的链条。这就是所谓原型链的基本概念。  
*注：Function 作为构造函数时 指向Funtion.prototype，同样的，Function 作为一个实例对象时，他的 __proto__ 也指向 Funtion.prototype（这是一个对象，__proto__ 指向 Object.prototype）
而 Object 也是一个函数实例，他的 __proto__ 指向 Function.prototype*
2. instanceof 的原理  
instanceof 判断左右两边的继承关系：左边是否继承自右边。判断时 会沿着实例的 __proto__ 属性往上找，同时也沿着构造函数的 prototype 属性向上找，如果能找到同一个引用则返回true，否则返回false。
要找到这个实例来自哪个构造函数，可以利用 obj.__proto__constructor
3. 创建对象的方法  
    - 字面量 or new Object()
    - 构造函数
    - Object.create()
4. 创建对象的模式  
    - 构造函数。会导致函数不能复用
    - 原型。会共享原型上的属性
    - 构造函数与原型结合使用。**是目前认同度最高的一种创建自定义类型的方法**
    - 寄生构造函数模式。跟寄生式继承差不多，封装一个构造函数，在里面创建一个继承自其他构造函数但具有额外方法/属性的对象，然后对它进行返回。通过寄生构造函数模式生成的对象与其封装构造函数不存在继承关系。
    - 稳妥构造函数模式。稳妥对象：没有公共属性，其方法也不引用 this。一般用于对安全性要求较高的场景中。用这种模式创建对象时，对象的方法访问的是构造函数的私有属性，除了通过对象的某个方法，没有其他办法可以对该私有属性进行访问或其他操作。
5. new 运算符  
- 创建一个新对象, 这个新对象继承自构造函数 prototype 属性
- 将构造函数的作用域赋值给这个新对象（即 this 值绑定到该对象上）
- 执行构造函数代码（向新对象添加属性）
- 返回这个新对象
6. 原型的实际应用  
    - jquery 中，所有的 jquery 对象都有css(), 或者 html() 方法，虽然我没有研究过 jquery 的源码，但大概能想到，这都是从原型中继承来的。
    - Vue 中通过 Vue.component() 全局注册的组件，子组件都访问的到，也是从原型中继承来的。
7. 原型如何体现扩展性  
我认为，原型的扩展重点是原型不能发生改变，比如 Vue 中的 Vue.extend(options)，会返回一个子组件的构造函数，该构造函数由 Vue 扩展而来，由这个构造函数生成的组件具备传入的 options 配置，仅仅继承自 Vue构造函数的组件则没有。
跟原型扩展相辅相成的还有原型的增强。原型本身的行为会受到配置的影响，原型被配置以后，所有从这个原型衍生出来的所有组件都会受到影响，比如 Vue.mixin()。
### 3.作用域链
> 作用域是在函数定义的时候确定的。而this则是在函数调用时确定的（即作用域中的变量是在函数调用时确定的）！！！函数可以访问到它被**创建时**的上下文环境。划重点：**创建时**！！！

可能会问到的东西有 执行上下文，变量对象，作用域链，闭包，可能还会问到 this。  
执行上下文可以理解为函数执行的环境，会形成一个作用域。每一个函数执行时，都会给对应的函数创建这样一个执行环境。函数每被调用一次，都会产生一个新的执行上下文环境。因为不同的调用可能就会有不同的参数。  
作用域链是由当前环境与上层环境的一系列变量对象（变量对象用于保存当前执行上下文的数据）组成，它保证了当前执行环境对符合访问权限的变量和函数的有序访问。作用域链本质上是一个指向变量对象的指针列表。

当在函数内部定义了其他函数并将这个函数返回，同时被返回的函数引用了外部函数的变量，此时就创建了闭包。闭包有权访问包含函数内部的所有变量，原理如下：
- 在后台执行环境中，函数的作用域链包含着它自己的作用域、包含函数的作用域和全局作用域。
- 通常，函数的作用域及其所有变量都会在函数执行结束后被销毁。
- 但是，当函数返回了一个闭包并且引用了包含函数的变量时，这个函数的作用域将会一直在内存中保存到闭包不再存在为止。

提到闭包时，可以引申到它的应用-函数柯里化。*示例参见 demo/needToBePost/curry.html*

this 应该不会直接被提问，而是通过做题来检测自己对这个知识点的掌握程度。
this共有几种情况？
1. new 调用构造函数时，this指向被返回的实例对象，如果构造函数不是通过 new 调用的，this 指向 window
2. 作为一个对象的方法被调用时，this 指向这个对象
3. 通过 call， apply调用，指向其绑定的this
4. 全局中调用普通函数，this 指向 window
5. 在构造函数的 prototype 中，this指向的是当前这个对象

## 计算机网络  
### 1.OSI 七层模型和 TCP/IP 四层模型
> 互联网的实现，分成好几层，每一层都有自己的功能，就像建筑物一样，每一层都靠下一层支持。OSI模型就是这样的一个分层，它是一个由国际标准化组织􏰁提出的概念模型,**试图提供一个使各种不同的计算机和网络在世界范围内实现互联的标准框架**。它将计算机网络体系结构划分为七层，每层都可以提供抽象良好的接口。

![OSI七层模型](https://upload-images.jianshu.io/upload_images/2179030-3694fe2b18ebe05f.png)
TCP/IP 四层模型如图①②③④所示，从上往下分别是①应用层②传输层③网际互连层④网络接口层。OSI是一个完整的、完善的宏观模型，他包括了硬件层（物理层），当然也包含了很多协议。TCP/IP模型，更加侧重的是互联网通信核心（也是就是围绕TCP/IP协议展开的一系列通信协议）的分层，因此它不包括物理层，不适用于非 TCP/IP 网络。
### 2.http 1.0 1.1 2.0 区别
#### 2.0 与 1.x 区别
1. 二进制传输
HTTP 2.0 中所有加强性能的核心点在于此。在之前的 HTTP 版本是通过文本的方式传输数据。在 HTTP 2.0 中引入了新的编码机制，所有传输的数据都会被分割，并采用二进制格式编码。
2. 多路复用
可以做到同一个连接并发处理多个请求，通过这个技术，可以避免 HTTP 旧版本中的队头阻塞问题，极大的提高传输性能。
3. Header 压缩
在 HTTP 2.0 中，减少了 header 的大小。并在两端维护了索引表，用于记录出现过的 header ，后面在传输过程中就可以传输已经记录过的 header 的键名，对端收到数据后就可以通过键名找到对应的值。
4. 服务端 Push
在 HTTP 2.0 中，服务端可以在客户端某个请求后，主动推送其他资源。
可以想象以下情况，某些资源客户端是一定会请求的，这时就可以采取服务端 push 的技术，提前给客户端推送必要的资源，这样就可以相对减少一点延迟时间。
#### 1.1 与 1.0 区别
1. 长连接
HTTP 1.0需要使用keep-alive参数来告知服务器端要建立一个长连接，而HTTP1.1默认支持长连接。
Keep-Alive 功能使客户端到服务器端的连接持续有效，当出现对服务器的后继请求时，Keep-Alive 功能避免了建立或者重新建立连接。想要知道一个 keep-alive 连接何时传递完数据，可以判断其content-length首部字段。
短连接：适用于网页浏览等数据刷新频度较低的场景。
长连接：适用于客户端和服务端通信频繁的场景，例如聊天室，实时游戏。
2. HTTP 1.1增加host字段
3. 节约带宽
HTTP 1.1支持只发送header信息(不带任何body信息)，如果服务器认为客户端有权限请求服务器，则返回100，否则返回401。客户端如果接受到100，才开始把请求body发送到服务器。这样当服务器返回401的时候，客户端就可以不用发送请求body了，节约了带宽。另外HTTP还支持传送内容的一部分。这样当客户端已经有一部分的资源后，只需要跟服务器请求另外的部分资源即可。这是支持文件断点续传的基础。
### 3.https 原理
[https原理](https://app.yinxiang.com/shard/s50/nl/21169266/981fe773-f829-49d6-9e2b-bdf0fad40cc0?title=HTTPS%20%E5%B7%A5%E4%BD%9C%E5%8E%9F%E7%90%86)
[http 与 https 区别](https://app.yinxiang.com/shard/s50/nl/21169266/5d3e22c0-ed93-4c42-b26f-165f41dbaa04?title=http%E5%92%8Chttps%E7%9A%84%E5%8C%BA%E5%88%AB)
### 4.请求/响应报文中 header 的具体内容
> HTTP协议（超文本传输协议）是tcp/ip协议的一个子集，用于客户端和服务器端之间的通信，主要通过请求报文和响应报文实现。
请求报文由 请求行（请求方法+请求URI+协议版本），请求头（浏览器的信息，接受的语言格式等等等），请求主体（发送给服务器的内容）组成
响应报文由 响应行（协议版本+状态码+解释状态码的原因短语），响应头（服务器的一些信息，服务器想告诉浏览器的信息等等），响应主体（用户看到的内容）组成。

>HTTP 首部字段根据实际用途被分为以下 4 种类型：
**通用首部字段（General Header Fields）**
请求报文和响应报文两方都会使用的首部。
**请求首部字段（Request Header Fields）**
从客户端向服务器端发送请求报文时使用的首部。补充了请求的附加内容、客户端信息、响应内容相关优先级等信息。
**响应首部字段（Response Header Fields）**
从服务器端向客户端返回响应报文时使用的首部。补充了响应的附加内容，也会要求客户端附加额外的内容信息。
**实体首部字段（Entity Header Fields）**
针对请求报文和响应报文的实体部分使用的首部。补充了资源内容更新时间等与实体有关的信息。

![通用首部字段](F:/demo/imgInMD/通用首部字段.png)
![实体首部字段](F:/demo/imgInMD/实体首部字段.png)
![请求首部字段](F:/demo/imgInMD/请求首部字段.png)
![响应首部字段](F:/demo/imgInMD/响应首部字段.png)
> 浏览器发送请求时，通过 Accept-Encoding 带上自己支持的内容编码格式列表；服务端从中挑选一种用来对正文进行编码，并通过 Content-Encoding 响应头指明选定的格式；浏览器拿到响应正文后，依据 Content-Encoding 进行解压。当然，服务端也可以返回未压缩的正文，但这种情况不允许返回 Content-Encoding。这个过程就是 HTTP 的内容编码机制。内容编码目的是优化传输内容大小，通俗地讲就是进行压缩。Transfer-Encoding 则是用来改变报文格式，它不但不会减少实体内容传输大小，甚至还会使传输变大。我们在建立一个长链接的时候，有一个问题就是需要知道数据何时传送完毕，一种解决方案是通过 content-length(计算实体长度) 进行判断。不过如果实体来自网络文件或者由动态语言生成，就没法拿到那么准确的数据了。这时我们可以使用 transform-encoding:chuncked 表示这个报文采用了分块编码。报文中的实体需要改为用一系列分块来传输。每个分块包含十六进制的长度值和数据。最后一个分块长度值必须为 0，对应的分块数据没有内容，表示实体结束。
### 5.请求方式
> 注：发送get请求时，浏览器会对请求和服务器的响应进行一次缓存

* Get 请求指定页面信息，并返回实体主体
* Post 向指定资源提交数据进行处理请求（提交表单、上传文件）
* Put 向指定资源位置上上传其最新内容
* Head 与get请求类似，返回的响应中没有具体内容，用于获取报头
* delete 请求服务器删除页面
主要方法有 get， post， put， delete，head，其中最常用的就是 get 和 post。这两者有一定的区别：
- **GET 在浏览器回退时是无害的，而 POST 会再次提交请求**
- GET 产生的 URL 地址可以被收藏，而 POST 不可以
- **GET 请求会被浏览器主动缓存，而 POST 不会， 除非手动设置**
- GET 请求只能进行 url 编码，而 POST 支持多种编码方式
- **GET 请求参数会被完整保留在浏览器历史记录里，而 POST 中的参数不会被保留**
- GET 请求在 URL 中传送的参数是有长度限制的，而 POST 没有限制
- **对参数的数据类型，GET 只接受 ASCII 字符，而 POST 没有限制**
- **GET 比 POST 更不安全，因为参数直接暴露在 URL 上，所以不能用来传递敏感信息**
为什么get会被缓存而post不会？get请求类似于查找的过程，用户获取数据，可以不用每次都与数据库连接，所以可以使用缓存。post不同，post做的一般是修改和删除的工作，所以必须与数据库交互，所以不能使用缓存
- **GET 参数通过URL 传递，POST 放在 Request body 中**

post 和 put 的区别：
put 将文件或者是资源完完全全对可以从 URI 中获取的东西进行一个替换，put 具有幂等性，不管你请求多少次拿到的都是一样的东西
post 用于更新或者修改，是不具有幂等性的
### 6.响应码（304一定要说清）
![状态码](F:/demo/imgInMD/http响应状态码.png)
几种常见的状态码：
- 200 OK   客户端请求已正常处理
- 204 No Content  请求已成功处理，但响应报文中没有响应主体（或不允许有主体）
- 206 Partial Content  表示客户端进行了范围请求，服务器成功执行
- 301 Moved Permanently  永久性重定向。该状态码表示请求的资源已被分配了新的URI，以后应使用资源现在所指的URI。
- 302 Found  临时性重定向（跟307一样，不过307不会将post请求变为get请求）
- 304 Not Modified（和重定向没有关系）  客户端发送附带条件的请求时，服务端允许访问但资源不满足条件，不包含响应主体。比如客户端在请求一个文件的时候，发现自己缓存的文档具有 lastModified，那么在请求中会包含 If Modified Since，根据是否满足条件来返回200 或 304。如果缓存仍然有效，还未更新，则返回304，如果失效则返回200.
- 307 temporary redirect，临时重定向，和302含义相同
- 400 Bad Request  请求报文存在语法错误
- 401 Unauthorized  请求须通过HTTP认证
- 403  Forbidden  服务器拒绝客户端的请求
- 404  Not Found  服务器上无法找到请求的资源
- 500 Internal Sever Error  服务端在执行请求时发生了错误
- 501 Not Implemented，表示服务器不支持当前请求所需要的某个功能
- 503  Service Unavailable  服务器现在无法处理请求
### 7.TCP/UDP 区别
> 基于TCP协议的最好例子是HTTP协议和HTTPS协议.实际上，绝大多数你所熟悉的通常协议，都是基于TCP的，例如：Telnet，FTP以及SMTP协议。UDP协议没有TCP协议那么受欢迎，但是也被广泛应用，比如DHCP以及DNS协议，其他还有一些基于UDP的协议如SNMP,TFTP,BOOTP以及NFS
1. 基于连接vs无连接
TCP 是面向连接的，而 UDP 是无连接的。当一个客户端和一个服务器通过TCP发送数据之前，必须先建立连接，也就是 TCP握手。UDP是无连接的协议，和点对点连接之前不需要发送消息。这就是为什么，UDP更加适合消息的多播发布，从单个点向多个点传输消息。
2. 可靠与不可靠
TCP提供交付保证,这意味着一个使用 TCP 协议发送的消息是保证交付给客户端的。而 UDP 是不可靠的，协议收到什么数据就传递什么数据，并且也不管对方是否收到。
3. 有序性
除了提供交付保证，TCP 也保证了消息的有序性。该消息将以从服务器端发出的同样的顺序发送到客户端，尽管这些消息到网络的另一端时可能是无序的。TCP 协议将会为你排好序。UDP 不提供任何有序性或序列性的保证。数据包将以任何可能的顺序到达。
TCP 如何保证数据的有效性呢？主机每次发送数据时，TCP就给每个数据包分配一个序列号并且在一个特定的时间内等待接收主机对分配的这个序列号进行确认，如果发送主机在一个特定时间内没有收到接收主机的确认，则发送主机会重传此数据包。接收主机利用序列号对接收的数据进行确认，以便检测对方发送的数据是否有丢失或者乱序等，接收主机一旦收到已经顺序化的数据，它就将这些数据按正确的顺序重组成数据流并传递到高层进行处理。

4. 高效性
因为 UDP 没有 TCP 那么复杂，需要保证数据不丢失且有序到达。所以 UDP 的头部开销小，只有八字节，相比 TCP 的至少二十字节要少得多，在传输数据报文时是很高效的。
5. 拥塞控制
UDP 没有拥塞控制，一直会以恒定的速度发送数据。
### 8.DNS 解析
> DNS解析就是通过给定的域名找到对应的IP地址
1. 首先 chrome 会搜索自身的 DNS 缓存（缓存时间比较短，大概只有1分钟，且只能容纳1000条缓存），查看是否有对应的条目
2. 如果没有找到的话 chrome 会搜索操作系统自身的缓存
3. 如果仍然没有找到，会读取本地的 HOSTS 文件，查看是否有该域名的IP地址
4. 如果还是没有找到，浏览器会发起一个 DNS 的系统调用，向本地配置的 DNS 服务器发起域名解析请求，这个请求是递归的请求。运营商的 DNS 服务器首先查找自身的缓存，找到对应的条目，且没有过期，则解析成功。如果没有找到对应的条目，则有运营商的 DNS 代我们的浏览器发起迭代 DNS 解析请求。首先找到根域的 DNS 服务器的 IP 地址，然后迭代直到找到整个域名对应的 IP 地址。DNS 服务器将地址返回给 Windows 系统内核，内核又把结果返回给浏览器，进行下一步。
### 9.TCP 相关
#### 1.三握 四挥
[http 三次握手](https://app.yinxiang.com/shard/s50/nl/21169266/94bb5e60-d611-4311-972b-e5952e7b71f6?title=HTTP%E4%B8%89%E6%AC%A1%E6%8F%A1%E6%89%8B)
[http 四次挥手](https://app.yinxiang.com/shard/s50/nl/21169266/819c1739-c42e-4da6-8a6b-b7aca1d90c18?title=%F0%9F%9A%A9%E5%9B%9B%E6%AC%A1%E6%8C%A5%E6%89%8B)
#### 2.syn 洪泛
在TCP协议中被称为三次握手（Three-wayHandshake）的连接过程中，如果一个用户向服务器发送了SYN报文，服务器又发出SYN+ACK应答报文后未收到客户端的ACK报文的，这种情况下服务器端会再次发送SYN+ACK给客户端，并等待一段时间后丢弃这个未完成的连接，这段时间的长度称为SYNTimeout，一般来说这个时间是分钟的数量级。
SYN flood所做的就是利用了这个SYNTimeout时间和TCP/IP协议族中的另一个漏洞:报文传输过程中对报文的源IP地址完全信任。SYN flood通过发送大量的伪造TCP链接报文而造成大量的TCP半连接,服务器端将为了维护这样一个庞大的半连接列表而消耗非常多的资源。这样服务器端将忙于处理攻击者伪造的TCP连接请求而无法处理正常连接请求,甚至会导致堆栈的溢出崩溃。
SYN 洪泛攻击类别有：
- 直接攻击
- 欺骗式攻击
- 分布式攻击
针对 SYN Flood，有以下几种解决办法：
- 缩短 SYN timeout 时间
- 设置 SYN cookies
- 设置 SYN 可疑队列
- 使用防火墙
#### 3.流量控制
让发送方的发送速率不要太快，让接收方来得及接收。利用**滑动窗口机制**可以很方便的在TCP连接上实现对发送方的流量控制。
主要想法：让发送方知道接收方当前的接收能力，调整发送速率。
#### 4.拥塞控制
拥塞处理和流量控制不同，后者是作用于接收方，保证接收方来得及接受数据。而前者是作用于网络，防止过多的数据拥塞网络，避免出现网络负载过大的情况。

拥塞处理包括了四个算法，分别为：慢开始，拥塞避免，快速重传，快速恢复。
- 慢开始
就是在传输开始时将发送窗口慢慢指数级扩大，从而避免一开始就传输大量数据导致网络拥塞。
- 拥塞避免
（补充）RTT：该指标表示发送端发送数据到接收到对端数据所需的往返时间。
拥塞避免算法相比简单点，每过一个 RTT 窗口大小只加一，这样能够避免指数级增长导致网络拥塞，慢慢将大小调整到最佳值。
- 快速重传
快重传要求接收方在收到一个失序的报文段后就立即发出重复确认（为的是使发送方及早知道有报文段没有到达对方）而不要等到自己发送数据时捎带确认。快重传算法规定，发送方只要一连收到三个重复确认就应当立即重传对方尚未收到的报文段，而不必继续等待设置的重传计时器时间到期。
- 快恢复
快恢复一般配合快速重传一起使用。（在 TCP new Reno 中）TCP 发送方先记下三个重复 ACK 的分段的最大序号。
假如我有一个分段数据是 1 ~ 10 这十个序号的报文，其中丢失了序号为 3 和 7 的报文，那么该分段的最大序号就是 10。发送端只会收到 ACK 序号为 3 的应答。这时候重发序号为 3 的报文，接收方顺利接收并会发送 ACK 序号为 7 的应答。这时候 TCP 知道对端是有多个包未收到，会继续发送序号为 7 的报文，接收方顺利接收并会发送 ACK 序号为 11 的应答，这时发送端认为这个分段接收端已经顺利接收，接下来会退出快恢复阶段。
#### 5.滑动窗口协议
在 TCP 中，两端都维护着窗口：分别为发送端窗口和接收端窗口。发送端窗口包含已发送但未收到应答的数据和可以发送但是未发送的数据。
![滑动窗口](https://user-gold-cdn.xitu.io/2018/5/5/1632f25c587ffd54?w=660&h=270&f=png&s=37109)
发送端窗口是由接收窗口剩余大小决定的。接收方会把当前接收窗口的剩余大小写入应答报文，发送端收到应答后根据该值和当前网络拥塞情况设置发送窗口的大小，所以发送窗口的大小是不断变化的。

当发送端接收到应答报文后，会随之将窗口进行滑动
![滑动窗口](https://user-gold-cdn.xitu.io/2018/5/5/1632f25cca99c8f4?w=660&h=210&f=png&s=24554)
滑动窗口实现了流量控制。接收方通过报文告知发送方还可以发送多少数据，从而保证接收方能够来得及接收数据。
## vue 相关
### 1.双向数据绑定
> 我原来一直以为vue数据响应就是双向绑定，可这是不对的。数据响应只是用数据改变了 dom，而 dom 的变化反过来是影响不了数据的。双向绑定依赖于 v-model 指令。

先来一个简单的示例。
```
new Vue({
  el:'#app',
  template: '<div><input v-model="message" placeholder="write in here"/><div>{{message}}</div></div>',
  data() {
    return {
      message: ''
    }
  }
})
```
这就是一个最简单的数据绑定，当我们在input里输入内容时，div中的内容也会跟着发生变化。
实现原理中最重要的一步就是监听了input的input事件，如下所示
```
// 也就是在每一次 input 事件发生过程中都执行一个对message的赋值操作,并且动态绑定input的 value 到 message 上
<input @input="message = $event.target.value" :value = message/>
```
v-modal同样也可以用在组件上
```
let Child = {
  template: '<div>'
  + '<input @input="updateValue" placeholder="edit me">' +
  '</div>',
  methods: {
    updateValue(e) {
      this.$emit('input', e.target.value)
    }
  }
}

let vm = new Vue({
  el: '#app',
  // 在子组件中监听 input 事件，通过 props 以及 $emit 将子组件里的 value 传递给父组件
  // 也可写成 <child @input = "message = $event.target.value" :value="message"></child>
  template: '<div>' +
  '<child v-model="message"></child>' +
  '<p>Message is: {{ message }}</p>' +
  '</div>',
  data() {
    return {
      message: ''
    }
  },
  components: {
    Child
  }
})
```
### 2.diff 算法
diff 算法发生在 patch 过程中，也就是组件更新过后调用 update 之后进入的函数。patch将新老VNode节点进行比对，然后将根据两者的比较结果进行最小单位地修改视图，而不是将整个视图根据新的VNode重绘。patch 主要有新旧节点相同和新旧节点不同两种逻辑。新旧节点不同时比较简单，就是一个创建新节点、更新父占位节点然后删除旧节点的过程。
新旧节点相同时比较复杂（比较新旧节点是否相同，首先两个的 key 得相同，然后判断标签是否相同、是否同时为或者不为注释节点、是否同时都有data等等）。首先针对两个节点的子节点进行比较：
1. 如果新节点是文本节点并且和旧节点文本内容不同的时候，则直接替换文本内容
2. 否则就进入新节点不是文本节点的逻辑
3. 如果两边都有子节点存在，则会进入一个复杂的 updateChildren 逻辑，这个我待会儿举个例子来讲
4. 如果只有新节点有子节点，那么就表示旧节点不需要了，如果旧的节点是文本节点先将内容清除，然后将子节点插入到 elm 下面
5. 如果只有旧节点有子节点，表示更新的是一个空节点，直接将旧节点的子节点清除
6. 如果旧节点是文本节点，那么清除文本内容

然后来说一说复杂的 updateChildren 逻辑，这个逻辑很多而且不好说，可以直接举个例子。（此处举 arr.reverse().push('E')那个例子）
### 3.vue 和其他框架的区别
（严格来说 jquery 不算是一个框架，但我估计面试官不会问我 vue 和 react 的区别，可能会问 vue 和 jquery 使用时的区别）
最主要的区别是 vue 中实现了数据与视图的分离以及用数据驱动视图。举一个很简单的 to-do-list 的例子，它有增加事项的功能。jquery 是通过获取到 input 中的 value 后，通过生成新的 dom 节点插入到父盒子中来实现这个功能。数据（input 的 value）和视图（新增的 li 元素）是混合在一起的；vue 在 template 中对整个视图进行声明，li 标签通过 v-for 指令由其绑定的数据循环得到，新增事项时只需通过往数组里 push 一项新的数据即可。
我没有用过 react ，所以具体的细节不太清楚。大致知道两个框架很大的不同在于模板的书写，vue 中的模板采用 .vue 文件的形式，而 react 用一种叫 jsx 的语法，将视图和逻辑都写在了一起，我个人是更喜欢 vue 这种模板的。

### 4.vue 代码优化
运行时优化
- 对于有频繁切换的情况下使用 v-show，不频繁切换的使用 v-if。因为v-if是动态的向DOM树内添加或者删除DOM元素；v-show是通过设置DOM元素的display样式属性控制显隐；v-if 有更高的切换开销，而 v-show 有更高的初始渲染开销。
- 使用 v-for 时绑定 key 属性，可以实现节点的复用。
- 提取组件的 CSS 到单独文件。当使用单文件组件时，组件内的 CSS 会以style标签的方式通过 JavaScript 动态注入。这有一些小小的运行时开销，将所有组件的 CSS 提取到同一个文件可以避免这个问题，也会让 CSS 更好地进行压缩和缓存。

首屏优化
- 异步路由。使用异步路由可以根据URL自动加载所需页面的资源，并且不会造成页面阻塞。
```
const Foo = () => import('./Foo.vue')
const router = new VueRouter({
  routes: [
    { path: '/foo', component: Foo }
  ]
})
```
- 异步组件。不需要首屏加载的组件可使用异步组件的方式来加载。
```
Vue.component('async-example', function (resolve, reject) {
   // 这个特殊的 require 语法告诉 webpack
   // 自动将编译后的代码分割成不同的块，
   // 这些块将通过 Ajax 请求自动下载。
   require(['./my-async-component'], resolve)
})
Vue.component(
  'async-webpack-example',
  // 该 `import` 函数返回一个 `Promise` 对象。
  () => import('./my-async-component')
)
const AsyncComp = () => ({
  // 需要加载的组件。应当是一个 Promise
  component: import('./MyComp.vue'),
  // 加载中应当渲染的组件
  loading: LoadingComp,
  // 出错时渲染的组件
  error: ErrorComp,
  // 渲染加载中组件前的等待时间。默认：200ms。
  delay: 200,
  // 最长等待时间。超出此时间则渲染错误组件。默认：Infinity
  timeout: 3000
  
})
Vue.component('async-example', AsyncComp)
```

网络优化
- 浏览器对同一时间针对同一域名下的请求有一定数量限制（一般是6个），超过限制数目的请求会被阻塞。首屏尽可能减少同域名的请求，包括接口和js

### 5.组件编写要点
- 单个根元素
- data必须是一个函数
- 通过 props 向子组件传递数据
- 子组件通过 $emit 触发事件并传递数据，父组件通过 v-on 监听该事件并接收数据
- 如果想要在组件标签内部增加内容，使用 slot 标签
说说你对组件化的理解？
组件化最重要的两个步骤就是对组件进行封装以及组件复用。在封装过程中，我们将组件的视图，数据以及处理逻辑封装起来，在进行复用时，只需传入所需的 props 即可。一个组件封装好之后可以使用一千遍，一万遍，减少了工作量。修改时修改这一处即可。
### 6.vue-router 原理
vue-router 是 vue 当中提供前端路由的一个插件，本质上就是监听 URL 的变化，然后匹配路由规则，最后在无需刷新的情况下显示响应的页面。
使用 vue-router 之前，首先通过 import 将 VueRouter 引入，然后调用 Vue.use() 对插件进行注册。Vue.use() 是 vue 中实现插件注册的地方，它判断传进来的插件是否具有 install 方法，有则调用，没有那么插件本身就该是个 function，则回去调用这个 function，并且将 Vue 作为第一个参数传入，这样在插件中可以直接使用 Vue，避免引入增大包体积。
VueRouter 在 install 方法会调用 Vue.mixin 全局混入 beforeCreate 和 destroy 钩子函数，并且全局注册 router-view 和 router-link 组件。
然后进入 VueRouter 实例化阶段，在 VueRouter 构造函数中，首先会调用 createMatcher 生成路由匹配对象 matcher，然后根据不同的 mode 采取不同的路由方式，createMather 会返回一个对象，其中具有 match 和 addRoutes 方法，同时会调用 createRouteMap 生成路由映射表 pathList，pathMap，nameMap，match 和 addRoutes  通过闭包的方式使用这几个对象。
根组件初始化过程中，会调用全局混入的 beforeCreate 方法，在其中会执行 init 去初始化路由，路由的初始化核心就是进行路由的跳转，然后改变 URL 渲染对应的组件。
路由跳转主要通过 transitionTo 函数来实现，首先会调用 match 方法获取匹配的路由信息，这些路由信息都保存在上面创建的路由映射表当中，路由匹配结束后，继续执行 confirmTransition 确认切换路由，这里面会通过对比路由解析出 可复用组件，需要渲染的组件以及失活的组件，这些组件分别对应不同的导航守卫，首先会执行失活的组件钩子，然后执行全局的 beforeEach 钩子，然后在当前路由改变，但是组件被复用时调用 beforeRouteUpdate，然后调用需要渲染组件的 enter 守卫钩子，解析异步组件，调用 beforeRouteEnter，beforeResolve，afterEach，触发组件渲染，结束。
### 7.vuex 解决了什么，有哪些模块？
Vuex 是专门为 Vue.js 设计的**状态管理库**。当多个组件共享状态时，如果这个状态是放在组件里的，那么当有其他视图依赖这个状态，参数的传递很繁琐；或者是多个视图操作都会修改这一个状态，会导致我们在不同的组件里写很多重复的代码，使代码的可维护性降低。因此我们可以利用 vuex 将共享的状态抽取出来，在全局下进行管理。
主要有以下几个模块：
- state。是一个数据源
- mutations。当需要更改state中的状态时，可以在 mutations 中注册回调函数，并且通过 store.commit 方式来进行触发
- actions。类似于 mutations，但是它可以包含异步操作，并且不是直接操作 state，而是通过 store.commit 触发 mutations 来变更。action 通过 store.dispatch 触发。
- getters。类似于 computed，当多个组件需要用到同一个值时，可以定义 getter，getter 的返回值会根据他的依赖被缓存下来。

如果应用本身很简单的话，使用 vuex 就有点小题大做了。
### 8.介绍一下你所做过的项目。
（项目原理+技术难点+如何攻克难题）
（我做了什么业务？使用了什么技术？遇到了什么问题？最大收获是什么？可以旁敲侧击提一下自己的团队协作能力是杠杠的）
我在实习的过程中和其它开发人员一起开发公司项目，是一个重症病人监护系统。我负责的模块是测评模块，它的主要功能就是提供不同的测试表单给病人，将测试结果以表格（想了一下还是不说图表了，毕竟我对echarts连了解都说不上，何必给自己挖坑）的形式反馈给用户。
### 9.你在项目中遇到的最大的困难是什么？是怎么解决的？
说来这个模块也很简单哈，就是表单控件的组合，填写完表单把结果发给后台，然后再从后台拿到这个病人单项测试结果和所有测评结果放到页面上。不过开发时间还是比较长，得有一个月的样子。公司那个时候忙于上一个项目的交接，就让我慢慢做。我也是第一次接触 vue 嘛，到公司现学，大概用了两周的时间，先是看文档，把文档里面的demo都敲了一遍，然后就是研究公司的上一个项目，拿出一个核心模块研究语法呀，组件通信啊，vue-router 的使用啊等等。然后第三周就开始做我的测评模块，您知道嘛，看是一回事，敲又是一回事，中途踩了挺多坑的，不过做完之后成就感蛮高的哈。
这算是我第一次比较全面的去了解一个框架，然后把这个框架中常用的功能都用了一遍。整个过程中其实没有什么技术上的难点，难的地方在于将自己用掉的时间价值化，比如我学了vue，那么我就把模块做出来；我碰到了父子组件通信的问题，那么我就要上网找资料把这个问题解决掉；我写完了代码，我还要思考怎么才能让代码看起来更优雅。。。等等等等。一直不停地学习，这件事本身就是最困难的。我还是很感谢这段实习经历，培养了我自主学习的习惯。你可能短时间感觉不到学习这些东西给你带来了什么变化，因为学习本身就是一个不断积累的过程，但肯定会有一天你会对一知半解的东西茅塞顿开。举个我自己的例子嘛，我实习的时候负责的模块需要写一大堆表单，有表单就免不了表单验证，element-ui 提供了简便的表单验证的方法，但是因为我负责的表单当中还有一些逻辑验证的地方，比如说病人填写了这个评估项之后，我们需要根据病人填写的答案来开放后续的表单项，这时就需要把内容提取出来验证了，表单验证最常用的就是使用正则表达式。（此处就省略了，讲自己用函数柯里化处理正则的例子）
element-ui 中也有消息提示控件，在页面上方居中显示，并且最后弹出的消息框会覆盖之前的消息框。后来有一天我看在 vscode 当中写代码时好像是环境出了点问题，右下角弹出了好几个消息框告诉我哪里出错了，我发现它的消息框是一个接一个显示在屏幕上，并且后出现的消息位置位于先出现的消息框上方。我就想，对呀，当用户操作出错了并且我们希望将所有错误指出来告诉用户的时候，element-ui 那样覆盖式的消息框就不再符合需求了。因此我自己上网找各种示例研究了一下，最终总结出一个将消息框封装为插件进行使用的方法。blablabla
### 10.你最有成就感的一件事是什么？
我大二的时候参加过一个项目，就是大创，大学生创新与创业。那个时候我其实啥也不会，也不知道为啥就报名了。然后每个团队最少要三个人，我就找了我们班很厉害的两个男生跟我一起组队了。这个项目是每个小组要自己或者跟指导老师商定一个选题，然后为期一年，一年之后根据项目的完成程度来评定等级。我啥也不会啊，也不知道做啥，那两个男生平时很忙，在老师实验室帮忙做项目，所以我们立完题目之后就没什么进展了。直到十个月过去了，老师开始问我项目进展怎么样，可以开始准备结题材料，演讲PPT之类的，然后我立马找到那两个男生说无论如何都得做出来了，他俩说不着急。我们立项的题目是要做一个app，面向大学生，可以在里面提问啊，讨论啊之类的，还有一个很厉害的功能就是老师可以直播讲课，因为如果学生有疑问每次都要等到下一次上课再问老师就不太方便，老师就可以在家里开一个答疑课之类的。他俩说这都比较简单，很快就能做出来，我说那行，那咱就开始做。我就每天督促着，看他俩一步一步把这个app完成，特别佩服他们，就想大家都是一起考进来的，两年时间差别就这么大了。我自己就想过去这两年多到底干了啥，也没想出个名堂。最后结题了，需要在老师们面前做一个报告，因为我是负责人，所以肯定是我上，他们就把这个app怎么做啊用了什么技术都告诉我，我总结了一下就去讲了，给老师展示我们做的app，特别炫耀了一下直播功能，老师都觉得 诶，还不错。在座的老师有我们专业的老师嘛，也认识我们，出来都说项目做的不错，我当时特别高兴，虽然不是我做的，但是，与有荣焉！但是最后我们也没有被评上国家级项目，因为确实有比我们更好的嘛，不过我真的很满足了。那算是我大学以来第一次很认真的去做一件事（虽然是后面才开始的）并且也收到了满意的结果，也算是我大学的一个转折点吧，那之后我就开始思考我到底要做什么，我学前端也是听了其中一个男生的建议嘛，接触之后觉得居然还挺感兴趣，然后就学到现在。所以一想到这件事我就觉得很有成就感，不仅仅说是做成了一件事得到了认可，最重要的我通过这件事找到了一直缺失的目标，是一种自我完善。
### 11.参加过的项目组成，队伍结构以及你的角色。
（如果直接被问到项目，可以先回答这个再继续说项目）我实习的地方是个小的创业公司，总共加起来也就十几个人。我们的开发团队一共有五个人，由两个前端人员和两个后端人员以及一个设计人员组成。我和另一位前端人员一起开发项目的前端部分，每个人分有不同的模块。
### 12.vue的三要素（vue 中是如何实现 MVVM 的）
- 响应式。监听到数据的变化
- 模板引擎。vue 的模板如何被解析，指令如何处理
- 渲染。vue 的模板如何被渲染成 html

vue 中如何实现响应式？
以 data 属性为例。响应式就是当我们在 JS 中修改了 data 中的数据时，会将这个变化显示到页面上。将 data对象 变为响应式对象这个过程首先从 initState 开始。这个函数中对data， props， methods， computed， watch等等进行了初始化。data 的初始化发生在 initData 当中，首先会对data 中的每一个 key 调用自定义的 proxy 方法，这个方法就是利用 Object.defineProperty 将 vm._data 上的属性代理到 vm 上，这就是我们为什么在模板中书写方法时可以通过 this.xxx 拿到定义在  data 上面的属性。
调用完 proxy 之后回到 initData 函数中，继续调用 observe 函数，对整个 data 属性进行 observe。这个 observe 方法的作用就是给非 vnode 类型的对象添加一个 Observer ，这个 Observer 是一个类，它的作用就是去遍历这个对象，然后对每个 key 调用 defineReactive 添加 getter 和 setter。如果当前 key 是一个数组，就会去递归地调用 observe 方法，继续处理数组中的每一项。
然后来介绍 defineReactive，这个方法中首先对当前数据添加一个 dep 属性，然后对它的子对象递归调用 observe，这样不管对象的结构多复杂，它的所有子属性也能变成响应式的对象。然后就会去给这个属性添加 getter 和 setter。
getter 的触发时机发生在渲染的过程当中，当我们调用 render 函数去渲染时，会有一个 new Vnode 的过程，在这个过程我们需要拿到当前依赖的数据，这时就会触发 getter。getter 执行的是一个依赖收集的过程：首先判断 Dep.target 是否存在，这个 Dep.target 属性值是一个 watcher，表示当前发生渲染动作的这个 watcher，这时全局唯一 watcher，因为在同一时间只能有一个全局的 watcher 被计算，它利用一个队列来保持状态，当前 watcher 渲染结束，就会把这个 watcher pop 出来，回到上一个状态。如果当前 Dep.target 存在（Dep.target 属性是在执行 watcher.get 时进行赋值的），就会去执行 dep.depend(), 这个 dep 是我们刚才进入 defineReactive 时定义的，在这里我们利用闭包拿到了这个 dep，这个 dep 有一个 subs 数组，实际上就是一个 watcher 的管理，dep.depend 方法就是把这个 dep 加入到当前 watcher 中。如果具有子对象的话，也会去触发子对象的 dep.depend 方法。
刚刚我们说到 watcher，可以介绍一下 watcher 的作用，它在依赖收集的过程中很重要。渲染 watcher 是在 mountComponent 中定义的，并且传入了 updateComponent 作为参数，它其中也有和 Dep 相关的属性，分别为 两个数组 deps， newDeps 和 两个 set 结构 depIds 和 newDepIds，数组用于存放 dep 实例，set 用来存放这些 dep 的 ID 值，dep 代表上一次收集的依赖，newDeps 代表这次收集的依赖。我们刚刚执行的 dep.depend 实际就是执行了 watcher.addDep 方法, 这个 addDep 就是将 dep 实例加入到 newDeps 和 newDepIds 中，如果这个 watcher 是首次订阅该数据，会向dep 的sub 数组里push进这个 watcher。当我们收集完依赖之后，会执行 popTarget 将 Dep.target 恢复成上一个状态，然后执行 cleanupDeps 清空依赖，这就是为什么需要 deps 和 newDeps 两个数组的原因。比如我们用 v-if 和 v-else 来控制视图的切换，当我们切换到 v-else 时是需要清空掉对 v-if 的依赖的，不然如果我们进行一些对 v-if视图依赖数据有影响的 操作时，同样会触发视图的更新，造成性能损失。这里的清空依赖就是判断 dep 中是否存在 newDep 里没有的实例，如果有的话就要清除掉。最后将 newDeps 和 newDepIds 赋值给 deps 和 depIds并且清空 newDeps 和 newDepIds。这个时候依赖收集就完成了。
我们对数据进行修改的时候，会触发它的 setter，这时候就开始派发更新过程。在 setter 中首先会判断新值和旧值是否相等，如果不同才进行更新过程。更新是通过调用 dep.notify 进行的，这函数逻辑很简单，就是拿出 dep 实例的 subs 属性，里面存放的都是订阅了该属性的 watcher，然后一一执行 watcher.update，<span style="text-decoration: line-through">vue 不会在每次数据改变都触发 watcher 的回调，而是先把 添加到一个队列里，然后在 nextTick 之后再执行</span>。我们会对 queue 中的 watcher 进行排序，确保先执行父组件的watcher 再执行子组件的watcher，并且用户自定义的 watcher 要先于渲染 watcher 执行。排序后就会去执行 watcher.run 方法，这个方法就是去执行 watcher.get 方法，然后执行我们在 mountComponent 里传入的 updateComponent 方法，去触发组件的重新渲染。


编译过程我不是太了解，大概是是解析 template 字符串，识别它里面的标签，属性等等，然后生成一棵 AST 树。最后深度遍历这棵树根据不同的条件生成不同的代码。

`渲染最开始是从 new Vue() 进行的，会在里面调用 init 方法，init 方法中是一系列的初始化，首先会调用 mergeOptions 将 new Vue 时的参数赋值到 vm.$options 上，然后进行生命周期、事件中心、数据等等的初始化，在初始化数据 (initState) 前后分别调用了 beforeCreate 和 created 钩子函数，这也是为什么在 beforeCreate 中无法访问到数据而 created 可以访问到的原因。init 函数的最后调用 $mount 执行挂载，$mount 中主要就是将 template 转换成一个 render 函数，因为后面我们需要用这个 render 函数生成节点。之后进入 mountComponent，在函数的一开始会将 el(new vue 时传的那个) 赋值给 vm.$el，然后调用 beforeMount 钩子函数，不过这时钩子函数访问到的 $el 是挂载前的元素，然后定义一个 updateComponent 方法，并生成一个渲染 watcher ，将 updateComponent 作为参数传入，在 watcher 的生成过程中调用 updateComponent，这个函数主要有两个逻辑，首先会执行 render 函数生成 vnode，因为是递归进行的，所以最后会生成一棵 vnode 树，并且将根节点返回进入第二个逻辑，update 函数当中。update 函数最主要的逻辑就是执行一个 patch 方法，这里首次渲染和更新时调用 patch 方法传递的参数不同，我们这里先说首次渲染，就是通过 createElm 去生成 vnode 对应的 dom 节点，也会递归地去检查子元素，首先生成子元素的 dom 节点，然后插入到父元素中，最后插入到 body 上显示到页面中。最后会删除掉替换的元素，回到 update 函数中，vm.$el 被赋值为根dom元素。然后回到 mountComponent 函数中，调用 mounted 钩子函数，在这个钩子函数中访问到的 $el 就是挂载上去的元素了。整个渲染过程到这里也就差不多了。`

### 13.介绍一下 MVC，MVVM 的区别
* MVC  Model-View-Controller。用户可以通过 View（点击按钮触发事件）或者Controller（输入URL）来触发 model 的变化，最后反映在 view 中
* MVVM 由 MVC 发展而来。
* MVVM Model-View-ViewModel。ViewModel 是连接 Model 和 View 的一个桥梁，View通过事件监听来操作 Model，Model 通过数据绑定来操作 View
### 14.vue 中组件通信的方式
vue中的组件通信主要发生在父子组件和非父子、兄弟组件中。
父组件向子组件传递数据主要通过 props 属性；在父组件中还可以通过 `$children` 访问到子组件；
子组件向父组件传递数据通过 `$emit` 触发事件，并将要传递的参数传入 `$emit` 当中；子组件中同样可以通过 `$parent` 访问到父组件；
非父子组件以及兄弟组件之间的通信需要用到一个 bus（是一个 vue 实例）
```
...
import Vue from 'vue'
const bus = new Vue()
export default bus
...
...
bus.$on('clickMe', function(data) {})
...
...
bus.$emit('clickMe', data)
```
大量数据可以使用vuex
PS：想要在父组件中调用子组件的方法，可以在子组件标签上添加 ref 属性，然后在父组件中使用 $refs 就可以对其进行调用并操作它的方法
### 15. vnode是什么？为什么要使用 vnode？
vue 中用对象的语法来抽象dom节点，这就是 vnode。目的是为了解决操作 dom 节点带来的性能问题。我们用一颗虚拟dom 树来模拟 dom tree，不管是新增，删除还是修改都在这颗树上进行。并且修改时还采用了 diff 算法找到需要修改的最小单位，大大减少了dom操作，可以提升性能
### 16. 介绍一下 vue 的生命周期
`vue 中的生命周期主要有 beforeCreate， created， beforeMount， mounted， beforeUpdate， updated， beforeDestroy， destroyed。
beforeCreate 和 created 发生于 vue 的 init 方法中，该方法主要是进行各种初始化，对于 data， props， methods 等等进行初始化的过程发生在 initState 过程当中，而 beforeCreate 和 created 分别发生于 initState 函数的前后，这也是为什么在 beforeCreate 中拿不到 data 而 created 可以的原因，不过因为此时元素还没有进行挂载，所以都拿不到 $el。
beforeMount 和 mounted 发生于 mountComponent 当中，在执行 beforeMount 之前，vm.$el 被赋值为将要被替换的元素,(比如说我们通过 new Vue 进行调用时，el 属性指向的元素就是要被替换的元素)，因此在 beforeMount 中拿到的 $el 并不是最后挂载上去的元素。执行完一系列 vnode 创建以及 dom 元素挂载之后回到 mountComponent，在函数的最后会调用 mounted 钩子函数，此时访问 $el 就是我们挂载上去的元素了。不过这是通过 new Vue进行初次渲染时 mounted 的执行时机，对于组件来说，它的 mounted 发生在 patch 函数中，这个函数主要将 dom 元素挂载到屏幕上，在函数的最后会执行一个 invokeInsertHook 函数，在这个函数中会执行 mounted 钩子函数。因为我们对 dom 元素的插入是先子后父的，因此 mounted 函数的执行也是先子后父的。
beforeUpdate 和 updated 发生于数据更新的时候。我们在 mountComponent 函数中声明了一个渲染 watcher，并且给它传入了一个 before 函数作为参数，而这个 before 函数中就是对 beforeUpdate 钩子函数的调用。before 函数的调用发生于 flushSchedulerQueue 函数中（如果想再讲详细点可以扯到 vue 中实现异步更新的机制 nextTick），更新结束之后回去执行 updated 钩子函数。
beforeDestroy 和 destroyed 发生在 $destroy 函数中。当组件被销毁时会执行 $destroy 方法，这个方法一开始会先调用 beforeDestroy 钩子函数，然后再进行，比如说删除节点啊，删除节点的 watcher 啊，移除对该组件数据的响应式等等，最后会调用 destroyed 钩子函数。`
## 面试手写代码题
见demo/needToBePosted/interviewPrepare
## ES6 相关
### 1.说一说你对ES6有哪些了解
- 新的变量声明方式 let/const。不再进行变量提升，并且拥有块级作用域。我们常常使用let来声明一个值会被改变的变量，而使用const来声明一个值不会被改变的变量，也可以称之为常量。
- 箭头函数。箭头函数没有自己的 this，它在被定义时所处的对象就是它的this。并且不能访问 arguments 对象。
- 模板字符串。解决用 + 连接字符串的问题。
- 解构赋值。
- 函数参数的默认值。
- 扩展运算符。
- class。构造函数的语法糖，可以通过 extends 来实现继承。
```
class A {
  constructor (name, age) {
    this.name = name
    this.age = age
  }
  getName () {
    return this.name
  }
}

class B extends A {
  constructor (name, age, sex) {
    super(name, age)
    this.sex = sex
  }
}
```
- promise
- ES7 里面的 async, await 本质上也是 promise的语法糖
- symbol。是一种新的原始数据类型，表示独一无二的值。可以作为属性名防止冲突。
- set 和 map 数据结构。set 类似数组，不过里面存放的是不重复的数据。（可以通过 Array.from 将 set 转换为数组，还能达到数组去重的目的）。map 类似于对象，是键值对的集合，不过它的键名不限于字符串，可以是各种类型。
## CSS 相关
### 1. 两/三栏自适应布局
[三栏自适应布局](https://app.yinxiang.com/shard/s50/nl/21169266/1eeb7332-570b-4b8c-822a-2d23ba8ab394?title=%E4%B8%89%E6%A0%8F%E8%87%AA%E9%80%82%E5%BA%94%E5%B8%83%E5%B1%80)
[两栏自适应布局](https://app.yinxiang.com/shard/s50/nl/21169266/e28df36c-ba0e-4e16-9bf4-1ddca6b5c71c?title=%E4%B8%A4%E6%A0%8F%E8%87%AA%E9%80%82%E5%BA%94%E5%B8%83%E5%B1%80)
### 2.flex 布局
[Flex](https://app.yinxiang.com/shard/s50/nl/21169266/b1753129-9bd7-48f7-9342-5e83e3196e4b?title=Flex)
### 3.常考属性参数
position: 
- staic。静态定位 top值无效。
- relative。移动的时候会包括margin。
- absolute。移动的时候会包括margin。
- fixed。固定定位的margin也会生效  移动的时候也会包括margin。
- sticky(浏览新闻的时候，往下拉页面，题目滚到顶部会“黏”在那里)。元素未滚动，在当前可视区域他的top值不生效，只有margin生效，滚动起来后margin失效，top值生效。

display(有很多，这里写点用的比较多的就行)：
- none
- inline-block
- block
- table-cell
- flex
- inline-flex
- list-item
- grid

盒模型分为 IE 模型和标准模型。标准模型表示元素的height，width只包含content，不包含 border 和 padding；而 IE 盒模型 表示元素的 height 和width 包括 content，padding 和 border，我们可以通过 box-sizing 属性进行一个统一。
box-sizing: 
- content-box  是默认值。如果你设置一个元素的宽为100px，那么这个元素的内容区会有100px宽，并且任何边框和内边距的宽度都会被增加到最后绘制出来的元素宽度中。
- border-box 告诉浏览器去理解你设置的边框和内边距的值是包含在width内的。也就是说，如果你将一个元素的width设为100px,那么这100px会包含其它的border和padding，内容区的实际宽度会是width减去border + padding的计算值。大多数情况下这使得我们更容易的去设定一个元素的宽高。
## web安全和跨域
### 1.xss 和 csrf 攻击原理和防范方式
**XSS：**(cross-site scripting)跨域脚本攻击。通过向页面注入脚本。例如评论区，向其中注入js来进行攻击。可以通过以下措施进行防御
- 对用户的输入进行编码解码，转义输入输出的内容，对引号，尖括号，斜杠等进行转义
- 过滤掉\<script>, \<img>, \<a> 等

**CSRF**(Cross-site request forgery)跨站请求伪造。是利用用户的登录状态发起恶意请求。(用户为网站A的合法用户并登陆过，用户进入网站B时，其内可能有一个伪造链接指向A，用户点击该链接之后，网站A确认用户身份，下发 cookie，此时B网站就能获取到该cookie了。)可通过以下措施进行防御
- Token 验证。CSRF 之所以能够成功是因为可以完全伪造用户的信息，这些信息都来自 cookie，那么只要通过一个无法伪造的 token 来进行防御即可。
- Referer 验证。页面来源验证。
### 2.jsonp、 cors、 websocket、 iframe、 proxy
>由于浏览器同源策略，凡是发送请求url的协议、域名、端口三者之间任意一与当前页面地址不同即为跨域。存在跨域的情况：
- 网络协议不同，如http协议访问https协议。
- 端口不同，如80端口访问8080端口。
- 域名不同，如qianduanblog.com访问baidu.com。
- 子域名不同，如abc.qianduanblog.com访问def.qianduanblog.com。
- 域名和域名对应ip,如www.a.com访问20.205.28.90.

解决方式有如下几种：
1. JSONP。通过动态插入一个script标签来实现。因为浏览器对script的资源引用没有同源限制，同时资源加载到页面后会立即执行（没有阻塞的情况下）。请求过程：
首先客户端定义一个 callback，然后将 callback 的名字与 src 属性对应的 url 拼接，就可以将这个回调函数的名字传递到服务器上，服务器接受到这个名字后，会在 callback 后面拼接上一个调用（也就是一对小括号）返回给客户端，并且将返回的 json 数据作为参数传递到这个 callback 中，此时客户端就可以执行这个 callback，达到跨域的目的。
缺点是只能支持 get 方法(因为是将参数放到url中的)
```
// 自己封装 jsonp 实现
function jsonp(url, jsonpCallback, success) {
  let script = document.createElement('script')
  script.src = url + jsonpCallback
  script.async = true
  script.type = 'text/javascript'
  window[jsonpCallback] = function(data) {
    success && success(data)
  }
  document.body.appendChild(script)
}
jsonp('http://xxx', 'callback', function(value) {
  console.log(value)
})
```
2. CORS(Cross-Origin Resource Sharing)
CORS 需要浏览器和后端同时支持。
浏览器会自动进行 CORS 通信，实现 CORS 通信的关键是后端。只要后端实现了 CORS，就实现了跨域。
服务端设置 Access-Control-Allow-Origin 就可以开启 CORS。 该属性表示哪些域名可以访问资源，如果设置通配符则表示所有网站都可以访问资源。
浏览器将CORS请求分成两类：简单请求（simple request）和非简单请求（not-so-simple request）。
只要同时满足以下两大条件，就属于简单请求。
<dl>
<dt>1.请求方法是以下三种方法之一：</dt>
<dd>HEAD</dd>
<dd>GET</dd>
<dd>POST</dd>
</dl>
<dl>
<dt>2. HTTP的头信息不超出以下几种字段：</dt>
<dd>Accept</dd>
<dd>Content-Language</dd>
<dd>Accept-Language</dd>
<dd>Last-Event-ID</dd>
<dd>Content-Type：只限于三个值application/x-www-form-urlencoded、multipart/form-data、text/plain</dd>
</dl>
凡是不同时满足上面两个条件，就属于非简单请求。浏览器对这两种请求的处理，是不一样的。
对于简单请求，浏览器直接发出CORS请求。就是在头信息之中，增加一个Origin字段。Origin字段用来说明，本次请求来自哪个源（协议 + 域名 + 端口）。服务器根据这个值，决定是否同意这次请求。如果不同意则会被 onerror 捕获，如果同意则服务器的响应中会多出Access-Control-Allow-Origin（表示接受请求的origin），Access-Control-Allow-Credentials（表示是否允许发送 cookie），Access-Control-Expose-Headers（如果想拿到特殊的header字段，需要在这里指定），后两个可选。  

如果不是简单请求，会在正式通信之前，增加一次HTTP查询请求，称为"预检"请求（preflight），"预检"请求用的请求方法是OPTIONS，表示这个请求是用来询问的。头信息里面，关键字段是Origin，表示请求来自哪个源。还包括Access-Control-Request-Method（表示CORS请求会用到哪些方法），Access-Control-Request-Headers（指定CORS请求会额外发送的头信息）。服务器收到"预检"请求以后，检查了Origin、Access-Control-Request-Method和Access-Control-Request-Headers字段以后，确认允许跨源请求，就可以做出回应。  
```CORS 跟jsonp 相比支持更多的请求方法，但是 JSONP 可以支持更多的浏览器。```
3. porxy代理。
定义和用法：proxy代理用于将请求发送给后台服务器，通过服务器来发送请求，然后将请求的结果传递给前端。
实现方法：通过nginx代理；
注意点：1、如果你代理的是https协议的请求，那么你的proxy首先需要信任该证书（尤其是自定义证书）或者忽略证书检查，否则你的请求无法成功。
4. postMessage。
postMessage是HTML5新增的一项功能,通常用于获取嵌入页面中的第三方页面数据。一个页面发送消息，另一个页面判断来源并接收消息。
```
// 发送消息端
window.parent.postMessage('message', 'http://test.com')
// 接收消息端
var mc = new MessageChannel()
mc.addEventListener('message', event => {
  var origin = event.origin || event.originalEvent.origin
  if (origin === 'http://test.com') {
    console.log('验证通过')
  }
})
// 下边那行p不知道哪里来的ORZ
```
5. websocket
该协议不实行同源政策，只要服务器支持，就可以通过它进行跨源通信。
## 一些杂七杂八的问题
### 1.spa（single page application）相关
减少首屏加载时间和白屏问题可从以下几个方面进行：
1. 利用异步加载方式，在路由注册时提供异步拉取组件的方法，仅在需要进入对应路由时，对应组件才会被加载进来。
2. 打包公共代码，减少代码体积。（webpack4 中用的是splitChunks）
3. 预加载（然而我并不知道怎么进行预加载）预加载简单来说就是将所有所需的资源提前请求加载到本地，这样后面在需要用到时就直接从缓存取资源。
4. 使用gzip减小网络传输的流量大小
5. 服务端渲染（可以在后台的 Node.js 环境中完成渲染逻辑，然后将 HTML 视图直接返回给客户端。）
6. 预渲染。利用 webpack 的插件 prerender-spa-plugin，构建阶段生成匹配预渲染路径的 html 文件。构建出来的 html 文件已经有静态数据。
7. 添加loading组件
### 2.websocket
**WebSocket**是HTML5新增的协议，利用了HTTP协议来建立连接，目的是在浏览器和服务器之间建立一个不受限的双向通信的通道。HTTP协议是一个请求－响应协议，请求必须先由浏览器发给服务器，服务器才能响应这个请求，再把数据发送给浏览器。换句话说，浏览器不主动请求，服务器是没法主动发数据给浏览器的。所以，HTML5推出了WebSocket标准，让浏览器和服务器之间可以建立无限制的全双工通信，任何一方都可以主动发消息给对方。安全的WebSocket连接机制和HTTPS类似。首先，浏览器用```wss://xxx```创建WebSocket连接时，会先通过HTTPS创建安全的连接，然后，该HTTPS连接升级为WebSocket连接，底层通信走的仍然是安全的SSL/TLS协议。

**服务器推送**（server push）指的是，还没有收到浏览器的请求，服务器就把各种资源推送给浏览器。
比如，浏览器只请求了index.html，但是服务器把index.html、style.css、example.png全部发送给浏览器。这样的话，只需要一轮 HTTP 通信，浏览器就得到了全部资源，提高了性能。

**轮询**是指客户端每隔一段时间就发送一个请求到服务端，查看是否有更新。缺点是频繁的请求会给服务器造成一定的压力。
**长轮询**客户端在发起一次请求后立即挂起，一直到服务器端有更新的时候，服务器才会主动推送信息到客户端。 在服务器端有更新并推送信息过来之前这个周期内，客户端不会有新的多余的请求发生，服务器端对此客户端也啥都不用干，只保留最基本的连接信息，一旦服务器有更新将推送给客户端，客户端将相应的做出处理，处理完后再重新发起下一轮请求。缺点是因为请求一直挂起而不做事情，浪费了服务器的资源。
### 浏览器缓存策略
[session 和 cookie 区别](https://app.yinxiang.com/shard/s50/nl/21169266/600d24eb-3919-4c31-8c0d-ebf58f445086?title=session%20%E4%B8%8E%20cookie%20%E7%9A%84%E6%AF%94%E8%BE%83)
[cookie, localStorage, sessionStorage 区别](https://app.yinxiang.com/shard/s50/nl/21169266/63532114-1575-4d5e-b6dc-144cce44bf8a?title=cookie%20%E4%B8%8E%20localStorage%E3%80%81%20sessionStorage)
### 3.操作系统相关
<span style="font-weight: bold">进程和线程：</span>官方的说，进程是资源分配的最小单位，线程是cpu调度的最小单位。通俗一点说，进程是运行中的程序，线程是进程的内部的一个执行序列。(进程是资源分配的单元，线程是执行单元。进程间切换代价大，线程间切换代价小。进程拥有资源多，线程拥有资源少。多个线程共享进程的资源)举个例子说，
开个QQ，开了一个进程；开了迅雷，开了一个进程。在QQ的这个进程里，传输文字开一个线程、传输语音开了一个线程、弹出对话框又开了一个线程。所以运行某个软件，相当于开了一个进程。在这个软件运行的过程里（在这个进程里），多个工作支撑的完成QQ
线程之间共享的资源有 堆，全局变量，静态变量，文件等公共资源
不共享的资源有栈和寄存器
**进程的调度：**<span style="border-bottom: 1px solid #000">先来先服务</span> <span style="border-bottom: 1px solid #000">最短作业优先</span> <span style="border-bottom: 1px solid #000">最高响应比优先</span> <span style="border-bottom: 1px solid #000">时间片轮转</span>
**进程的通信方式：**<span style="border-bottom: 1px solid #000">管道</span> <span style="border-bottom: 1px solid #000">命名管道</span> <span style="border-bottom: 1px solid #000">信号量</span> <span style="border-bottom: 1px solid #000">消息队列</span> <span style="border-bottom: 1px solid #000">信号</span> <span style="border-bottom: 1px solid #000">共享内存</span> <span style="border-bottom: 1px solid #000">套接字</span>
**线程的调度：** <span style="border-bottom: 1px solid #000">时间片方式</span> <span style="border-bottom: 1px solid #000">非时间片方式</span> 
**线程的通信方式：**<span style="border-bottom: 1px solid #000">锁机制</span> <span style="border-bottom: 1px solid #000">信号量机制</span> <span style="border-bottom: 1px solid #000">信号机制</span>


>**死锁**：操作系统中有若干进程并发执行，它们不断申请、使用、释放系统资源，虽然系统的进程协调、通信机制会对它们进行控制，但也可能出现若干进程都相互等待对方释放资源才能继续运行，否则就阻塞的情况。此时，若不借助外界因素，谁也不能释放资源，谁也不能解除阻塞状态。根据这样的情况，*操作系统中的死锁被定义为系统中两个或者多个进程无限期地等待永远不会发生的条件，系统处于停滞状态，这就是死锁*。

产生死锁的必要条件：
1. 互斥条件：一个资源每次只能被一个进程使用。
2. 请求与保持条件：一个进程因请求资源而阻塞时，对已获得的资源保持不放。
3. 不剥夺条件:进程已获得的资源，在末使用完之前，不能强行剥夺
4. 循环等待条件:若干进程之间形成一种头尾相接的循环等待资源关系。 

这四个条件是死锁的必要条件，只要系统发生死锁，这些条件必然成立，而只要上述条件之一不满足，就不会发生死锁。

对待死锁的策略主要有：
1. 死锁预防：破坏导致死锁必要条件中的任意一个就可以预防死锁。例如，要求用户申请资源时一次性申请所需要的全部资源，这就破坏了请求与保持条件；将资源分层，得到上一层资源后，才能够申请下一层资源，它破坏了环路等待条件。预防通常会降低系统的效率。
2. 死锁避免：避免是指进程在每次申请资源时判断这些操作是否安全，例如，使用银行家算法。死锁避免算法的执行会增加系统的开销。
3. 死锁检测：死锁预防和避免都是事前措施，而死锁的检测则是判断系统是否处于死锁状态，如果是，则执行死锁解除策略。
4. 死锁解除：这是与死锁检测结合使用的，它使用的方式就是剥夺。即将某进程所拥有的资源强行收回，分配给其他的进程。

**内存管理**
内存管理主要策略是分页和分段。
分页就是将进程的逻辑地址空间分成若干大小相等的片（即页），然后装入内存。程序加载时，可以将任意一页放入内存中任意一个帧，这些帧不必连续，从而实现了离散分离。页式存储管理的优点是：没有外碎片（因为页的大小固定），但会产生内碎片（一个页可能填充不满）。
分段就是用户可以把自己的作业按逻辑关系划分为若干个段，每个段都是从0开始编址，并有自己的名字和长度。这就相当于程序里边的主函数段、各个子函数段、数据段、栈段等等。段式管理的优点是：没有内碎片（因为段大小可变，改变段大小来消除内碎片）。但段换入换出时，会产生外碎片（比如4k的段换5k的段，会产生1k的外碎片）。
不同点：
- 大小不同：页的大小固定且由系统决定，而段的长度却不固定，由其所完成的功能决定；
- 地址空间不同： 段向用户提供二维地址空间；页向用户提供的是一维地址空间；
- 内存碎片：页式存储管理的优点是没有外碎片（因为页的大小固定），但会产生内碎片（一个页可能填充不满）；而段式管理的优点是没有内碎片（因为段大小可变，改变段大小来消除内碎片）。但段换入换出时，会产生外碎片（比如4k的段换5k的段，会产生1k的外碎片）。
[操作系统常见面试题-背诵](https://blog.csdn.net/justloveyou_/article/details/78304294)
### 4.设计模式
见 f:/demo/needTobePost/interviewPrepare
### 5.浏览器机制
异步，微宏任务，event-loop见原来的总结，一个就在needTobePost文件夹下面，一个在笔记里
[事件循环](https://app.yinxiang.com/shard/s50/nl/21169266/963bdece-6cee-449f-8a96-d405e53410d5?title=%E4%BA%8B%E4%BB%B6%E5%BE%AA%E7%8E%AF)
[向浏览器中输入一个地址后完整的HTTP请求步骤](https://app.yinxiang.com/shard/s50/nl/21169266/320f5900-a488-4737-bdff-eb0a941f9d5b?title=%E5%90%91%E6%B5%8F%E8%A7%88%E5%99%A8%E4%B8%AD%E8%BE%93%E5%85%A5%E4%B8%80%E4%B8%AA%E5%9C%B0%E5%9D%80%E5%90%8E%E5%AE%8C%E6%95%B4%E7%9A%84HTTP%E8%AF%B7%E6%B1%82%E6%AD%A5%E9%AA%A4)
[浏览器渲染过程](https://app.yinxiang.com/shard/s50/nl/21169266/871e3814-f101-4423-b082-2fd335e9416a?title=%E6%B5%8F%E8%A7%88%E5%99%A8%E6%B8%B2%E6%9F%93%E8%BF%87%E7%A8%8B)
### 6.前端优化
[前端优化](https://app.yinxiang.com/shard/s50/nl/21169266/c45a8014-1c5c-4988-91cc-c2f572054fc3?title=%E5%89%8D%E7%AB%AF%E4%BC%98%E5%8C%96)
