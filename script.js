const textarea = document.querySelector('textarea')
const initialTextareaHeight = textarea.scrollHeight

async function createBotReply(content) {
    const API_URL = 'https://api.openai.com/v1/chat/completions'
    const API_KEY = 'your_api_KEY'

    const response = await fetch(API_URL, {
        metrod: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [{
                role: 'user',
                content
            }]
        })
    })

    const data = await response.json()

    return data.choices[0].message.content
}

function createChatMessage(message, type) {
    const li = document.createElement('li')
    li.classList.add('message', type)
    const p = document.createElement('p')

    if (type == 'bot') {
        const i = document.createElement('i')
        i.classList.add('fa-solid', 'fa-robot', 'fa-xl')
        li.appendChild(i)
    }

    p.textContent = message
    li.appendChild(p)

    return li
}

function handleCloseChat() {
    document.body.classList.remove('open-chat')
}
function handleTogglerChat() {
    document.body.classList.toggle('open-chat')
}

function handleAutoSize() {
    textarea.style.height = `${initialTextareaHeight}px`
    textarea.style.height = `${textarea.scrollHeight}px`
}

async function handleChat() {
    const textAreaValue = textarea.value.trim()

    if (!textAreaValue) {
        return
    }


    const main = document.querySelector('main')
    const messageHistory = document.querySelector('ul')

    const userMessage = createChatMessage(textAreaValue, 'user')

    messageHistory.appendChild(userMessage)
    main.scrollTo(0, main.scrollHeight)

    textarea.value = ''

    const botMessage = createChatMessage('Digitando...', 'bot')
    setTimeout(() => {
        messageHistory.appendChild(botMessage)
        main.scrollTo(0, main.scrollHeight)
    }, 500);

    try {
        const botReply = await createBotReply(textAreaValue)

        botMessage.querySelector('p').textContent = botReply
        messageHistory.scrollTo(0, messageHistory.scrollHeight)
    } catch (error) {
        botMessage.querySelector('p').textContent = 'Ops, algo deu errado! Tente novamente.'
        botMessage.querySelector('p').classList.add('error')

    }

}

function checkEnter(event) {
    if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault()
        handleChat()
    }
}


