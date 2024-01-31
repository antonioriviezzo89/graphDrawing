import { Injectable } from '@angular/core';
import chroma from 'chroma-js';

@Injectable({
  providedIn: 'root'
})
export class ColorGenService {
  /*
  private colors = [
    '#0000ff', '#00aa00', '#aa0000', '#5F634F', '#9BC4CB', '#CFEBDF', '#E2FADB', '#DBEFBC', '#C5D5EA', '#7392B7'
  ];
  */
 private colors = [
  "#FF6B6B", "#FFE66D", "#3CAEA3", "#20639B", "#ED553B","#F94144", "#F3722C", "#F8961E", "#F9C74F", "#90BE6D",
  "#2EC4B6", "#39A2DB", "#D3D3D3", "#FFC300", "#FF5733","#E63946", "#F1FAEE", "#A8DADC", "#457B9D", "#1D3557",
  "#F4A261", "#2A9D8F", "#E9C46A", "#E76F51", "#264653","#EF476F", "#FFD166", "#06D6A0", "#118AB2", "#073B4C",
  "#264653", "#2A9D8F", "#E9C46A", "#F4A261", "#E76F51","#F94144", "#F3722C", "#F8961E", "#F9C74F", "#90BE6D"
 ];
  constructor() { }
  
  getLabelBC(index : number | string) : string {
    if(typeof(index) == "string") {
      index = this.labelsToNumber(index);
    }
    let calcIndex = index % this.colors.length;
    let hslValue = chroma.hex(this.colors[calcIndex]).hsl();
    return chroma.hsl(hslValue[0], hslValue[1], hslValue[2]*1.5).hex();
  }
  
  getNodeBorder(index : number | string): string {
    if(typeof(index) == "string") {
      index = this.labelsToNumber(index);
    }
    let calcIndex = index % this.colors.length;
    let hslValue = chroma.hex(this.colors[calcIndex]).hsl();
    return chroma.hsl(hslValue[0], hslValue[1], hslValue[2]*0.8).hex();
    //return this.colors[calcIndex];
  }
  
  getLabelC(index: number | string): string {
    if(typeof(index) == "string") {
      index = this.labelsToNumber(index);
    }
    let calcIndex = index % this.colors.length;
    return this.invertColor(this.colors[calcIndex]);
  }

  invertColor(hex : string) {
    if(hex === undefined) {
      return '#000000';
    }
    if (hex.indexOf('#') === 0) {
        hex = hex.slice(1);
    }
    var r = parseInt(hex.slice(0, 2), 16),
        g = parseInt(hex.slice(2, 4), 16),
        b = parseInt(hex.slice(4, 6), 16);
    return (r * 0.299 + g * 0.587 + b * 0.114) > 100
        ? '#000000'
        : '#FFFFFF';
  }

  private labelsToNumber(lab: string) {
    
    if(lab) {
      let inLabel = lab;
      let out = 0;
      let len = inLabel.length;
      for(let i = 0; i < len; i++){
        out += Math.pow(inLabel[i].charCodeAt(0),i);
      } 
      return out;

    } else {
      return this.colors.length -1;
    }

  }

}
