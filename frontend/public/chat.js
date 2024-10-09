const URL = 'http://localhost:8080'
const ws = new WebSocket('ws://localhost:3000')
const isConnectionOpen = ws.OPEN === ws.readyState

const i18nOptions = {
  timeZone: 'America/Argentina/Buenos_Aires',
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit'
}
const dateText = new Intl.DateTimeFormat('es-AR', i18nOptions).format(new Date())

const textInput = document.getElementById('text-input')
const form = document.querySelector('form')
const submitButton = document.getElementById('submit-button')
const messageList = document.getElementById('messages')
const usersList = document.getElementById('users-list')
const singOut = document.getElementById('logout')
const startChatContainer = document.getElementById('start-chat-container')
const startChat = document.getElementById('start-chat')
const chatContainer = document.getElementById('chat-container')

const wsSendMessage = async (event) => {
  event.preventDefault()

  const message = textInput.value
  if (message.length === 0) {
    return alert('Ingresá texto por favor')
  }
  textInput.value = ''
  const { idUser } = JSON.parse(localStorage.getItem('user'))
  const { username } = await getUser(idUser)
  const messageParam = JSON.stringify({
    message,
    date: dateText,
    idUser,
    username
  })
  ws.send(messageParam)
}

const getUser = async (idUser) => {
  const response = await fetch(`${URL}/user/${idUser}`)
  if (response.status === 200) {
    const { data } = await response.json()
    return data[0]
  }
}

const setMessages = (messages) => {
  if (messages && messages.length > 0) {
    messageList.childNodes.forEach((i) => {
      messageList.removeChild(i)
    })

    const { idUser: idUserSession } = JSON.parse(localStorage.getItem('user'))

    messages.forEach((i) => {
      const { id, idUser, username, message, date } = i

      const messageContentContainer = document.createElement('div')
      messageContentContainer.className = 'card-body'

      const messageContainer = document.createElement('div')
      messageContainer.style = 'width: 30%'
      messageContainer.className = 'card align-self-start'
      messageContainer.id = id

      if (idUser === idUserSession) {
        messageContainer.className = 'card align-self-end'
      }

      const newHeaderMessage = document.createElement('div')
      newHeaderMessage.className = 'd-flex flex-row gap-3'

      const newUser = document.createElement('p')
      newUser.innerHTML = username
      newUser.className = 'card-title'

      const newDate = document.createElement('p')
      newDate.innerHTML = `${date.split(' ')[1]}`
      newDate.className = 'card-title'

      const newParagraph = document.createElement('p')

      newParagraph.innerHTML = message
      newParagraph.className = 'card-text'
      newParagraph.value = id

      newHeaderMessage.appendChild(newUser)
      newHeaderMessage.appendChild(newDate)
      messageContentContainer.appendChild(newHeaderMessage)
      messageContentContainer.appendChild(newParagraph)
      messageContainer.appendChild(messageContentContainer)
      messageList.appendChild(messageContainer)
    })
    messageList.scrollTop = messageList.scrollHeight
  }
}

const setUsers = (users) => {
  const { idUser: idUserSession } = JSON.parse(localStorage.getItem('user'))
  users.forEach((i) => {
    const { username, id } = i

    if (id === idUserSession) return
    const userContainer = document.createElement('li')
    userContainer.value = username
    userContainer.id = id
    userContainer.className = 'list-group-item'

    const userContentContainer = document.createElement('div')
    userContentContainer.className = 'd-flex flex-row align-items-center gap-2'

    const newUser = document.createElement('a')
    newUser.innerHTML = username
    const userLogged = document.createElement('div')
    userLogged.style = 'width: 10px; height: 10px; background-color: gray; border-radius: 50px'

    userContentContainer.appendChild(userLogged)
    userContentContainer.appendChild(newUser)
    userContainer.appendChild(userContentContainer)
    usersList.appendChild(userContainer)
  })
}

