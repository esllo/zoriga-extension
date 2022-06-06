const Zoriga = (() => {
  const buttonText = 'Copy URL'

  let alertHandler = null


  function generate(url) {
    return new Promise((res) => {
      chrome.runtime.sendMessage({ url }, (response) => {
        res(response)
      })

    })
  }

  function setHandler(elem) {
    clearHandler()
    alertHandler = setTimeout(() => {
      elem.textContent = buttonText
      clearHandler()
    }, 1000)
  }

  function clearHandler() {
    if (alertHandler) {
      clearTimeout(alertHandler)
      alertHandler = null
    }
  }

  async function generateCurrentPage() {
    clearHandler()
    this.textContent = 'Wait'
    const { status, generated } = await generate(location.href)
    if (status === 200) {
      navigator.clipboard.writeText(generated).then(() => {
        this.textContent = 'Copied'
        setHandler(this)
      }, () => {
        this.textContent = 'Failed'
        setHandler(this)
      })
    } else {
      this.textContent = 'Failed'
      setHandler(this)
    }
    this.textContent = buttonText
  }

  chrome.storage.sync.get('data', ({ data }) => {
    const { current_page } = data
    if (current_page) {
      const button = document.createElement('button')
      button.className = 'zoriga-float-button'
      button.textContent = buttonText
      button.addEventListener('click', generateCurrentPage.bind(button))
      button.style.cssText = `--img: url(${chrome.runtime.getURL('images/icon128.png')});`
      document.body.appendChild(button)
    }
  })

  chrome.runtime.onMessage.addListener((message) => {
    const { command } = message
    if (command === 'copy-current-page') {
      generateCurrentPage()
    }
  })

  const style = document.createElement('link')
  style.rel = 'stylesheet'
  style.href = chrome.runtime.getURL('css/zoriga.css')
  document.head.appendChild(style)

  return {
    generate,
  }
})()