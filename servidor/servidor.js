const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

// Configuración del servidor
const port = 3000;

// Middleware de Express para servir archivos estáticos
app.use(express.static('public'));

// Manejador de eventos de conexión de Socket.IO
io.on('connection', (socket) => {
  console.log('Nuevo jugador conectado:', socket.id);

  // Emitir evento al cliente para establecer el turno inicial
  socket.emit('turno', { jugador: 1 });

  // Manejar el evento de movimiento de tropa recibido del cliente
  socket.on('moverTropa', (data) => {
    // Emitir evento a todos los demás clientes para actualizar el movimiento de la tropa
    socket.broadcast.emit('tropaMovida', data);
  });

  // Manejar el evento de cambio de turno recibido del cliente
  socket.on('cambiarTurno', (data) => {
    // Emitir evento a todos los demás clientes para actualizar el cambio de turno
    socket.broadcast.emit('turno', { jugador: data.jugador });
  });

  // Manejar el evento de desconexión del cliente
  socket.on('disconnect', () => {
    console.log('Jugador desconectado:', socket.id);
  });
});

// Iniciar el servidor
http.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});
