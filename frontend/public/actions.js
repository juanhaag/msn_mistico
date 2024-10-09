const URL = 'http://localhost:8080'
const tableContainer = document.querySelector('.table-responsive')
const form = document.querySelector('form')
const tbody = document.querySelector('tbody')
const inputAction = document.getElementById('accion')
const select = document.querySelector('select')
const groupSelected = document.getElementById('selected')
const logout = document.getElementById('logout')

async function getGrupos() {
  const response = await fetch(`${URL}/groups`)
  if (response.status === 200) {
    return await response.json()
  }
}

async function getAcciones() {
  const response = await fetch(`${URL}/actions`)
  if (response.status === 200) {
    return await response.json()
  }
}

async function setAccion(name, grupos) {
  await fetch(`${URL}/actions`, {
    method: 'POST',
    mode: 'cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nombre: name, grupos })
  })
}

async function handleOnLoad() {
  const { data: acciones } = await getAcciones()
  const { data: grupos } = await getGrupos()
  if (grupos.length > 0) {
    grupos.forEach((i) => {
      const option = document.createElement('option')
      option.value = JSON.stringify(i)
      option.text = i.name.toUpperCase()
      select.add(option)
    })
  }
  if (acciones.length > 0) {
    acciones.forEach((i) => {
      const tBodyRow = tbody.insertRow()
      const tBodyCellId = tBodyRow.insertCell()
      const tBodyCellName = tBodyRow.insertCell()
      const tBodyCellGroups = tBodyRow.insertCell()
      tBodyCellId.innerText = i.id
      tBodyCellName.innerText = i.name.toUpperCase()
      tBodyCellGroups.innerText = i.groups?.join(', ') || 'Sin grupo'
    })
    return
  }
  const span = document.createElement('span')
  span.innerText = 'No hay datos para listar'
  tableContainer.appendChild(span)
}

async function handleOnSubmit(event) {
  // event.preventDefault()
  const name = inputAction.value
  const optionsSelected = [...groupSelected.children].map((i) => {
    return parseInt(i.id)
  })
  if (name) {
    await setAccion(name, optionsSelected)
  }
}

function handleOnClickButton(event) {
  const { target } = event
  groupSelected.removeChild(target)
}

function handleOnSelectChange() {
  const optionSelected = JSON.parse(select.value)
  const button = document.createElement('button')
  if (!optionSelected) return

  const hasSelected = [...groupSelected.children].some((i) => {
    return parseInt(i.id) === optionSelected.id
  })
  if (!hasSelected) {
    button.className = 'btn btn-danger mb-3 ms-1'
    button.innerText = optionSelected.name
    button.id = optionSelected.id
    button.value = JSON.stringify(optionSelected)
    button.onclick = handleOnClickButton
    groupSelected.appendChild(button)
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

  window.location.href = 'http://localhost:8000/login'
}

document.onload = handleOnLoad()
form.onsubmit = handleOnSubmit
select.onchange = handleOnSelectChange
logout.onclick = handleOnClickLogout
