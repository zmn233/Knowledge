# 面试题（计算类）
## 1. [] == true 返回什么？
```
[] == true // false
```
解释：
这个问题涉及到相等运算符的强制转换机制。两边数据的类型相同时则直接比较；如果一边为 null 一边为 undefined 返回 true；如果一边为字符串一边为数字，则转换回数字比较；如果一边为 boolean，则转换为数字比较；如果一边为对象，则将其转换为原始值进行比较
该题中 true 为 boolean 类型，因此转换为数字之后是1，[] 为 object 类型，需要转换成原始值。（因为相等运算符是亲数字的），我们先调用 valueOf ，而数组的 valueOf 方法直接返回本身，因此再调用 toString，值为"",和1不相等，返回false。
<span style="color:red">**引申：**[] == false，而 !![] == true?</span>
!![]按照优先级会首先执行 !!,因此这个地方实际执行 !!(toBoolean([]))，按照规定，只有 false, 0, null, undefined, NaN, "" 为false，其余都为true，所以这个地方 toBoolean([]) 值为 true，两次取反值依然为 true。
## 2. JS中检测数据类型的方式
1. 使用 typeof
```
typeof 1 === 'number'
typeof 'abc' === 'string'
typeof true === 'boolean'
typeof NaN === 'number'
typeof function(){} === 'function'
typeof [] === 'object'
typeof {} === 'object'
typeof null === 'object'
```
2. 针对数组的判断可以使用
```
Array.isArray([]) // true
[] instanceof Array // true
[].__proto__.constructor === Array
```
3. 还有一种方法
```
Object.prototype.toString.call({})  // "[obejct Object]"
Object.prototype.toString.call([])  // "[object Array]"
Object.prototype.toString.call(function(){})  // "[object Function]"
Object.prototype.toString.call(1)  // "[object Number]"
Object.prototype.toString.call(true)  // "[object Boolean]"
Object.prototype.toString.call('')  // "[object String]"
Object.prototype.toString.call(NaN)  // "[object Number]"
Object.prototype.toString.call(undefined)  // "[object Undefined]"
Object.prototype.toString.call(null)  // "[object Null]"
```
## 3. CSS 中有哪些单位。
说一下我用过的就好了。em, rem(参照 html 元素), px, deg, s, vw, vh。
## 4. 如何求一个 0-100 的随机数
```
Math.random() * (100 - 0) + 0
```
## 5. 有哪些可替换元素
可替换元素就是浏览器根据元素的标签和属性，来决定元素的具体显示内容。
>例如浏览器会根据\<img>标签的src属性的值来读取图片信息并显示出来，而如果查看(x)html代码，则看不到图片的实际内容；又例如根据\<input>标签的type属性来决定是显示输入框，还是单选按钮等。
```(x)html中的<img>、<input>、<textarea>、<select>、<object>```都是替换元素。这些元素往往没有实际的内容，即是一个空元素。

x)html 的大多数元素是不可替换元素，即其内容直接表现给用户端（例如浏览器）。

