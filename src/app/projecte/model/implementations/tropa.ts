import { ITropa } from "../interfaces/tropa/itropa";

export class Tropa implements ITropa{
    salut: number;
    defensa: number;
    atac: number;
    fiabilitat: number;
    x: number;
    y: number;

    constructor() {
        this.salut = 100;
        this.defensa = 0;
        this.atac = 0;
        this.fiabilitat = 0;
        this.x = 0;
        this.y = 0;
        this.generarEstadisticasAleatorias();
      }
    
      private generarEstadisticasAleatorias(): void {
        const min = 1;
        const max = 98;
        const valor = Math.floor(Math.random() * (max - min + 1)) + min;
        this.defensa = valor;
        this.atac = Math.floor(Math.random() * (max - min - valor + 1)) + min;
        this.fiabilitat = 100 - this.defensa - this.atac;
      }
}