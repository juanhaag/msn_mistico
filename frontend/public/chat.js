const socket = new WebSocket("ws://192.168.100.13:3000");
const user = localStorage.getItem("user");
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
const dateText = new Intl.DateTimeFormat("es-AR", i18nOptions).format(
    new Date()
);

const textInput = document.getElementById("text-input");
const form = document.querySelector("form");
const submitButton = document.getElementById("submit-button");
const messageList = document.getElementById("messages");
const usersList = document.getElementById("users-list");
const singOut = document.getElementById("logout");
const startChatContainer = document.getElementById("start-chat-container");
const startChat = document.getElementById("start-chat");
const chatContainer = document.getElementById("chat-container");

async function handleOnClickStartChat() {
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
    const savedMessages = await loadMessages();

    // Crear elementos HTML para los mensajes y agregarlos al contenedor
    savedMessages.forEach((message) => {
        const nuevaPlantilla = createMessageTemplate(message);
        if (message.user === user) {
            nuevaPlantilla.classList.add("own-message");
        }
        chatContainer.appendChild(nuevaPlantilla);
    });
    const { idUser: idUserSession } = JSON.parse(localStorage.getItem("user"));
    console.log("Conexión WebSocket establecida con el servidor");
    socket.send(JSON.stringify({ username: idUserSession, state: state }));
}
async function handleOnClickLogout() {
    const { idUser } = JSON.parse(localStorage.getItem("user"));
    const response = await fetch(
        `${URL}/logout?token=${localStorage.getItem("token")}`,
        {
            method: "DELETE",
            mode: "cors",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ idUser }),
        }
    );
    const data = await response.json();

    if (response.status !== 200) {
        alert(data.message);
        return;
    }

    const { idUser: idUserSession } = JSON.parse(localStorage.getItem("user"));
    socket.send(JSON.stringify({ userLeaving: idUserSession }));
    socket.close();
    window.location.href = "http://localhost:8000/login";
}


singOut.addEventListener("click", handleOnClickLogout);
startChat.onclick = handleOnClickStartChat;

socket.addEventListener("open", async () => {
  console.log("Conexión WebSocket establecida con el servidor");
  socket.send(JSON.stringify({ username: user, state: state }));
  // Cargar los mensajes desde el Local Storage
  const savedMessages = await loadMessages();

  // Obtener el contenedor de chat por su ID
  const chatContainer = document.getElementById("chat-container");

  // Crear elementos HTML para los mensajes y agregarlos al contenedor
  savedMessages.forEach((message) => {
    const nuevaPlantilla = createMessageTemplate(message);
    if (message.user === user) {
      nuevaPlantilla.classList.add("own-message");
    }
    chatContainer.appendChild(nuevaPlantilla);
  });
});

socket.addEventListener("message", async (event) => {
  event.preventDefault();
  const datos = JSON.parse(event.data);
  const contenedor = document.getElementById("chat-container");
  switch (datos.type) {
    case "keyPair":
      // Almacenar la clave privada en el Local Storage
      localStorage.setItem("privateKey", datos.privateKey);
      break;
    case "message":
      const nuevaPlantilla = createMessageTemplate(datos);
      // Marcar mensajes propios como "own-message"
      if (datos.user === user) nuevaPlantilla.classList.add("own-message");
      contenedor.appendChild(nuevaPlantilla);
      // Actualizar y guardar los mensajes en el Local Storage
      const chatMessages = await loadMessages();
      chatMessages.push(datos);
      saveMessages(chatMessages);
      break;
    default:
      handleFriendState(datos);
      break;
  }
});
///event listeners
const categoryHeaders = document.querySelectorAll("#contact-list h3");
categoryHeaders.forEach((header) => {
  header.addEventListener("click", toggleCategoryList);
});

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
      user: user,
      date: fechaFormateada,
    };
    socket.send(JSON.stringify(data));
  }
}
function saveMessages() {
  // Obtener el contenedor de chat por su ID
  const chatContainer = document.getElementById("chat-container");
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
async function loadMessages() {
  const messagesJson = localStorage.getItem("chatMessages");
  if (messagesJson) {
    return JSON.parse(messagesJson);
  } else {
    return [];
  }
}

async function getUser(idUser) {
  const response = await fetch(`${URL}/user/${idUser}?token=${localStorage.getItem('token')}`)
  if (response.status === 200) {
    const { data } = await response.json()
    return data[0][0]
  }
}

//friends list
function handleFriendState(datos) {
  if (typeof datos === "object") {
    const friendElement = createFriendStateElement(datos);
    usersList.appendChild(friendElement);
  }else{
    datos.forEach((user) => {
        const friendElement = createFriendStateElement(user);
        usersList.appendChild(friendElement);
    });
  }
}
function createFriendStateElement(datos) {
  const friendElement = document.createElement("li");
  const nameElement = document.createElement("p");
  nameElement.textContent = datos.username;
  friendElement.appendChild(nameElement);
  return friendElement;
}