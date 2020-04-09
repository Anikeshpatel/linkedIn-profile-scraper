
chrome.runtime.onMessage.addListener((request, sender, sendMessage) => {
    console.log(request);
    document.querySelector('#name').textContent = request.profile.Email
})

const isValidateUrl = url => {
    var re = /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
    return re.test(String(url).toLowerCase());
}

const getInputElement = type => {
    const inputElement = document.createElement('input')
    inputElement.type = type
    inputElement.placeholder = 'Backend End-Point'
    inputElement.className = 'input'
    return inputElement
}

const getActionBtn = text => {
    const btn = document.createElement('a')
    btn.className = 'btn'
    btn.appendChild(document.createTextNode(text))
    return btn
}

const getStatusLabel = (text = '') => {
    const label = document.createElement('p')
    label.className = 'label'
    label.appendChild(document.createTextNode(text))
    return label
}

const status = {
    error: 'Invalid Url',
    currect: 'Currect'
}

// Element References
const inputElement = getInputElement('email')
const actionBtn = getActionBtn('Send')
const label = getStatusLabel('')
const mainContainer = document.querySelector('.main__container')
const inputContainer = document.createElement('div')
inputContainer.className = 'input__container'

// Appending all children to the container
inputContainer.appendChild(inputElement)
mainContainer.appendChild(inputContainer)
mainContainer.appendChild(label)
mainContainer.appendChild(document.createElement('br'))
mainContainer.appendChild(document.createElement('br'))
mainContainer.appendChild(actionBtn)

const setButtonStatus = status => {
    if (status) {
        actionBtn.style.pointerEvents = 'auto'
        actionBtn.style.opacity = 1
    }else {
        actionBtn.style.pointerEvents = 'none'
        actionBtn.style.opacity = 0.5
    }
}
setButtonStatus(false)

const validate = url => {
    if (isValidateUrl(url)) {
        inputContainer.classList.remove('invalid')
        label.innerText = ''
        inputContainer.classList.add('currect')
        setButtonStatus(true)
    } else if (url.length > 0) {
        inputContainer.classList.add('invalid')
        label.innerText = status.error
        setButtonStatus(false)
    } else {
        inputContainer.classList.remove('currect')
        inputContainer.classList.remove('invalid')
        label.innerText = ''
        setButtonStatus(false)
    }
}

// Html Events Callbacks
inputElement.onmouseover = e => {
    inputContainer.classList.add('hover')
}

inputElement.onmouseleave = e => {
    inputContainer.classList.remove('hover')
}

inputElement.oninput = e => {
    validate(e.target.value)
}

inputElement.onfocus = e => {
    console.log('Input field is on focus')
}

inputElement.onblur = e => {
    console.log('Input field is not on focus')
}

chrome.storage.sync.get(['endPoint'], (result) => {
    inputElement.value = result.endPoint || ''
    validate(inputElement.value)
})

actionBtn.onclick = async () => {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        chrome.storage.sync.set({ endPoint: inputElement.value }, () => {})
        chrome.tabs.sendMessage(tabs[0].id, {action: 'profile', endPoint: inputElement.value})
        close()
    })
}