<span style="font-weight: bold">引申：</span>
块级元素：在视觉上被格式化为块的元素，最明显的特征就是它默认在横向充满其父元素的内容区域（块级元素的流体特性），而且在其左右两边没有其他元素，即块级元素默认是独占一行的。块级元素中可以容纳其他块级元素或者行内元素。
典型的块级元素有：```<div>、<p>、<h1>到<h6>、<table>、<ul>```，等等。
浮动元素以及display属性为block、list-item的元素都是块级元素。
行内元素：行内元素不形成新内容块，即在其左右可以有其他元素，例如```<a>、<span>、<strong>```等，都是典型的行内级元素。 
几乎所有的可替换元素都是行内元素，例如```<img>、<input>```等等。行内元素只能容纳文本或者其他行内元素。
(img为什么可以设置宽高呢，因为它还是一个替换元素，替换元素一般是有内在尺寸的，设置img时如果不指定宽高，就会按照它的内在尺寸显示)
## 6.异步，同步，并行和串行
在我们执行一个函数的过程中，如果我们想去做另外一件事，比如调用另一个函数，同步执行的结果就是会等待这个函数返回结果才会继续往下执行；而异步执行是继续执行主函数，当异步执行的函数有结果之后我们可以以回调函数的形式接收到然后做出反应。
并行和串行是队列的概念。串行队列的特点是队列中的任务是一个一个执行，直到结束；并行队列的特点是队列中的任务需要同时结束。
并行和并发：你吃饭吃到一半，电话来了，你一直到吃完了以后才去接，这就说明你不支持并发也不支持并行。你吃饭吃到一半，电话来了，你停了下来接了电话，接完后继续吃饭，这说明你支持并发。你吃饭吃到一半，电话来了，你一边打电话一边吃饭，这说明你支持并行。并发的关键是你有处理多个任务的能力，不一定要同时。并行的关键是你有同时处理多个任务的能力。所以我认为它们最关键的点就是：是否是『同时』。
![串行并行](F:/demo/imgInMD/%E4%B8%B2%E8%A1%8C%E5%B9%B6%E8%A1%8C.png)
## 7.将类数组转换为标准数组的方法
常见的类数组有 arguments 和 nodeList，这里以 arguments 为例
```
// 这里不可以使用箭头函数，因为箭头函数中无法访问 arguments
const toArray =  function() {
  const args = arguments
  // 这个地方只传一个参数是因为slice本身就是 array.slice()这种调用的，无需往里传参数
  const arr1 = Array.prototype.slice.call(args)
  const arr2 = Array.prototype.concat.apply([], args)
  const arr3 = []
  // push的返回值是数组更改后的长度，并且是在原数组上更改的，因此应该像下面这样使用
  Array.prototype.push.apply(arr3, args)
  const arr4 = [...args]
  const arr5 = Array.from(args)
  console.log(arr1)  //[1, 2, 3, 4, 5]
  console.log(arr2)  //[1, 2, 3, 4, 5]
  console.log(arr3)  //[1, 2, 3, 4, 5]
  console.log(arr4)  //[1, 2, 3, 4, 5]
  console.log(arr5)  //[1, 2, 3, 4, 5]
}

toArray(1, 2, 3, 4, 5)

//  或者是自己封装一个方法，遍历类数组，将其每一项push进结果数组中
```
## 8. new Vue() 的过程中发生了什么
参照 interview 中的 渲染 部分
## 9.CSS3 使用过什么？
transition, transform, animation, box-shadow, text-shadow, border-radius, rgba, flex, grid, 媒体查询。。。
## 10.说一下你了解的浮动。
浮动会生成一个块级框，浮动元素不处于文档流当中，他们会让另外的浮动元素和文本围绕在该浮动元素周围，但是其他的块级盒子会忽略掉这个浮动元素。
## 11. webpack 中有哪些优化
1. 在开发环境下，我们可以在 devServer 的配置中加上 compress：true 表示进行代码压缩，提高开发效率，还可以使用 hot-module-replacement 热更新功能避免频繁手动刷新，同样可以提高开发效率。
2. webpack4 中提供了 mini-css-extract-plugin 插件将 css 抽离出来，当多个页面使用公共样式的时候，只需进入第一个页面时加载，接下来的页面使用缓存即可。
3. html 文件可以通过在 htmlwebpackPlugin 中配置 minify 进行压缩，当 mode 配置为 production 时，会默认启动 js 的压缩；OptimizeCSSAssetsPlugin 可用于 css 的压缩
4. webpack 提供 file-loader 和 url-loader 处理图片资源，url-loader 可以将小于指定字节的文件进行 base64转换
5. image-webpack-loader 还可以对图片进行压缩
6. webpack4 中采用 optimization.splitChunks 进行依赖分离，可以更好的而利用浏览器缓存
7. tree-shaking 可以删除项目中未被引用的代码。在 webpack4中，mode 为 production 会默认启动这项优化
8. babel-loader 需要将语法进行转换，因此可以利用 include 来限定babel-loader 的范围