const setLoggedUsers = (usersLogged) => {
  if (usersLogged && usersLogged.length > 0) {
    const { idUser: idUserSession } = JSON.parse(localStorage.getItem('user'))
    usersLogged.forEach(({ userLogged }) => {
      if (idUserSession === userLogged) return
      const usersChildren = [...usersList.children]
      const indexUser = usersChildren.findIndex((item) => {
        return parseInt(item.id) === userLogged
      })
      const userContainer = document.createElement('li')
      userContainer.value = usersChildren[indexUser]?.childNodes[0].childNodes[1].innerText
      userContainer.id = userLogged
      userContainer.className = 'list-group-item'

      const userContentContainer = document.createElement('div')
      userContentContainer.className = 'd-flex flex-row align-items-center gap-2'

      const newUser = document.createElement('a')
      newUser.innerHTML = usersChildren[indexUser]?.childNodes[0].childNodes[1].innerText
      const loggedIcon = document.createElement('div')
      loggedIcon.style = 'width: 10px; height: 10px; background-color: green; border-radius: 50px'

      userContentContainer.appendChild(loggedIcon)
      userContentContainer.appendChild(newUser)
      userContainer.appendChild(userContentContainer)

      usersList.removeChild(usersChildren[indexUser])
      usersChildren[indexUser] = userContainer

      usersList.childNodes.forEach((i) => {
        usersList.removeChild(i)
      })
      usersChildren.forEach((i) => {
        usersList.appendChild(i)
      })
    })
  }
}

const setLoggedOutUser = (userLoggedOut) => {
  if (userLoggedOut) {
    const usersChildren = [...usersList.children]
    const indexUser = usersChildren.findIndex((item) => {
      return parseInt(item.id) === userLoggedOut
    })
    const userContainer = document.createElement('li')
    userContainer.value = usersChildren[indexUser]?.childNodes[0].childNodes[1].innerText
    userContainer.id = userLoggedOut
    userContainer.className = 'list-group-item'

    const userContentContainer = document.createElement('div')
    userContentContainer.className = 'd-flex flex-row align-items-center gap-2'

    const newUser = document.createElement('a')
    newUser.innerHTML = usersChildren[indexUser]?.childNodes[0].childNodes[1].innerText
    const loggedIcon = document.createElement('div')
    loggedIcon.style = 'width: 10px; height: 10px; background-color: gray; border-radius: 50px'

    userContentContainer.appendChild(loggedIcon)
    userContentContainer.appendChild(newUser)
    userContainer.appendChild(userContentContainer)

    usersList.removeChild(usersChildren[indexUser])
    usersChildren[indexUser] = userContainer

    usersList.childNodes.forEach((i) => {
      usersList.removeChild(i)
    })
    usersChildren.forEach((i) => {
      usersList.appendChild(i)
    })
  }
}

async function getUsers() {
  const response = await fetch(`${URL}/users`)
  if (response.status === 200) {
    return await response.json()
  }
}

async function handleOnClickLogout() {
  const { idUser } = JSON.parse(localStorage.getItem('user'))
  const response = await fetch(`${URL}/logout`, {
    method: 'DELETE',
    mode: 'cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idUser })
  })
  const data = await response.json()

  if (response.status !== 200) {
    alert(data.message)
    return
  }

  const { idUser: idUserSession } = JSON.parse(localStorage.getItem('user'))
  ws.send(JSON.stringify({ userLeaving: idUserSession }))
  ws.close()
  window.location.href = 'http://localhost:8000/login'
}

async function handleLoadWindow() {
  const { isAdmin } = JSON.parse(localStorage.getItem('user'))
  if (!isAdmin) {
    const navChilds = [...document.getElementsByClassName('navbar-nav')[0].children]
    navChilds.forEach((i, index) => {
      if (index < navChilds.length - 1) {
        document.getElementsByClassName('navbar-nav')[0].removeChild(i)
      }
    })
  }
  const { data: users } = await getUsers()
  if (users.length > 0) {
    setUsers(users)
    return
  }
}

function handleOnClickStartChat() {
  startChatContainer.setAttribute('hidden', true)
  chatContainer.removeAttribute('hidden')
  const { idUser: idUserSession } = JSON.parse(localStorage.getItem('user'))
  ws.send(JSON.stringify({ userLogged: idUserSession }))
}

window.onload = handleLoadWindow
window.onbeforeunload = () => {
  const { idUser: idUserSession } = JSON.parse(localStorage.getItem('user'))
  ws.send(JSON.stringify({ userLeaving: idUserSession }))
  ws.close()
}
form.addEventListener('submit', wsSendMessage)
singOut.addEventListener('click', handleOnClickLogout)
startChat.onclick = handleOnClickStartChat

ws.onmessage = (event) => {
  event.preventDefault()
  const { data } = event
  console.info('mensaje del server', JSON.parse(data))
  const { messages, usersLogged, userLoggedOut } = JSON.parse(data)

  setMessages(messages)
  setLoggedUsers(usersLogged)
  setLoggedOutUser(userLoggedOut)
}
