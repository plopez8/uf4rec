import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: Socket;

  constructor() {
    this.socket = io('http://localhost:3000');
    this.handleConnection();
  }

  private handleConnection(): void {
    this.socket.on('connect', () => {
      console.log('Conexión establecida con el servidor Socket.IO');
    });
    this.socket.on('comenzarPartida', (data: { jugador: string, miTurno: boolean }) => {
      // Realizar acciones con los datos recibidos
      console.log('Evento "comenzarPartida" recibido:', data);
    });
    this.socket.on('disconnect', () => {
      console.log('Conexión perdida con el servidor Socket.IO');
    });
  }
  synchronizeTropaMovida(callback: (data: any) => void): void {
    this.socket.on('tropaMovida', callback);
    console.log("synco");
  }
  cambioTurno(data: any): void {
    this.socket.emit('cambiarTurno', data);
  }
  
  enviarTropaMovida(data: any): void {
    this.socket.emit('moverTropa', data);
    console.log("moverTropa");
  }
  ubicarTropa(callback: (data: any) => void): void {
    this.socket.on('enviarUbicacionTropa', callback);
  }

  enviarUbicacionTropa(data: any): void {
    this.socket.emit('ubicarTropa', data);
  }

  // Resto de métodos y lógica del servicio

  // Método para suscribirse a eventos del servidor
  subscribe(eventName: string, callback: (...args: any[]) => void): void {
    this.socket.on(eventName, callback);
  }

  // Método para enviar eventos al servidor
  emit(eventName: string, data?: any): void {
    this.socket.emit(eventName, data);
  }
}
