const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server, {
  cors: {
    origin: '*'
  }
});
const port = 3000;
let jugadoresConectados = [];
let partidaActual = null;
let jugador1 = null;
let jugador2 = null;

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
    jugador1 = jugadoresConectados[0].socket;
    jugador2 = jugadoresConectados[1].socket;
    partidaActual = {
      jugadores: jugadoresConectados.slice(0, 2)
    };
    console.log('¡Partida formada! Los jugadores', partidaActual.jugadores.map(jugador => jugador.id), 'están en la misma partida.');

    // Envía eventos a los jugadores para sincronizar su estado de juego
    jugador1.emit('iniciarPartida', { jugador: 'jugador1', miTurno: true });
    jugador2.emit('iniciarPartida', { jugador: 'jugador2', miTurno: false });

    // Limpia la lista de jugadores conectados
    jugadoresConectados = [];
  }

  socket.on('ubicarTropa', (data) => {
    // Resto de acciones necesarias para enviar la ubicación de la tropa a otros jugadores
    socket.broadcast.emit('enviarUbicacionTropa', data); // Envía la ubicación a todos los demás jugadores
  });

  socket.on('cambiarTurno', (data) => {
    socket.broadcast.emit('cambiarTurno', data);
  });

  socket.on('disconnect', () => {
    console.log('Jugador desconectado:', socket.id);

    // Elimina al jugador de la lista de jugadores conectados si aún no se ha asignado a una partida
    jugadoresConectados = jugadoresConectados.filter((jugador) => jugador.id !== socket.id);

    // Si un jugador se desconecta, termina la partida actual y avisa al otro jugador
    if (socket === jugador1 || socket === jugador2) {
      jugador1 = null;
      jugador2 = null;
      partidaActual = null;

      if (socket === jugador1) {
        jugador2.emit('finalizarPartida', { motivo: 'El jugador 1 se ha desconectado' });
      } else {
        jugador1.emit('finalizarPartida', { motivo: 'El jugador 2 se ha desconectado' });
      }
    }
  });
});
