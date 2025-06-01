export interface Layer {
    id: string;
    visible: boolean;
    source:string;
    geometryType:string;
    style?: any;
    labelOn: boolean;
    fillPolygon?: boolean;
    labelLayers?:any;
  }

export interface MapControlOutputLayer {
    index: number;
    layer: Layer;
  }

  export interface IndexLayerChecked{
  index: number;
  checked: boolean;
}

