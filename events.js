
chrome.runtime.onMessage.addListener((request, sender, sendMessage) => {
    if (request.action == 'showPopup') {
        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
            chrome.pageAction.show(tabs[0].id)
        })
    }
})
