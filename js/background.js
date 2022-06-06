chrome.runtime.onInstalled.addListener((details) => {
  switch (details.reason) {
    case "install":
      const data = {
        current_page: true,
        issue_comment: true,
      }
      chrome.storage.sync.set({ data })
      break
    case "update":
      break
  }
})

const urlCache = {}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if(urlCache.hasOwnProperty(msg.url)){
    sendResponse(urlCache[msg.url])
  }else{

    fetch(`https://zori.ga/generate`, {
      method: 'post',
      body: JSON.stringify(msg),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((res) => res.json()).then((json) => {
      sendResponse(json)
      urlCache[msg.url] = json
    }).catch(e => {
      sendResponse(null)
    })
  }
  return true
})

chrome.commands.onCommand.addListener((command) => {
  chrome.tabs.query({ active: true, lastFocusedWindow: true }).then(([tab]) => {
    const { status } = tab
    if (command === 'copy-current-page' && status === 'complete') {
      chrome.tabs.sendMessage(tab.id, { command })
    }
  })
})