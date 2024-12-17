const express = require('express');
const path = require('path');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

// Configuration d'EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Route pour afficher le chat
app.get("/", (req, res) => {
    res.render("chat");
});

// Gestion des connexions Socket.IO
io.on("connection", (socket) => {
    console.log("Un utilisateur s'est connecté.");

    // Stocker le nom d'utilisateur lorsqu'il est envoyé
    socket.on("setUsername", (username) => {
        socket.username = username || "Anonyme";
        console.log(`Nom d'utilisateur défini : ${socket.username}`);
    });

    // Réception des messages des utilisateurs
    socket.on("messageUtilisateur", (message) => {
        console.log(`${socket.username} : ${message}`);

        // Diffuser le message avec le nom d'utilisateur
        io.emit("nouveauMessage", { username: socket.username, message });
    });

    // Déconnexion
    socket.on("disconnect", () => {
        console.log(`${socket.username || "Un utilisateur"} s'est déconnecté.`);
    });
});

// Démarrage du serveur
const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
    console.log(`Serveur en cours d'exécution sur http://localhost:${PORT}`);
});