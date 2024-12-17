const express = require('express');
const app = express();

const http = require('http').createServer(app);
const io = require('socket.io')(http);



app.set("view engine", "ejs");

app.get("/", (req, res) => {
    res.render("chat");
});

// Gestion des connexions Socket.IO
io.on("connection", (socket) => {
    console.log("Un utilisateur s'est connecté.");
  
    // Écouter l'événement "messageUtilisateur" envoyé par un client
    socket.on("messageUtilisateur", (msg) => {
      console.log("Message utilisateur reçu :", msg);
  
      // Diffuser le message à tous les autres clients connectés
      io.emit("nouveauMessage", msg); // Le serveur émet "nouveauMessage"
    });
  
    // Gérer la déconnexion d'un utilisateur
    socket.on("disconnect", () => {
      console.log("Un utilisateur s'est déconnecté.");
    });
  });

  http.listen(3000, () => {
    console.log(`Serveur en cours d'exécution sur le port http://localhost:3000`);
  });
