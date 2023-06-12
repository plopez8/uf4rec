import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Tropa } from '../../model/implementations/tropa';

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
  seleccionarTropa(tropa: Tropa): void {
    this.selectedTropa = tropa;
    this.estadisticasTropa.salud = tropa.salut;
    this.estadisticasTropa.defensa = tropa.defensa;
    this.estadisticasTropa.ataque = tropa.atac;
    this.estadisticasTropa.fiabilidad = tropa.fiabilitat;
  }
  ngOnInit() {
    this.crearTropas();
  }
  onCanvasClick(event: MouseEvent): void {
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
    }
  }

  onDragStart(event: DragEvent, tropa: Tropa): void {
    event.dataTransfer?.setData('text/plain', JSON.stringify(tropa));
  }

  onDragOverCanvas(event: DragEvent): void {
    event.preventDefault();
  }

  onDropCanvas(event: DragEvent): void {
    event.preventDefault();
    const tropaData = event.dataTransfer?.getData('text/plain');
    if (tropaData) {
      const tropa = JSON.parse(tropaData);
      const canvasRect = this.canvasElement.nativeElement.getBoundingClientRect();
      const x = event.clientX - canvasRect.left;
      const y = event.clientY - canvasRect.top;
      this.ubicarTropa(tropa, x, y);
    }
  }
}
