/* eslint-disable camelcase */
const URL = 'http://localhost:8080'
const URL_BIOMETRIC = 'http://127.0.0.1:8000'
const video = document.getElementById('video')

function startVideo() {
  navigator.getUserMedia(
    { video: {} },
    (stream) => {
      video.srcObject = stream
    },
    (err) => {
      console.error(err)
    }
  )
}
startVideo()

const validatorBiometric = () => {
  const { idUser } = JSON.parse(localStorage.getItem('user'))
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')
  setTimeout(async () => {
    context.drawImage(video, 0, 0, canvas.width, canvas.height)
    const dataURL = canvas.toDataURL('image/png')

    const responseBiometric = await fetch(`${URL_BIOMETRIC}/biometric`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ idUser, biometric_ref: dataURL })
    })

    const { error, status } = await responseBiometric.json()

    if (error || status !== '200') {
      alert('Error, intente de nuevo mas tarde')
      window.location.href = 'http://localhost:8000/login'
      return
    }

    const { username, password } = JSON.parse(localStorage.getItem('userData'))

    const response = await fetch(`${URL}/login`, {
      method: 'POST',
      mode: 'cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    })

    const { data } = await response.json()

    localStorage.removeItem('userData')
    if (response.status !== 200) {
      alert('Error, intente de nuevo mas tarde')
      window.location.href = 'http://localhost:8000/login'
      return
    }

    localStorage.setItem('user', JSON.stringify(data))

    if (data.isAdmin) {
      window.location.href = 'http://localhost:8000/users'
      return
    }
    window.location.href = 'http://localhost:8000/chat'
  }, 100)
}

video.onloadeddata = validatorBiometric
document.getElementById('scan').onclick = validatorBiometric
