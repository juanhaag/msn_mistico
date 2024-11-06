const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const fs = require("fs").promises; // Importar fs.promises para usar promesas

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const PORT = 3000;

const connectedUsers = [];
const disconnectedUsers = [];

// Host de front end
app.use(express.static("../"));

server.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});

// WebSocket para mensajes
wss.on("connection", handleWebSocketConnection);

function handleWebSocketConnection(ws) {
    console.log("Conexión para mensajes: OK");
    ws.on("message", async (message) => {
        try {
            const data = JSON.parse(message);
            if (data.state) {
                handleUserConnection(data, ws);
            } else {
                await handleReceivedMessage(data, message);
            }
        } catch (error) {
            console.error("Error al analizar el mensaje JSON:", error);
        }
    });

    // Manejo de desconexiones de usuarios y eliminación del usuario de connectedUsers
    ws.on("close", () => {
        handleUserDisconnect(ws);
    });
}

function handleUserConnection(data, ws) {
    const { username, state } = data;
    connectedUsers.push({ username, state, ws });

    // Envía a todos los usuarios conectados la lista actualizada de todos los usuarios
    sendUserListToAll();
}
function handleUserDisconnect(ws) {
    // Elimina al usuario de la lista de usuarios conectados
    const index = connectedUsers.findIndex((user) => user.ws === ws);
    if (index !== -1) {
        const disconnectedUser = connectedUsers.splice(index, 1)[0];
        console.log(`Usuario desconectado: ${disconnectedUser.username}`);

        // Agrega al usuario desconectado a la lista de usuarios desconectados
        disconnectedUsers.push({
            username: disconnectedUser.username,
            state: "offline",
        });

        // Envía a todos los usuarios conectados la lista actualizada de usuarios desconectados
        sendUserListToAll();
    }
}
function sendUserListToAll() {
    // Concatena los usuarios conectados y desconectados
    const allUsers = [...connectedUsers, ...disconnectedUsers];

    // Filtra duplicados en base al username
    const uniqueUsers = allUsers.filter(
        (user, index, self) =>
            index === self.findIndex((u) => u.username === user.username)
    );

    // Envía la lista de usuarios a todos los usuarios conectados
    sendToAllConnectedUsers(JSON.stringify(uniqueUsers));
}
function sendToAllConnectedUsers(message) {
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    });
}
async function handleReceivedMessage(data, message) {
    console.log(`Mensaje recibido del frontend: ${message}`);
    sendToAllConnectedUsers(JSON.stringify(data));
}