import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { OverlayModule } from '@angular/cdk/overlay';

declare const google: any; // Declare google to avoid TypeScript errors

interface MapTypeOption {
  id: string;
  name: string;
  imageUrl:string;
}


@Component({
  selector: 'base-map-selector',
  imports: [MatIconModule,OverlayModule,],
  templateUrl: './base-map-selector.component.html',
  styleUrl: './base-map-selector.component.scss'
})
export class BaseMapSelectorComponent implements OnChanges{
  isOpen = false;
  mapTypes: MapTypeOption[] = [
    { id: google.maps.MapTypeId.ROADMAP, name: 'Roadmap',imageUrl: 'assets/images/basemap_roadmap.png' },
    { id: google.maps.MapTypeId.SATELLITE, name: 'Satellite',imageUrl: 'assets/images/basemap_satellite.png' },
    { id: google.maps.MapTypeId.HYBRID, name: 'Hybrid',imageUrl: 'assets/images/basemap_hybrid.png' },
    { id: google.maps.MapTypeId.TERRAIN, name: 'Terrain' ,imageUrl: 'assets/images/basemap_terrain.png'},
  ];


  @Input() activeMapTypeId: string;
  @Output() mapTypeSelected = new EventEmitter<string>();

  ngOnChanges(changes: SimpleChanges): void {

  }

  selectMapType(mapTypeId: string): void {
    if (this.activeMapTypeId !== mapTypeId) {
      this.activeMapTypeId = mapTypeId;
      this.mapTypeSelected.emit(mapTypeId);
    }
  }


  toggle(){
    this.isOpen = !this.isOpen;
  }
}
