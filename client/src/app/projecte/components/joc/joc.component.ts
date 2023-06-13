import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Tropa } from '../../model/implementations/tropa';
import { SocketService } from '../../service/socket.service';

@Component({
  selector: 'app-joc',
  templateUrl: './joc.component.html',
  styleUrls: ['./joc.component.css']
})
export class JocComponent implements OnInit {
  @ViewChild('canvasElement', { static: true })
  canvasElement!: ElementRef<HTMLCanvasElement>;
  tropas: Tropa[] = [];
  selectedTropa: Tropa | null = null;
  posicionesTropas: { tropa: Tropa, x: number, y: number }[] = [];

  estadisticasTropa: { salud: number, defensa: number, ataque: number, fiabilidad: number } = {
    salud: 0,
    defensa: 0,
    ataque: 0,
    fiabilidad: 0
  };
  miTurno: boolean = false;
  jugadorActual: string = '';
  // constructor() {}
  constructor(private socketService: SocketService) {}


  ngOnInit() {

    this.socketService.ubicarTropa((data) => {
      this.ubicarTropa(data.tropa, data.x, data.y);
    });
    this.socketService.subscribe('iniciarPartida', (data: { jugador: string, miTurno: boolean }) => {
      this.jugadorActual = data.jugador;
      this.miTurno = data.miTurno;
      // Resto de acciones necesarias para el inicio de la partida
    });
    
    this.socketService.subscribe('turno', (data: { jugadorActual: string, miTurno: boolean }) => {
      this.jugadorActual = data.jugadorActual;
      this.miTurno = data.miTurno;
      // Resto de acciones necesarias para establecer el turno inicial
    });
    
  
    this.socketService.synchronizeTropaMovida((data) => {
      // Resto de acciones necesarias para actualizar el movimiento de tropa
    });
  
    this.socketService.cambioTurno((data: { jugadorActual: string, miTurno: boolean }) => {
      this.jugadorActual = data.jugadorActual;
      this.miTurno = data.miTurno;
      // Resto de acciones necesarias para actualizar el cambio de turno
    });
  
    this.crearTropas();
  }
  


  seleccionarTropa(tropa: Tropa): void {
    this.selectedTropa = tropa;
    this.estadisticasTropa.salud = tropa.salut;
    this.estadisticasTropa.defensa = tropa.defensa;
    this.estadisticasTropa.ataque = tropa.atac;
    this.estadisticasTropa.fiabilidad = tropa.fiabilitat;
  }



  onCanvasClick(event: MouseEvent): void {
    if (this.miTurno) {
    const canvasRect = this.canvasElement.nativeElement.getBoundingClientRect();
    const x = event.clientX - canvasRect.left;
    const y = event.clientY - canvasRect.top;
  
    for (let i = this.posicionesTropas.length - 1; i >= 0; i--) {
      const posicionTropa = this.posicionesTropas[i];
      if (x >= posicionTropa.x && x <= posicionTropa.x + 30 && y >= posicionTropa.y && y <= posicionTropa.y + 30) {
        this.seleccionarTropa(posicionTropa.tropa);
        break;
      }
    }
  }
  }

