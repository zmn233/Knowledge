const isFunction = variable => typeof variable === 'function'

const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'

class MyPromise {
  _status = PENDING
  _value = undefined
  _rejectedQueues = []
  _fulfilledQueues = []
  constructor (handle) {
    try {
      handle(this._resolve, this._reject)
    } catch (err) {
      this._reject(err)
    }
  }

  _resolve = val => {
    const run = () => {
      if (this._status !== PENDING) return
      this._status = FULFILLED
      const runFulfilled = value => {
        let cb
        while(cb = this._fulfilledQueues.shift()) {
          cb(value)
        }
      }
      const runRejected = error => {
        let cb
        while(cb = this._rejectedQueues.shift()) {
          cb(error)
        }
      }
      /*
       * 如果resolve的参数为Promise对象，
       * 则必须等待该Promise对象状态改变后当前Promsie的状态才会改变
       * 且状态取决于参数Promsie对象的状态
       */
      if (val instanceof MyPromise) {
        val.then(value => {
          this._value = value
          runFulfilled(value)
        },
        err => {
          this._value = err
          runRejected(err)
        })
      } else {
        this._value = val
        runFulfilled(val)
      }
    }
    setTimeout(run)
  }

  _reject = err => {
    if (this._status !== PENDING) return
    // 依次执行失败队列中的函数，并清空队列
    const run = () => {
      this._status = REJECTED
      this._value = err
      let cb
      while ((cb = this._rejectedQueues.shift())) {
        cb(err)
      }
    }
    // 为了支持同步的Promise，这里采用异步调用
    setTimeout(run)
  }

  then (onFulfilled, onRejected) {
    const { _value, _status } = this
    return new MyPromise((onFulfilledNext, onRejectedNext) => {
      const fulfilled = value => {
        try {
          if (!isFunction(onFulfilled)) {
            onFulfilledNext(value)
          } else {
            const res = onFulfilled(value)
            if (res instanceof MyPromise) {
              res.then(onFulfilledNext, onRejectedNext)
            } else {
              onFulfilledNext(res)
            }
          }
        } catch (err) {
          onRejectedNext(err)
        }
      } 
      const rejected = error => {
        try {
          if (!isFunction(onRejected)) {
            onRejectedNext(error)
          } else {
            const res = onRejected(error)
            if (res instanceof MyPromise) {
              res.then(onFulfilledNext, onRejectedNext)
            } else {
              onFulfilledNext(res)
            }
          }
        } catch (err) {
          onRejectedNext(err)
        }
      }
      switch (_status) {
        case PENDING:
          this._fulfilledQueues.push(fulfilled)
          this._rejectedQueues.push(rejected)
          break
        case FULFILLED:
          fulfilled(_value)
          break
        case REJECTED:
          rejected(_value)
          break
      }
    })
  }
}