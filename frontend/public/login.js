const URL = 'http://localhost:8081'
const buttonBiometric = document.getElementById('login-biometric')
const checkbox = document.getElementById('showPassword')
const password = document.getElementById('password')
const username = document.getElementById('username')
const codigo = document.getElementById('codigo')
const codigoContainer = document.getElementById('codigo-container')
const errorLabelUser = document.getElementById('errorLabelUser')
const errorLabelPass = document.getElementById('errorLabelPass')
const form = document.querySelector('form')

function handleClickBiometric(event) {
  event.preventDefault()
  if (!username.value || !password.value) return null

  localStorage.setItem('userData', JSON.stringify({ username: username.value, password: password.value }))

  window.location.href = 'http://localhost:8000/biometric'
}

function handleChangeCheckbox({ target: { checked } }) {
  if (checked) {
    password.setAttribute('type', 'text')
    return
  }
  password.setAttribute('type', 'password')
}

async function handleSubmit(event) {
  event.preventDefault()

  const user = username.value
  const pass = password.value
  const codigoInput = codigo.value

  if (!pass.match(/^(?=.*\d).{4,8}$/)) {
    password.className += ' border-danger'
    errorLabelPass.innerText = 'Password must be between 4 and 8 digits long and include at least one numeric digit.'
    return
  }

  const response = await fetch(`${URL}/login`, {
    method: 'POST',
    mode: 'cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: user, password: pass, codigoValidacion: codigoInput })
  })

  const { data } = await response.json()
  if (response.status === 401) { // flujo si tiene que validar código de sms
    codigo.setAttribute('required', true)
    codigoContainer.style.display = 'block'
    password.className += ' border-danger'
    username.className += ' border-danger'
    errorLabelPass.innerText = data.message
    errorLabelUser.innerText = data.message
    return
  }
  if (response.status !== 200) {
    password.className += ' border-danger'
    username.className += ' border-danger'
    errorLabelPass.innerText = data.message
    errorLabelUser.innerText = data.message
    return
  }
  localStorage.setItem('token', data.authToken)
  localStorage.setItem('user', JSON.stringify(data))

  if (data.isAdmin) {
    window.location.href = 'http://localhost:8000/users'
    return
  }
  window.location.href = 'http://localhost:8000/chat'
}

function handleInputFocus() {
  password.className = 'form-control'
  username.className = 'form-control'
  errorLabelPass.innerText = ''
  errorLabelUser.innerText = ''
}

checkbox.onchange = handleChangeCheckbox
form.onsubmit = handleSubmit
password.onfocus = handleInputFocus
username.onfocus = handleInputFocus
buttonBiometric.onclick = handleClickBiometric