  moverTropa(direccion: string): void {
    if (this.miTurno) {
    console.log(this.miTurno);
    if (this.selectedTropa) {
      const canvas = this.canvasElement.nativeElement;
      const ctx = canvas.getContext('2d');
  
      if (ctx) {
        // Borra la tropa de la posición anterior
        ctx.clearRect(this.selectedTropa.x, this.selectedTropa.y, 30, 30);
  
        // Calcula las nuevas coordenadas según la dirección
        let newX = this.selectedTropa.x;
        let newY = this.selectedTropa.y;
  
        switch (direccion) {
          case 'arriba':
            newY -= 10;
            break;
          case 'abajo':
            newY += 10;
            break;
          case 'izquierda':
            newX -= 10;
            break;
          case 'derecha':
            newX += 10;
            break;
        }
  
        // Controla los bordes del canvas
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
        const troopSize = 30;
  
        if (newX < 0) {
          newX = 0;
        } else if (newX + troopSize > canvasWidth) {
          newX = canvasWidth - troopSize;
        }
  
        if (newY < 0) {
          newY = 0;
        } else if (newY + troopSize > canvasHeight) {
          newY = canvasHeight - troopSize;
        }
  
        // Actualiza la posición de la tropa seleccionada
        this.selectedTropa.x = newX;
        this.selectedTropa.y = newY;
  
        // Dibuja la tropa en la nueva posición
        const image = new Image();
        image.src = '../../../../assets/Imatges/aSoldier.png';
        image.onload = () => {
          ctx.drawImage(image, newX, newY, 30, 30);
        };

        // Envía el movimiento de tropa al servidor Socket.IO
        this.socketService.enviarTropaMovida({ tropa: this.selectedTropa, x: newX, y: newY });
      }
    }
  }
  }

  onMouseMove(event: MouseEvent): void {
    const canvasRect = this.canvasElement.nativeElement.getBoundingClientRect();
    const x = event.clientX - canvasRect.left;
    const y = event.clientY - canvasRect.top;

    if (this.selectedTropa) {
      for (const posicionTropa of this.posicionesTropas) {
        if (x >= posicionTropa.x && x <= posicionTropa.x + 30 && y >= posicionTropa.y && y <= posicionTropa.y + 30) {
          this.estadisticasTropa.salud = posicionTropa.tropa.salut;
          this.estadisticasTropa.defensa = posicionTropa.tropa.defensa;
          this.estadisticasTropa.ataque = posicionTropa.tropa.atac;
          this.estadisticasTropa.fiabilidad = posicionTropa.tropa.fiabilitat;
          break;
        }
      }
    } else {
      this.estadisticasTropa = {
        salud: 0,
        defensa: 0,
        ataque: 0,
        fiabilidad: 0
      };
    }
  }

  crearTropas() {
    for (let i = 0; i < 10; i++) {
      const tropa = new Tropa();
      this.tropas.push(tropa);
    }
  }

  ubicarTropa(tropa: Tropa, x: number, y: number): void {
    const canvas = this.canvasElement.nativeElement;
    const ctx = canvas.getContext('2d');
  
    if (ctx) {
      const image = new Image();
      image.src = '../../../../assets/Imatges/aSoldier.png';
      image.onload = () => {
        ctx.drawImage(image, x, y, 30, 30);
      };
  
      tropa.x = x;
      tropa.y = y;
  
      this.posicionesTropas.push({ tropa: tropa, x: x, y: y });
  
      this.selectedTropa = tropa;
  
      // Marcar la tropa como utilizada
      tropa.utilizada = true;
      console.log("ubicar-funcioncomp");
      if (this.miTurno) {
        this.socketService.cambioTurno({ jugadorActual: this.jugadorActual, miTurno: false });
      }
      // this.socketService.emit('ubicarTropa', { tropa, x, y });
    }
  }

  onDragStart(event: DragEvent, tropa: Tropa): void {
    event.dataTransfer?.setData('text/plain', JSON.stringify(tropa));
  }

  onDragOverCanvas(event: DragEvent): void {
    event.preventDefault();
  }


  onDropCanvas(event: DragEvent): void {
    if (this.miTurno) {
    event.preventDefault();
    const tropaData = event.dataTransfer?.getData('text/plain');
    if (tropaData) {
      const tropa = JSON.parse(tropaData);
      const canvasRect = this.canvasElement.nativeElement.getBoundingClientRect();
      const x = event.clientX - canvasRect.left;
      const y = event.clientY - canvasRect.top;

      // Ubicar la tropa localmente en el cliente
      this.ubicarTropa(tropa, x, y);

      // Envía información de ubicación de la tropa al servidor Socket.IO
      this.socketService.enviarUbicacionTropa({ tropa, x, y });
      if (this.miTurno) {
        this.socketService.cambioTurno({ jugadorActual: this.jugadorActual, miTurno: false });
      }
    }
  }
}
}
