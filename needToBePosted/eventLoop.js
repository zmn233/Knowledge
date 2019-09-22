// 此篇主要是我本人在阅读了多篇相关文章后，对eventLoop（事件循环）， micro-task, macro-task的一些自己的总结

// js是一个单线程语言，为了防止程序发生阻塞，js中既有异步也有同步

// 事件循环的顺序，决定了JavaScript代码的执行顺序。它从script(整体代码)开始第一次循环。之后全局上下文进入函数调用栈。直到调用栈清空(只剩全局)，然后执行所有的micro-task。当所有(划重点，所有的！！！)可执行的micro-task执行完毕之后。循环再次从macro-task开始，直到其中一个任务队列执行完毕，然后再执行所有的micro-task，这样一直循环下去。
    // 栈中的任务就是同步任务，只有所有的同步任务执行结束后才会执行队列中的异步任务，而异步任务也会选择先从宏任务开始执行
    // macro-task(宏任务)：包括整体代码script，setTimeout，setInterval，setImmediate
    // micro-task(微任务)：Promise，process.nextTick

// 注：new Promise(function(resolve) { 这里面的代码会立即执行，异步执行的是其后的 then 方法 }).then(function(){ 异步 })
// 在同一个事件循环中被加入队列的任务，会先等该队列执行结束再执行后面的队列
    /* 
    比如说, setTimeOut(), setImmediate, setTimeOut, setImmediate(), 会将两个 timeOut 放入其对应的任务队列中,两个 immediate 放入另一个队列中，因为 timeOut 先定义，会首先执行到 timeOut
    在执行到 timeOut 队列时，会先将两个 timeOut 执行结束，再检查微任务队列中是否有任务，执行完了才执行 immediate 
    */
   /*
    但是！如果我第一个 setTimeout 事件中产生了待执行的微任务，那么会首先执行这些微任务，而不是等待 setTimeout 队列执行完成！
    也就是说 宏任务的执行是按照队列顺序来的，但是每执行完成一个宏任务（而不是宏任务队列），都要去检查一下是否有待执行的微任务，有的话就要执行这些微任务  
    19.2.23 反馈，确实是这样。
    还有就是，当我们在微任务的执行过程中又继续产生了微任务，比如说then方法里又定义了 promise 的then 方法，会一直执行到所有的 then 结束，才去执行宏任务，哪怕这个宏任务是跟第一个 then 一起定义的。想想也没什么解释不通的地方，理解“清空队列”这四个字很重要了

    
    */
setTimeout(function() {
    console.log('timeout1');
})

new Promise(function(resolve) {
    console.log('promise1');
    for(var i = 0; i < 1000; i++) {
        i == 9999 && resolve();
    }
    console.log('promise2');
}).then(function() {
    console.log('then1');
})

console.log('global1'); 
// 输出 
// promise1
// promise2
// global1
// then1
// timeout1

setTimeout(function(){
    console.log('执行了')
 },3000)   
//  准确的解释是: 3秒后,setTimeout里的函数被会推入event queue,而event queue(事件队列)里的任务,只有在主线程空闲时才会执行。
    
    
