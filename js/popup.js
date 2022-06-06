(() => {
  const labels = [
    'current_page',
    //  'issue_comment'
  ]
  let data = {
    current_page: true,
    issue_comment: true,
  }
  const checkboxes = {}

  function setData(data) {
    chrome.storage.sync.set({ data })
  }

  function getData() {
    chrome.storage.sync.get("data", (data) => {
      data = data.data
      Object.keys(checkboxes).forEach(label => {
        checkboxes[label].checked = data[label]
      })
    })
  }

  labels.forEach(label => {
    checkboxes[label] = document.getElementById(label)
    checkboxes[label].onclick = ({ target }) => {
      data[label] = target.checked
      setData(data)
    }
  })

  getData()
})()