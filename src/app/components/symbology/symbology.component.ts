import { Component, input } from '@angular/core';
import { Layer } from '../../viewmodels/layer';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-symbology',
  imports: [CommonModule],
  templateUrl: './symbology.component.html',
  styleUrl: './symbology.component.scss'
})
export class SymbologyComponent {
 layer = input.required<Layer>();
}
