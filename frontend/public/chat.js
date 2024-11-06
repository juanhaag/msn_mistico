const URL = "http://localhost:8081";
const socket = new WebSocket("ws://localhost:3000");
const user = JSON.parse(localStorage.getItem("user"));
const state = localStorage.getItem("state");

if (!user) {
  window.location.href = "/index.html";
}

const i18nOptions = {
  timeZone: "America/Argentina/Buenos_Aires",
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
};
const dateText = new Intl.DateTimeFormat("es-AR", i18nOptions).format(new Date());

const textInput = document.getElementById("text-input");
const form = document.querySelector("form");
const submitButton = document.getElementById("submit-button");
const messageList = document.getElementById("messages");
const usersList = document.getElementById("users-list");
const singOut = document.getElementById("logout");
const startChatContainer = document.getElementById("start-chat-container");
const startChat = document.getElementById("start-chat");
const chatContainer = document.getElementById("chat-container");

function handleOnClickStartChat() {
  if (socket.readyState !== socket.OPEN) {
    alert("Sin conexión al servidor");
    return;
  }
  startChatContainer.setAttribute("hidden", true);
  chatContainer.removeAttribute("hidden");
  submitButton.addEventListener("click", (event) => {
    event.preventDefault();
    sendMessage();
  });
  textInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      sendMessage();
    }
  });
  // Cargar los mensajes desde el Local Storage
  const savedMessages = loadMessages();

  // Crear elementos HTML para los mensajes y agregarlos al contenedor
  savedMessages.forEach((message) => {
    const nuevaPlantilla = createMessageTemplate(message);
    if (message.user === user.idUser) {
      nuevaPlantilla.classList.add("own-message");
    }
    chatContainer.appendChild(nuevaPlantilla);
  });
  console.log("Conexión WebSocket establecida con el servidor");
  // socket.send(JSON.stringify({ username: user.idUser, state: true }));
}

async function handleOnClickLogout() {
  const response = await fetch(`${URL}/logout?token=${localStorage.getItem("token")}`, {
    method: "DELETE",
    mode: "cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idUser: user.idUser }),
  });
  const data = await response.json();

  if (response.status !== 200) {
    alert(data.message);
    return;
  }

  socket.send(JSON.stringify({ userLeaving: user.idUser }));
  socket.close();
  window.location.href = "http://localhost:8000/login";
}

singOut.addEventListener("click", handleOnClickLogout);
startChat.onclick = handleOnClickStartChat;

socket.addEventListener("open", () => {
  console.log("Conexión WebSocket establecida con el servidor");
  socket.send(JSON.stringify({ username: user.idUser, state: true }));
  // Cargar los mensajes desde el Local Storage
  const savedMessages = loadMessages();

  // Crear elementos HTML para los mensajes y agregarlos al contenedor
  savedMessages.forEach((message) => {
    const nuevaPlantilla = createMessageTemplate(message);
    if (message.user === user.idUser) {
      nuevaPlantilla.classList.add("own-message");
    }
    chatContainer.appendChild(nuevaPlantilla);
  });
});

socket.addEventListener("message", (event) => {
  event.preventDefault();
  const datos = JSON.parse(event.data);
  console.log("message datos", datos);
  switch (datos.type) {
    case "keyPair":
      // Almacenar la clave privada en el Local Storage
      localStorage.setItem("privateKey", datos.privateKey);
      break;
    case "message":
      const nuevaPlantilla = createMessageTemplate(datos);
      // Marcar mensajes propios como "own-message"
      if (datos.user === user.idUser) nuevaPlantilla.classList.add("own-message");
      contenedor.appendChild(nuevaPlantilla);
      // Actualizar y guardar los mensajes en el Local Storage
      const chatMessages = loadMessages();
      chatMessages.push(datos);
      saveMessages(chatMessages);
      break;
    default:
      handleFriendState(datos);
      break;
  }
});
///event listeners
// const categoryHeaders = document.querySelectorAll("#contact-list h3");
// categoryHeaders.forEach((header) => {
//     header.addEventListener("click", toggleCategoryList);
// });

