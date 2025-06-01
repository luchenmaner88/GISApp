import { Component, Input,  output } from '@angular/core';
import { OverlayModule } from '@angular/cdk/overlay';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { IndexLayerChecked, Layer, MapControlOutputLayer } from '../../../viewmodels/layer';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SymbologyComponent } from "../../symbology/symbology.component";

@Component({
  selector: 'controller-layer-management',
  imports: [CommonModule, OverlayModule, MatCheckboxModule, MatIconModule, MatButtonModule, MatTooltipModule, SymbologyComponent],
  templateUrl: './layer-management.component.html',
  styleUrl: './layer-management.component.scss',
})


export class LayerManagementComponent {
  isOpen = false;
  @Input() layers: Layer[] = [];
  layerVisibilityChange = output<IndexLayerChecked>();
  toggleLabel = output<IndexLayerChecked>();
  boundaryLayer = output<IndexLayerChecked>();

  toggleCheckbox(index: number, checked: boolean) {
    let out = {index:index, checked: checked } as IndexLayerChecked
    this.layerVisibilityChange.emit(out);
  }

  toggle() {
    this.isOpen = !this.isOpen;
  }

  labelLayer(layerIndex: number, labelOn: boolean) {
    let out = {index:layerIndex, checked: !labelOn } as IndexLayerChecked
    this.toggleLabel.emit(out);
  }

  fillPolygon(layerIndex: number, polyFilled: boolean) {

    let out = {index:layerIndex, checked: !polyFilled } as IndexLayerChecked
    this.boundaryLayer.emit(out);
  }
}
