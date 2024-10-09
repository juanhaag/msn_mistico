const URL = 'http://localhost:8080'
const tableContainer = document.querySelector('.table-responsive')
const emptyText = document.getElementById('empty-text')
const form = document.querySelector('form')
const inputGroup = document.getElementById('grupo')
const tbody = document.querySelector('tbody')
const logout = document.getElementById('logout')

async function getGrupos() {
  const response = await fetch(`${URL}/groups`)
  if (response.status === 200) {
    return await response.json()
  }
}

async function handleOnLoad() {
  const { data: grupos } = await getGrupos()
  if (grupos.length > 0) {
    grupos.forEach((i) => {
      const tBodyRow = tbody.insertRow()
      const tBodyCellId = tBodyRow.insertCell()
      const tBodyCellName = tBodyRow.insertCell()
      const tBodyCellActionName = tBodyRow.insertCell()

      tBodyCellId.innerText = i.id
      tBodyCellName.innerText = i.name
      tBodyCellActionName.innerText = i.users?.join(', ') || 'Sin usuarios asignados'
    })
    return
  }
  const span = document.createElement('span')
  span.id = 'empty-text'
  span.innerText = 'No hay datos para listar'
  tableContainer.appendChild(span)
}

async function handleOnSubmit() {
  const name = inputGroup.value
  await fetch(`${URL}/groups`, {
    method: 'POST',
    mode: 'cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nombre: name })
  })
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
logout.onclick = handleOnClickLogout