/// Chat funtions
function sendMessage() {
  const message = textInput.value;
  if (message.trim() !== "") {
    textInput.value = "";
    const fecha = new Date();

    const formatter = new Intl.DateTimeFormat("es", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });

    const fechaFormateada = formatter.format(fecha);
    const data = {
      type: "message",
      message: message,
      user: user.idUser,
      date: fechaFormateada,
    };
    socket.send(JSON.stringify(data));
  }
}

function saveMessages() {
  // Crear un array para almacenar los mensajes
  const messages = [];
  // Obtener todos los elementos hijos del contenedor
  const messageElements = chatContainer.children;
  // Recorrer los elementos y extraer la información
  for (let i = 0; i < messageElements.length; i++) {
    const messageElement = messageElements[i];
    const messageText = messageElement.querySelector(".message-text").textContent;
    const dateText = messageElement.querySelector(".date").textContent; // Convierte la fecha en milisegundos

    // Agregar la información al array
    messages.push({
      user: userText,
      message: messageText,
      date: dateText, // Convertir la fecha en un objeto de fecha
    });
  }
  // Convertir el array de objetos a una cadena JSON
  const messagesJson = JSON.stringify(messages);
  // Guardar la cadena JSON en el Local Storage
  localStorage.setItem("chatMessages", messagesJson);
}

function createMessageTemplate(data) {
  const { id, idUser, username, message, date } = data;
  const messageContentContainer = document.createElement("div");
  messageContentContainer.className = "card-body";

  const messageContainer = document.createElement("div");
  messageContainer.style = "width: 30%";
  messageContainer.className = "card align-self-start";
  messageContainer.id = id;

  if (idUser === user) {
    messageContainer.className = "card align-self-end";
  }

  const newHeaderMessage = document.createElement("div");
  newHeaderMessage.className = "d-flex flex-row gap-3";
  const newUser = document.createElement("p");
  console.log(username);
  newUser.innerHTML = username;
  newUser.className = "card-title";

  const newDate = document.createElement("p");
  newDate.innerHTML = `${date.split(" ")[1]}`;
  newDate.className = "card-title";

  const newParagraph = document.createElement("p");

  newParagraph.innerHTML = message;
  newParagraph.className = "card-text";
  newParagraph.value = id;

  newHeaderMessage.appendChild(newUser);
  newHeaderMessage.appendChild(newDate);
  messageContentContainer.appendChild(newHeaderMessage);
  messageContentContainer.appendChild(newParagraph);
  messageContainer.appendChild(messageContentContainer);
  return messageContainer;
}

function loadMessages() {
  const messagesJson = localStorage.getItem("chatMessages");
  if (messagesJson) {
    return JSON.parse(messagesJson);
  } else {
    return [];
  }
}

async function getUser(idUser) {
  const response = await fetch(`${URL}/user/${idUser}?token=${localStorage.getItem("token")}`);
  if (response.status === 200) {
    const { data } = await response.json();
    return data[0][0];
  }
}

//friends list
function handleFriendState(datos) {
  usersList.childNodes.forEach((i) => usersList.removeChild(i));
  if (!Array.isArray(datos)) {
    const friendElement = createFriendStateElement(datos);
    usersList.appendChild(friendElement);
  } else {
    datos.forEach(async (data) => {
      if (data.username === user.idUser) return;
      const friendElement = await createFriendStateElement(data);
      usersList.appendChild(friendElement);
    });
  }
}

async function createFriendStateElement(datos) {
  const user = await getUser(datos.username);
  const friendElement = document.createElement("li");
  const nameElement = document.createElement("p");
  nameElement.textContent = user.username;
  friendElement.appendChild(nameElement);
  return friendElement;
}
