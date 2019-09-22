self.addEventListener('message', (e) => {
  let num = e.data,
      timer = setInterval(() => {
        self.postMessage(num--)
        if(num <= 0) {
          clearTimeout(timer)
          self.close()
        }
      })
})