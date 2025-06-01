import {
  Component,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';

import { GoogleMapsModule, GoogleMap, MapInfoWindow, MapBaseLayer } from '@angular/google-maps';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { IndexLayerChecked, Layer } from '../../viewmodels/layer';
import { LayerManagementComponent } from '../map-controllers/layer-management/layer-management.component';
import { BaseMapSelectorComponent } from '../map-controllers/base-map-selector/base-map-selector.component';
import { LayerService } from '../../services/layer.service';
import { FeatureService } from '../../services/feature.service';
import { PolygonLabelOverlay } from './polygon-label';


@Component({
  selector: 'app-googlemap',
  imports: [
    GoogleMapsModule,
    FormsModule,
    LayerManagementComponent,
    BaseMapSelectorComponent,
  ],
  templateUrl: './googlemap.component.html',
  styleUrl: './googlemap.component.scss',
})
export class GooglemapComponent implements OnInit {
  @ViewChild('mapContainer') mapElement: ElementRef;
  @ViewChild(MapInfoWindow) infoWindow!: MapInfoWindow; // Access the MapInfoWindow component
  mapId: string = 'google-map'; // Unique ID for the map container
  map!: google.maps.Map;
  center: google.maps.LatLngLiteral = { lat: 33.301112, lng: -96.620075 }; // Default center, adjust as needed
  zoom: number = 11;
  mapOptions: google.maps.MapOptions = {
    mapTypeId: google.maps.MapTypeId.HYBRID,
    disableDefaultUI: true,
  };

  activeMapTypeId: string | null = google.maps.MapTypeId.HYBRID;

  /*map layers is for map features*/
  mapLayers: google.maps.Data[] = [];
  /*geojsonLayers is for layer configuration managment
   such as visibility, style, information*/
  geojsonLayers: Layer[] = [];

  isPointsLayerVisible = true;
  isLinesLayerVisible = true;
  isPolygonsLayerVisible = true;

  private http = inject(HttpClient); // Inject HttpClient
  private lys = inject(LayerService); // Inject LayerManagementComponent if needed
  private frs = inject(FeatureService); // Inject FeatureService for additional functionality
  labelLayers: any = [];

  clickableLayerNames: string[] = ['ZoningDistrict','FutureLandUse','DLHProperty']
  mouseHoverLayerNames: string[] = []

  ngOnInit(): void {
    // Initialization logic if needed before the map is loaded
    this.geojsonLayers = this.lys.createLayers();
  }

  mapInitialized(mapInstance: google.maps.Map): void {
    this.map = mapInstance;

    this.activeMapTypeId = this.map.getMapTypeId();

    this.loadGeoJsonLayers();
  }

  loadGeoJsonLayers(): void {
    this.geojsonLayers.forEach((layer, index) => {
      this.mapLayers[index] = new google.maps.Data({ map: this.map });
      this.loadGeoJsonData(index, layer.source, this.mapLayers[index]);
      this.mapLayers[index].setStyle(layer.style);
      this.mapLayers[index].setMap(this.map);
      this.addGeoJsonLayerListener(layer, index);
    });
  }

  loadGeoJsonData(index: number, url: string, layer: google.maps.Data): void {
    this.http
      .get(url)
      .pipe(
        catchError((err) => {
          console.error('Error loading GeoJSON:', err);
          return of(null); // Return a safe value to allow the rest of the code to continue
        })
      )
      .subscribe((data) => {
        if (data) {
          layer.addGeoJson(data);
          this.loadLabelLayer(index);
        }
      });
  }

  addGeoJsonLayerListener(layer: Layer, index: number) {
    this.mapLayers[index].addListener('click',(event: google.maps.Data.MouseEvent) => { this.clickHandler(event, layer); });
    this.mapLayers[index].addListener('mouseover',(event: google.maps.Data.MouseEvent) => {this.mouseoverHandler(event, layer);});
  }

 clickHandler(event: google.maps.Data.MouseEvent, layer: Layer): void {

        const feature = event.feature;
        if (feature && layer.geometryType === 'polygon' && this.clickableLayerNames.includes(layer.id)) {

          const content = this.frs.getFeatureInfoWindowContent(feature, layer);
          this.infoWindow.options = {
            content: content,
            position: event.latLng,
          };

          this.infoWindow.open();

        } else {
          this.infoWindow.close();
          return;
        }

}
 mouseoverHandler(event: google.maps.Data.MouseEvent, layer: Layer): void {

        const feature = event.feature;


}

  loadLabelLayer(index?: number): void {
    if (this.geojsonLayers[index].geometryType === 'polygon') {
      let propertyName = this.frs.getFeatureLabelProperty(
        this.geojsonLayers[index].id
      );
      let lblColor = this.frs.getFeatureLabelColor(
        this.geojsonLayers[index].id
      );

      this.mapLayers[index].forEach((feature: any) => {
        const geom = feature.getGeometry();
        const lblText = String(feature.getProperty(propertyName));

        let bounds = new google.maps.LatLngBounds();
        if (geom.getType() === 'Polygon') {
          (geom as google.maps.Data.Polygon)
            .getArray()[0]
            .getArray()
            .forEach((latLng) => bounds.extend(latLng));
        } else if (geom.getType() === 'MultiPolygon') {
          (geom as google.maps.Data.MultiPolygon)
            .getArray()
            .forEach((polygon) => {
              polygon
                .getArray()[0]
                .getArray()
                .forEach((latLng) => {
                  bounds.extend(latLng);
                });
            });
        }

        if (!bounds.isEmpty()) {
          const center = bounds.getCenter();
          let labellayer = new PolygonLabelOverlay(
            center,
            lblText,
            this.map,
            lblColor
          );

          this.geojsonLayers[index].labelLayers.push(labellayer);
        }
      });
    }
  }

  createPolygonLabelLayers(lyr: IndexLayerChecked) {
    this.geojsonLayers[lyr.index].labelLayers?.forEach(
      (label: PolygonLabelOverlay) => {
        label.setVisible(lyr.checked);
      }
    );

    this.geojsonLayers[lyr.index].labelOn = lyr.checked;
  }

  toggleLayerVisibility(lyr: IndexLayerChecked) {
    let index = lyr.index;
    this.geojsonLayers[index].visible = lyr.checked;

    this.mapLayers[index].setMap(lyr.checked ? this.map : null);

    //state management for labels

    if (lyr.checked === false && this.geojsonLayers[index].labelOn === true) {
      this.geojsonLayers[index].labelLayers?.forEach(
        (label: PolygonLabelOverlay) => {
          label.setVisible(false);
        }
      );
    }

    if (lyr.checked === true && this.geojsonLayers[index].labelOn === true) {
      this.geojsonLayers[index].labelLayers?.forEach(
        (label: PolygonLabelOverlay) => {
          label.setVisible(true);
        }
      );
    }
  }

  baseMapSelected(basemapId: string) {
    this.activeMapTypeId = basemapId;
    this.map.setMapTypeId(this.activeMapTypeId);
  }

  fillPolygon(lyr: IndexLayerChecked) {
    this.geojsonLayers[lyr.index].fillPolygon = lyr.checked;

    if (lyr.checked === true) {
      this.mapLayers[lyr.index].setStyle(this.geojsonLayers[lyr.index].style);
    } else {
      let unFilledStyle: any = {};
      Object.assign(unFilledStyle, this.geojsonLayers[lyr.index].style);
      unFilledStyle.fillColor = 'transparent';
      unFilledStyle.fillOpacity = 0;
      this.mapLayers[lyr.index].setStyle(unFilledStyle);
    }
  }
}