引申：从webpack3升级到webpack4为什么会速度提升
1. webpack4 简化了配置项。比如说 mode 如果配置为 production 就会自动开启代码压缩，为development 的话会开启 sourceMap 等
## 12. 手写懒加载（懒加载这个词指的就是图片懒加载！）
参见 f:/demo/needToPosted/intervirePrepare/lazyLoad
## 13.给页面注入50万个li如何提升性能。前端如何渲染一百万条数据（类似问题，长列表，反正就是有很多数据需要显示）
1. 可视页面渲染。
2. 懒渲染。(无限列表形式) 就是等页面到达底部的时候，再去向后端请求更多数据。通过获取 html 或 body 的scrollHeight(为整个页面的大小，包括超出可视页面的部分)，和 html 或 body 的 scrollTop 相比较(整个页面最高部分到当前页面可视区域的距离) 进行比较，如果越来越接近直到某个值表示页面已经滑到底部了，此时可以去请求更多数据。
3. 如果非要一次性渲染的话，可以使用 requestAnimationFrame 这个 API，它是 html5 中的动画 API，会每隔 16 ms 渲染一次页面。可以将这几十万个 li 分批次地渲染到页面上。
4. 内存方面。因为列表的加载势必会带来内存的问题，因为列表越大，加载的 dom 节点也就越多，而 dom 节点的开销性能是非常大的。我们可以将离可见页面很远的 dom 节点进行一个复用，作为将要使用的节点。同时因为要保证每个列表项的位置不能发生变化，原来被移除掉的 dom 节点需要占位，因此可以采用 absolute 布局用transform来进行定位。
【待实现】代码实现[知乎上的解答，也可以自己再找找](https://zhuanlan.zhihu.com/p/26022258)
## 14. base64编码原理
说选出64个字符----小写字母a-z、大写字母A-Z、数字0-9、符号"+"、"/"（再加上作为垫字的"="，实际上是65个字符）----作为一个基本字符集。然后，其他所有符号都转换成这个字符集中的字符。
- 对于要转换的字符，我们将其按照3位一组分组，每一组就是24个字节
- 对于每一组，首先取每个字符的 ascii 码，然后转换成8位的二进制（一共24个字节）
- 将这24个字节分为4组，每组高位加两个0，得到4个8位的字节
- 将这4个字节转换为10进制，参照base64编码表，得到编码后的字符

base64的作用：在网络上交换数据时，比如说从A地传到B地，往往要经过多个路由设备，由于不同的设备对字符的处理方式有一些不同，这样那些不可见字符（ascii码的128～255之间的值是不可见字符。）就有可能被处理错误，这是不利于传输的。所以就先把数据先做一个Base64编码，统统变成可见字符，这样出错的可能性就大降低了。
对于一些小图片可以使用base64编码，这样做可以减少 http 请求，但是会增大 css文件的尺寸（因为把三个字节变成了四个字节）
## 15.CDN原理
CDN(content dilivery network)内容分发网络。其目的是通过在现有的Internet中增加一层新的网络架构，将网站的内容发布到最接近用户的网络"边缘"，使用户可以就近取得所需的内容，解决Internet网络拥塞状况，提高用户访问网站的响应速度。从技术上全面解决由于网络带宽小、用户访问量大、网点分布不均等原因，解决用户访问网站的响应速度慢的根本原因。
![传统网络访问形式](https://image-static.segmentfault.com/84/95/8495773a9074121e42e94bde3f8484a3_articlex)
由上图可见，用户访问未使用CDN缓存网站的过程为:
1. 用户向浏览器提供要访问的域名；
2. 浏览器调用域名解析函数库对域名进行解析，以得到此域名对应的IP地址；
3. 浏览器使用所得到的IP地址，域名的服务主机发出数据访问请求；
4. 浏览器根据域名主机返回的数据显示网页的内容。

CDN网络是在用户和服务器之间增加Cache层，如何将用户的请求引导到Cache上获得源服务器的数据，主要是通过接管DNS实现
![使用CDN的方法](https://image-static.segmentfault.com/54/c0/54c00c69de0e442710d8bdf767f7e53f_articlex)
1. 用户向浏览器提供要访问的域名；
2. 浏览器调用域名解析库对域名进行解析，由于CDN对域名解析过程进行了调整，所以解析函数库得到的是该域名对应的CNAME记录（由于现在已经是使用了CDN服务，CNAME为CDN服务商域名），为了得到实际IP地址，浏览器需要再次对获得的CNAME域名进行解析以得到实际的IP地址；在此过程中，使用的全局负载均衡DNS解析，如根据地理位置信息解析对应的IP地址，使得用户能就近访问。（CDN服务来提供最近的机器）
3. 此次解析得到CDN缓存服务器的IP地址，浏览器在得到实际的IP地址以后，向缓存服务器发出访问请求；
4. 缓存服务器根据浏览器提供的要访问的域名，通过Cache内部专用DNS解析得到此域名的实际IP地址，再由缓存服务器向此实际IP地址提交访问请求；
5. 缓存服务器从实际IP地址得得到内容以后，一方面在本地进行保存，以备以后使用，二方面把获取的数据返回给客户端，完成数据服务过程；
6. 客户端得到由缓存服务器返回的数据以后显示出来并完成整个浏览的数据请求过程。
> CNAME(Canonical Name)指别名记录也被称为规范名字,CNAME可以理解为对域名设置别名。比如一个域名www.domain.com,设置一个CNAME指向它，由于www.domain.com与一个ip进行绑定，如果设置多个CNAME指向它，以后修改CNAME指向的服务器时，只需要修改一个www.domain.com对应的ip即可。
## 16.介绍一下尾递归
首先说一下尾调用，尾调用就是在函数的最后一步调用另一个函数。函数调用会在内存形成一个“调用记录”，又称“调用帧”（call frame），保存调用位置和内部变量等信息。如果在函数A的内部调用函数B，那么在A的调用帧上方，还会形成一个B的调用帧。等到B运行结束，将结果返回到A，B的调用帧才会消失。如果函数B内部还调用函数C，那就还有一个C的调用帧，以此类推。所有的调用帧，就形成一个“调用栈”（call stack）。尾调用由于是函数的最后一步操作，所以不需要保留外层函数的调用帧，因为调用位置、内部变量等信息都不会再用到了，只要直接用内层函数的调用帧，取代外层函数的调用帧就可以了。函数调用自身，称为递归。如果尾调用自身，就称为尾递归。
```
// 1.正常递归
const getFib = function(n) {
  if(n <= 1) return n
  return getFib(n - 1) + getFib(n - 2)
}
// 尾调用优化
const getFib2 = function(n, ac1= 1, ac2 = 1) {
  if(n === 1) return ac1
  // 第二个参数为当前第n个数对应的斐波那契的值，第三个参数为下一个
  return getFib2(n - 1, ac2, ac1 + ac2)
}
```
## 17.bootstrap中如何清除浮动
简单地利用一个 clearfix 类即可
```
// Mixin itself
.clearfix() {
  &:before,
  &:after {
    content: " ";
    display: table;
  }
  &:after {
    clear: both;
  }
}

// Usage as a mixin
.element {
  .clearfix();
}
```
* :after伪类在元素末尾插入了一个包含空格的字符，并设置display为table
* display:table会创建一个匿名的table-cell，从而触发块级上下文（BFC），因为容器内float的元素也是BFC，由于BFC有不能互相重叠的特性，并且设置了clear: both，:after插入的元素会被挤到容器底部，从而将容器撑高。并且设置display:table后，content中的空格字符会被渲染为0*0的空白元素，不会占用页面空间。
* content包含一个空格，是为了解决Opera浏览器的BUG。当HTML中包含contenteditable属性时，如果content没有包含空格，会造成清除浮动元素的顶部、底部有一个空白（设置font-size：0也可以解决这个问题）。
* :after伪类的设置已经达到了清除浮动的目的，但还要设置:before伪类，原因如下
* :before的设置也触发了一个BFC，由于BFC有内部布局不受外部影响的特性，因此:before的设置可以阻止margin-top的合并。这样做，其一是为了和其他清除浮动的方式的效果保持一致；其二，是为了与ie6/7下设置zoom：1后的效果一致（即阻止margin-top合并的效果）。
* zoom: 1用于在ie6/7下触发haslayout和contain floats

引申：bootstrap如何实现栅格布局
栅格布局几个重要的类就是 .contaienr, .row, col-; bootstrap 中将栅格分为12列，我们在使用的时候可以对每一行进行分配，只要加起来为12就可以占满这个container，并且会根据页面大小按照比例收缩。container 的大小采取媒体查询的方式进行设置，两边有 15px 的padding，以及左右margin都设置为 auto 来居中显示。row 两边 margin 都设置为 -15px，这样看起来就和 container 一样大了。每一个列两边都有 15px 的padding，是通过百分比来控制大小的（并且都是左浮动），所以能够随着盒子大小的变化来变化。
## 18. 什么是暂时性死区？
暂时性死区这个名词出现在 ES6 当中，最常见于 let 和 const 声明的变量中。ES6规定，let/const 命令会使区块形成封闭的作用域。若在声明之前使用变量，会抛出 reference error，这在语法上，称为 “暂时性死区”。
## 19. CSS 选择器
常用的有 ID 选择器， class 选择器， 标签选择器，逗号是兄弟选择器， 空格是祖孙选择器， 大于号是父子选择器， 加号(div + p)选择div 后紧邻着的所有p，还有伪类以及伪元素，比如说:link, :visited, :hover, :actived, :focus, :first-letter, :first-child, :first-line, :before, :after
css3 中新增了 :first-of-type, :last-of-type, :nth-child, :last-child, 针对 input 的:disabled, :checked, 选择被用户选取的部分::selection
## 20.说一下对前端模块化的理解
模块化其实体现了一种分而治之的理念。对功能进行分治，可以提高代码的复用性，也能更好的维护代码。
最开始我们实现模块化是定义一个对象，在这个对象中定义方法，利用这些方法来操作对象中的变量，不过这样依然可以在外部访问到对象里的变量；
为了解决这种问题，又引入了立即执行函数这种方法来实现，通过立即执行函数，我们返回所需的方法，这些方法通过闭包来修改数据，并且只能通过这些方法对这些数据进行读写；
后来社区中推出了各种规范，比如 commonJS 和 AMD
commonJS（webpack就用的这种） 通过 require 来加载模块，采用的是同步加载，这种方式对于浏览器来说不太适用，因为需要从服务端请求过来，还要等待网络加载；
AMD 采用了异步加载，通过 define 定义模块，require 加载模块，并且将依赖前置，可以很方便地知道依赖了什么；
CMD 同样是异步加载，也通过 define 定义，require 加载，但它是按需加载。
然后就是 ES6 的规范了，通过 import 和 export 进行导入导出，import命令在编译阶段执行，并且是动态引用，被引用的值发生了变化， import 的值也会发生变化
## 21.客户端如何写入cookie
比如说，当客户端准备请求一个页面时，首先会对服务器发出一个请求，服务端如果想让客户端保存cookie，就会在响应中加上 set-cookie 头，服务端就能将 cookie 保存下来了。JS中通过 document.cookie 来访问 cookie。
## 22. mouseenter 和 mouseover 的区别
mouseenter 事件是当鼠标处于一个元素外部，用户将鼠标移到元素里面时触发。如果鼠标已经在元素内部，那么需要将鼠标移出元素再进入才可以触发。
mouseover 会在鼠标移到被监听的元素上或者其子元素上时被触发。也就是说 mouseover 其实是会冒泡的，但是 mouseenter 不会。
## 23. 如何保证表单的安全
* 当提交的是敏感性数据的时候，用 post 请求来代替 get 请求。因为 post 请求是将数据放到请求主体当中，相对于 get 放到 url 当中更加安全。
* 采用 SSL 协议进行传输，防止信息被窃听。
* 可以设置一个 token，在用户提交表达时同时被提交上去，可以有效防止 csrf 攻击。
## 24. 如何解决 ajax 浏览器缓存问题
什么是Ajax缓存原理？
Ajax在发送的数据成功后，会把请求的URL和返回的响应结果保存在缓存内，当下一次调用Ajax发送相同的请求时，它会直接从缓存中把数据取出来，这是为了提高页面的响应速度和用户体验。当然这要求两次请求URL完全相同，包括参数。这个时候，浏览器就不会与服务器交互。
Ajax缓存的好处：
这种设计使客户端对一些静态页面内容的请求，比如图片，css文件，js脚本等，变得更加快捷，提高了页面的响应速度，也节省了网络通信资源。
Ajax缓存的不足：
Ajax缓存虽然有上述的好处，但是如果通过Ajax对一些后台数据进行更改的时候，虽然数据在后台已经发生改变，但是页面缓存中并没有改变，对于相同的URL，Ajax提交过去以后，浏览器还只是简单的从缓存中拿数据，这种情况当然就不行了。
解决这个问题最有效的办法是禁止页面缓存，有以下几种处理方法：
1、在ajax发送请求前加上 xmlHttpRequest.setRequestHeader(“Cache-Control”,”no-cache”);
2、在服务端加 header(“Cache-Control: no-cache, must-revalidate”);
3、在ajax发送请求前加上 xmlHttpRequest.setRequestHeader(“If-Modified-Since”,”0″);
4、在 Ajax 的 URL 参数后加上 "?fresh=" + Math.random(); //当然这里参数 fresh 可以任意取了
5、第五种方法和第四种类似，在 URL 参数后加上 "?timestamp=" + new Date().getTime();
6、jQuery提供一个防止ajax使用缓存的方法：
```
<script type="text/javascript" language="javascript"> 
     $.ajaxSetup ({ 
           cache: false //close AJAX cache 
      });
</script>
```
## 25. BFC 和 margin collapse 相关
BFC（block formatting contexts 块级格式化上下文）。浮动元素，绝对定位元素，display 属性为 table-cell，table-caption，inline-block，flex 的元素以及 overflow 属性不为 visible 的元素会产生一个新的块级格式化上下文。
BFC就是页面上的一个隔离的独立容器，容器里面的子元素不会影响到外面元素，反之亦然。
BFC的区域不会与float的元素区域重叠。
计算BFC的高度时，浮动子元素也参与计算。
属于同一个BFC的两个相邻Box的margin会发生重叠。
每个元素的左外边距与包含块的左边界相接触。

两个元素在垂直方向上的margin相邻的话，会发生 margin collapsing 现象。两个margin 同为正数的话，大的那一方获胜，相等则取这个等值；一正一负则将两个值进行相加，如果和为负数，会发生一个元素覆盖另一个元素的现象（好像把两个元素拉在了一起）。
该现象不仅仅发生在相邻的两个同级元素中，也会发生在父子元素中，只要这两个父子元素的margin是相邻的（其中没有border或padding）
相邻元素解决 margin collapse 现象可将其中一个元素置于另一个 BFC 中；父子元素解决可在其 margin 之间放置 padding 或 border。
## 26. 将下划线命名方式转换为驼峰命名
```
const transform = function(name) {
  let reg = /\_/g
  while(reg.test(name)) {
    // lastIndex 指向匹配到的位置的下一位
    let index = reg.lastIndex
    name = name.substring(0, index - 1) + name.substring(index, index + 1).toUpperCase() + name.substring(index + 1, name.length)

  }
  return name
}
```
## 27. position属性的值
`static: ` 该关键字指定元素使用正常的布局行为，即元素在文档常规流中当前的布局位置。此时 `top`, `right`, `bottom`, `left` 和 `z-index` 属性无效。
`relative: ` 元素相对于它本身的位置进行定位。元素先放置在未添加定位时的位置，再在不改变页面布局的前提下调整元素位置（因此会在此元素未添加定位时所在位置留下空白）。`position:relative 对 table-*-group, table-row, table-column, table-cell, table-caption 元素无效。`
`absolute：`不为元素预留空间，通过指定元素相对于最近的非 static 定位祖先元素的偏移，来确定元素位置。绝对定位的元素可以设置外边距（margins），且不会与其他边距合并。
`fixed: `不为元素预留空间，而是通过指定元素相对于屏幕视口（viewport）的位置来指定元素位置。元素的位置在屏幕滚动时不会改变。打印时，元素会出现在的每页的固定位置。fixed 属性会创建新的层叠上下文。当元素祖先的 transform  属性非 none 时，容器由视口改为该祖先。
`sticky: `盒位置根据正常流计算(这称为正常流动中的位置)，然后相对于该元素在流中的 flow root（BFC）和 containing block（最近的块级祖先元素）定位。在所有情况下（即便被定位元素为 table 时），该元素定位均不对后续元素造成影响。当元素 B 被粘性定位时，后续元素的位置仍按照 B 未定位时的位置来确定。position: sticky 对 table 元素的效果与 position: relative 相同。元素在跨越特定阈值前为相对定位，之后为固定定位。
## 28.事件委托和事件冒泡
可以先说一下事件流。事件流就是 用户与页面发生交互时，从页面中接受事件的顺序。DOM2级事件规定的事件流包括三个阶段：事件捕获阶段，处于目标阶段，事件冒泡阶段。比如说发生了一个鼠标点击事件。事件捕获先从window开始，然后是document(可以通过 document.documentElement 获取到)。然后是 body，一直往下传，直到到达目标元素，然后再进行事件冒泡。
事件委托可以用来简化代码量，假设一个场景，一个父元素内有十个按钮，每个按钮都有 click 事件，如果给每个按钮都用 addEventListener 添加监听就显得太冗余了，我们可以把事件绑定到父元素上，然后利用事件冒泡，根据 event.target 来获得触发事件的元素，做出相应的处理。
## 29.为什么实现虚拟地址空间与物理地址空间映射
1. 如果程序都是直接访问物理内存，那也就意味着任意一个进程都能够去读写系统相关内存区域，恶意程序可以随意修改别的进程的内存数据，以达到破坏的目的。
2. 内存使用效率低。在A(10M)和B(110M)都运行的情况下，如果用户又运行了程序C，而程序C需要20M大小的内存才能运行，而此时系统(128M)只剩下8M的空间可供使用，所以此时系统必须在已运行的程序中选择一个将该程序的数据暂时拷贝到硬盘上，释放出部分空间来供程序C使用，然后再将程序C的数据全部装入内存中运行。可以想象得到，在这个过程中，有大量的数据在装入装出，导致效率十分低下。
3. 编译完成后的程序是存放在硬盘上的，当运行的时候，需要将程序搬到内存当中去运行，如果直接使用物理地址的话，我们无法确定内存现在使用到哪里了
虚拟地址实际上就相当于在物理地址和进程间引入一个第三者，一般实现方法有两种：分段映射和分页映射。
## 30. top,left 和 transform 的区别
当用 top 和 left 进行变换的时候，会造成重排；
使用 transform 进行变化，会开启 GPU 加速，意思就是将浏览器中的一些图形操作交给 GPU 来完成，因为 GPU 是专门为处理图形而设计，所以它在速度和能耗上更有效率。
GPU 加速通常包括以下几个部分：Canvas2D，布局合成, CSS3转换（transitions），CSS3 3D变换（transforms），WebGL和视频(video)。
## 31. 如何实现一个 const
利用 Object.defineProperty 进行一个数据劫持
```
var _const = function(data, value) {
  window.data = value
  Object.defineProperty(window, data, {
    enumerable:false,
    configurable: false,
    get() {
      return value
    },
    set(newVal) {
      if(newVal !== value) {
        throw new TypeError('const variable can not be change')
      }
    }
  })
}

_const('name', 'zmn')
console.log(name)
name = 'ZMN'
```
## 32.介绍一下 web 缓存机制
关于缓存机制我一直没分清到底什么时候答强缓存协商缓存，什么时候答 cookie，session什么的。
想了一下严格来说，cookie 和 session 应该都算不上是缓存吧，他们作为会话跟踪机制，只是记录一些用户名密码之类的，缓存机制应该指的是能存储文件的那种。
web 缓存一共分为3种
1. 浏览器缓存
2. 服务器缓存
3. HTML5 缓存
浏览器缓存又分为四种
1. Memory Cache。是指存在内存中的缓存。从优先级上来说，它是浏览器最先尝试去命中的一种缓存。从效率上来说，它是响应速度最快的一种缓存。不过当页面关闭时，内存里的数据也就没有了。
2. Service Worker Cache（这个你可以不提，因为说起来还有点复杂，但是你又不会）
3. HTTP Cache（强缓存and协商缓存）
4. Push Cache。Push Cache 是指 HTTP2 在 server push 阶段存在的缓存。
服务器缓存可以通过 CDN 来实现。（CDN介绍见上面）
HTML5缓存分为 webStorage 和 IndexedDB（IndexedDB 是一个运行在浏览器上的非关系型数据库,用于客户端存储大量结构化数据。）
## 33. 如何用 reduce 实现 map 的功能
map 是对数组中的每一项进行操作，并返回一个新数组
而 reduce 是对数组中的值进行一个累积，最后返回这个累计值
要想知道怎么用 reduce 实现map，首先我们要知道 reduce 是怎么用的
```
reduce(callback, initial)
callback 当中允许有四个参数，第一个参数为累计值，第二个参数为当前项，第三个参数为当前索引，第四个参数为源数组。
同时，如果没有 initial 存在，则索引会直接从 1 开始（因为会将数组中的第一项作为 initial），如果有原始值则从 0 开始
示例
const arr = [1, 2, 3, 4, 5]
const arr1 = arr.map(item => {
  return item + 1
})
const arr2 = []
arr.reduce((calc, cur, curIndex, arr) => {
  arr2.push(arr[curIndex] + 1)
}, 0)
console.log(arr1, arr2)
```
## 34. html 的解析 (重绘，重排必考)
浏览器向服务端请求页面后，会对收到的 html 进行解析。在解析的过程中，html parser 会解析 html 生成 dom tree，遇到 css 同样会利用 css parser 生成 cssom tree，css 的解析不会阻塞 dom 的解析。两者结合后会生成一棵 render tree，下一步就要进行 layout，也就是布局，这个过程就是通过 render tree 当中 render 对象的信息，计算出每一个 render 对象的位置和尺寸，将其安置在浏览器窗口的正确位置，而有些时候我们会在文档布局完成后对DOM进行修改，这时候可能需要重新进行布局，也可称其为回流，本质上还是布局的过程。
然后进入绘制阶段，就是将内容显示在屏幕上。这里可以提到两个概念，分别是 重绘和重排。
重绘(Repaint)，就是对屏幕的一部分进行一次重画，比如说某个元素的背景色发生了变化，但是元素尺寸并没有发生变化
重排(Reflow)，元素的尺寸发生了变化，我们需要重新计算 render tree，再次进行 layout。Reflow 的成本要比 Repaint 高的多，一个节点的 reflow 可能会引起它子元素甚至是父元素，同级元素的reflow，因此应该尽量减少 reflow。这些情况会触发 reflow：
1. 当你增加、删除、修改DOM结点时，会导致Reflow或Repaint
2. 当你移动DOM的位置，或是搞个动画的时候。
3. 当你修改CSS样式的时候。
4. 当你Resize窗口的时候（移动端没有这个问题），或是滚动的时候。
5. 当你修改网页的默认字体时。
6. 注：display:none会触发reflow，而visibility:hidden只会触发repaint，因为没有发现位置变化。
visibility 和 hidden 的区别除了一个触发 repaint 一个 触发 reflow 之外，还有以下两点：
visibility：hidden 隐藏掉的元素所占据空间依然存在于页面上，而 display：none 则不存在了
并且设置为 display：none 的元素其子元素都会消失
而设置为 visibility：hidden 的子元素如果给其设置 visibility：visible 又会重新出现在页面上

## 35. window.onload 和 $(document).ready() 的区别
后者在 dom 加载完毕之后触发，此时外部资源可能还没有加载完毕；如果声明多个 $(document).ready()，其中的代码都会被执行到。
前者是在所有资源加载完毕之后触发；如果声明多个 window.onload，只会执行最后一个。
补充：
页面生命周期：
* DOMContentLoaded 事件在DOM树构建完毕后被触发，我们可以在这个阶段使用 JS 去访问元素。
  * async 和 defer 的脚本可能还没有执行。
  * 图片及其他资源文件可能还在下载中。
* load 事件在页面所有资源被加载完毕后触发，通常我们不会用到这个事件，因为我们不需要等那么久。
* beforeunload 在用户即将离开页面时触发，它返回一个字符串，浏览器会向用户展示并询问这个字符串以确定是否离开。
* unload 在用户已经离开时触发，我们在这个阶段仅可以做一些没有延迟的操作，由于种种限制，很少被使用。

document.readyState 表征页面的加载状态，可以在 readystatechange 中追踪页面的变化状态：
* loading —— 页面正在加载中。
* interactive —— 页面解析完毕，时间上和 DOMContentLoaded 同时发生，不过顺序在它之前。
* complete —— 页面上的资源都已加载完毕，时间上和 window.onload 同时发生，不过顺序在他之前。
## 36. 用三个词语形容一下你自己
善于计划和总结。我每天早上都会将这一天要做的事写在一个本子上并分配相应的时间段去完成，也尽量每天做一个短总结，总结这一天学什么了，每周再做一个稍长的总结记录一下这周遇到的问题以及如何解决的，哪些地方需要改进，以及下周要做些什么。
乐观。我一直觉得没有什么问题是解决不了的，也没有什么知识点是真的搞不懂的，如果一遍没懂，那就再看一遍。可能是有一点理想化，不过对我自己而言，乐观对于调整心态真的很重要。遇到稍微复杂的问题的时候，就不那么容易心态爆炸了。
善于交流。这也是由我个人性格特点决定的，我喜欢说话，也喜欢听别人说话，我知道怎么把自己的想法说出来，我觉得这一点在团队合作当中是很重要的。
## 37.说一个你的缺点
我的缺点就是，我性子很急。这个特点一定程度上有一点优势，就是学东西比较快，但是还是给我造成了很多烦恼。考试的时候，经常碰到一些题，算好几遍答案都不一样，然后我就会着急，我乐观的一面一边给自己加油打气，告诉自己你可以你可以，我急性子这一面又在旁边催我你快点你快点，但往往都是你越着急你越做不出来。还有就是平时自己学习的时候，除了我正在解决的问题，我可能会引申出来一些其他的问题，如果我不去解决这些我就会很着急，总觉得自己有什么事情没做完。其实不应该这样，因为我正在处理当前的问题，如果放下现在的问题去处理其他的，等待会儿再回来又需要一段时间才可以找回当时的状态了。我一直在摸索适合自己的解决方法，现在就是对于这些新产出来的问题，我都统一给他们记在一个本子上，给我的大脑营造出一种 “我已经解决了这个问题” 的假象。等手里的事情结束之后再根据本子上的记录来解决。
## 38. 介绍一下你自己。
您好，我叫张梦妮，来自东北石油大学计算机与信息技术学院物联网工程专业。我面试的岗位是前端开发工程师，我曾经在实习岗位上做过类似的工作，当时负责的是公司重症病人监护系统的测评模块，完成之后也获得了同事们的认可，这份实习工作可以说确定了我从事前端工作的决心。我平时学习的过程中喜欢逛一逛博客，论坛之类的，看看大家都在讨论什么，然后将自己感兴趣的文章以链接的形式统一存储在一个笔记里，然后等空闲的时间再去研究。比较喜欢研究关于vue的文章以及学习资料，在研究的过程中也收获了很多。闲暇时间喜欢看看书，追追剧，最喜欢的作者是王小波和毛姆，希望可以加入字节跳动这个大家庭

## 39. 原码，反码，补码
原码就是用最高位表示符号位（0为正数，1为负数），其余位为该数的二进制表示
正数的反码和补码都是它本身
负数的反码是对除了符号位的其余位取反，补码是反码+1
## 40. 构造函数中返回 {}, null, 1, true, function() {} 会有什么不一样的结果
当我们在构造函数中显示return一个基本类型时，实质会返回调用构造函数生成的这个实例对象（存在继承关系），而如果返回的是一个引用类型，就会返回这个自定义的引用类型了（不存在继承关系）。
## 41. 垃圾回收机制
内存的生命周期是从分配到使用，然后将不需要的内存释放掉。这里的问题就是“如何找到不再需要的内存然后将其释放？”主要有两种方式，第一种是引用计数垃圾收集，它判断对象有没有被其他对象引用，如果没有的话，对象将被垃圾回收机制回收。面对循环引用时，这种方法就显出弊端了，因为循环引用的对象他们的引用次数至少是1，因此不会被清除掉，会造成内存泄漏的问题。
现在的浏览器都使用第二种-“标记-清除算法”，它假定有一个叫根的对象。垃圾回收器将定期从根开始，找所有从根开始引用的对象，然后找这些对象引用的对象……从根开始，垃圾回收器将找到所有可以获得的对象和收集所有不能获得的对象。
## 42. 顺序发送请求，并且按照发送顺序输出返回结果
这道题我实在是不知道怎么做了，我的解决方式就是执行完一个再去执行下一个，不过这样有很严重的性能问题就是了。。。
```
async function runPromiseByQueue(myPromises) {
  for (let value of myPromises) {
    await value();
  }
}

// 突然找到了解决方案，虽然没怎么搞懂
let makePromise = (value) => {
    console.log("sync", value)
    return new Promise(resolve => {
        setTimeout(() => {
            console.log("async", value)
            resolve(value)
        }, Math.random() * 1000)
    })
}
let print = (value) => {
    console.log("print", value)
}
let values = [1, 2, 3, 4]
let promises = values.map(value => makePromise(value)) // 这里就已经开始并行加载
let parallelPromises = promises.reduce(
    (current, next) => current.then(() => next.then(print)),
    Promise.resolve()
)
parallelPromises
    .then(() => console.log("done"))
    .catch(() => console.log("failed"))
```