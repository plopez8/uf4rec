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

  ngOnInit() {
    this.crearTropas();
  }

  crearTropas() {
    for (let i = 0; i < 10; i++) {
      const tropa = new Tropa();
      this.tropas.push(tropa);
    }
  }
  ubicarTropa(tropa: Tropa): void {
    const canvas = this.canvasElement.nativeElement;
    const ctx = canvas.getContext('2d');
  
    if (ctx) {
      const image = new Image();
      image.src = '../../../../assets/Imatges/aSoldier.png';
      image.onload = () => {
        ctx.drawImage(image, 0, 0);
      };
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
      this.ubicarTropa(tropa);
    }
  }
}
