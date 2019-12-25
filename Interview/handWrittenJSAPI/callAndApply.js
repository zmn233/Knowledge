Function.prototype.call = function (context = window) {
  context.fn = this
  const arg = [...arguments].slice(1)
  const result = context.fn(...arg)
  delete context.fn
  return result
}

Function.prototype.apply = function (context = window) {
  context.fn = this
  let arg
  if (arguments[1]) {
    arg = arguments[1]
  }
  const result = context.fn(...arg)
  delete context.fn
  return result
}

function callMyName (name) {
  console.log(`喊出我的名字${name}`)
  console.log(this.rank)
}

function becomeStar (...rocketGirls) {
  console.log(rocketGirls)
}

callMyName.call({rank:11}, 'rainbow')
becomeStar.apply(window, ['MMQ', 'WXY', 'rainbow'])