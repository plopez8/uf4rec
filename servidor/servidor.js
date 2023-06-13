const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server , {
    cors: {
        origin : '*'
    }
} )
const port = 3000;
let jugadoresConectados = [];
let partidaActual = null;

server.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});
// Manejador de eventos de conexión de Socket.IO
io.on('connection', (socket) => {
    console.log('Nuevo jugador conectado:', socket.id);
  
    jugadoresConectados.push({
      id: socket.id,
      socket: socket
    });
  
    if (jugadoresConectados.length === 2) {
      partidaActual = {
        jugadores: jugadoresConectados.slice(0, 2)
      };
      console.log('¡Partida formada! Los jugadores', partidaActual.jugadores.map(jugador => jugador.id), 'están en la misma partida.');
      // Envía eventos a los jugadores para sincronizar su estado de juego
      partidaActual.jugadores.forEach((jugador) => {
        jugador.socket.emit('iniciarPartida');
      });
  
      // Limpia la lista de jugadores conectados
      jugadoresConectados = [];
    }
  
    socket.on('disconnect', () => {
      console.log('Jugador desconectado:', socket.id);
  
      // Elimina al jugador de la lista de jugadores conectados si aún no se ha asignado a una partida
      jugadoresConectados = jugadoresConectados.filter((jugador) => jugador.id !== socket.id);
    });
  });
