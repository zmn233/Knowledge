/*version 1代码的执行顺序是：（在72环境下）
  script start
  async1 start
  async2
  promise1
  script end
  async1 end
  promise2
  setTimeout
  在这里对 async 和 await 做一个简要的阐述。 
    await(async 同样表示函数会返回一个 promise) 表示右边表达式的返回结果是一个 promise 对象，当函数返回值不为 promise 时，它会执行 Promise.resolve() 将其包装成一个 promise 进行返回，其余与普通函数并无什么不同。
    await 一般放在 async 函数中，表示要等待右侧表达式执行完毕。注意这个地方：“等待执行完毕”！说明 await 语句是从右往左执行的，这个例子中，当我们执行到 async2() 时，不会马上退出函数执行同步代码，而是会先执行 async2(),并等它执行结束，再退出函数。这就是 async2 会先于 promise1 打印的原因。
    整个 script 执行完之后，会回到 async1(), 它后面表达式的值是 Promise.resolve(undefined)(来自async2的返回值)
    MDN 对于 await 的解释是，当其后面是一个 promise 时，它会等待该 promise 正常处理完成并返回promise的处理结果
    promise 执行完成后，我们一般是在 then() 方法中拿到结果的，因此这个地方 
          await Promise.resolve() 相当于 
          Promise.resolve(undefined).then((undefined) => {})，因此会将 then 方法放到promise 对应的队列中，并且先于 Promise2 执行
     （个人感觉这个步骤有点牵强，不过自己也找不到更能说服自己的解释了，另外的解释我都没看懂，73 版本之后 顺序又发生了变化，下次再继续总结）
     （19.2.27 反馈，觉得懂了哈哈哈）
     再次研究了文章之后，还是不太理解。不过只能用通俗的语言给自己讲懂，不然这个知识点一辈子都搞不清楚了ORZ。
     拿下边 version2 的例子来说，73版本之前和之后的浏览器最大的不同在于 async1 end 和 promise1 ，peomise2 打印的先后顺序
     在73版本之前，promise1 + promise2 执行顺序在 async1 end 之前。官方文档指出，await 会导致额外的两个 promise 开销 以及 三个 tick 时间（具体为什么我真的真的不想再研究了），这样结果就很好解释了。第一个 tick 执行，打印 promise1，将 then 方法放入执行队列，第二个 tick 又走到await这个地方，但是它要等第三个 tick 才执行，因此先打印 Promise2，最后到了第三个 tick，打印 asyn1 end！！！

     73版本之后，await 只会额外创建1个promise，并且只利用1个tick，因此在第一个 tick 就会打印 asyn1 end，接着再打印 promise1 以及 promise2！！！
     完美！
*/

// version1
async function async1() {
    console.log( 'async1 start' )
    await async2()
    console.log( 'async1 end' )
}

async function async2() {
    console.log( 'async2' )
}

console.log( 'script start' )

setTimeout( function () {
    console.log( 'setTimeout' )
}, 0 )

async1();

new Promise( function ( resolve ) {
    console.log( 'promise1' )
    resolve();
} ).then( function () {
    console.log( 'promise2' )
} )

console.log( 'script end' )


// version2
// 1. 首先走到这里打印出 script start
console.log('script start')
// 3. async1 函数第一行是一个 await + 函数调用，因为await 会等待右边表达式执行结束，因此我们现在来执行 async2
async function async1() {
  await async2()
  // 5. 代码回到 async1，await 表示右边会返回一个 promise 对象，而这个地方 async 返回的是 undefined，则会调用 Promise.resolve() 将其包装为一个 promise 对象并返回，需要耗费一个 tick 的时间，也就是会等到 nextTick 函数执行权才回到这里（这个地方可以解释上面说的 “在then里拿到函数返回值”，then 也是发生在 nextTick 当中的嘛）
  // 9. script 代码执行完成之后，回到了这里，打印 async1 end
  console.log('async1 end')
}
// 4. 执行 async2，打印 async2 end
async function async2() {
  console.log('async2 end') 
}
// 2.然后执行 async1 函数
async1()
// 6. 函数执行到这里，将 setTimeout 放进宏任务执行队列
setTimeout(function() {
  // 12. 打印 setTimeout，结束。
  console.log('setTimeout')
}, 0)
// 7. 继续执行，打印出 Promise，将 then 方法放进微任务队列
new Promise(resolve => {
  console.log('Promise')
  resolve()
})
  // 10. 打印 promise1
  .then(function() {
    console.log('promise1')
  })
  // 11. 打印 promise2，这个地方具体可见 eventLoop.js。微任务队列要清空之后才执行宏任务，因此哪怕我实在微任务中生成了微任务，也要一直执行下去直到队列清空
  .then(function() {
    console.log('promise2')
  })
// 8. 打印出 script end
console.log('script end')
/*
script start
async2 end
Promise
script end
async1 end
promise1
promise2
setTimeout
* */