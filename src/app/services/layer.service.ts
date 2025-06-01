import { inject, Injectable } from '@angular/core';
import { IndexLayerChecked, Layer } from '../viewmodels/layer';
import { FeatureService } from './feature.service';
import { PolygonLabelOverlay } from '../components/googlemap/polygon-label';

@Injectable({
  providedIn: 'root',
})
export class LayerService {
  private frs = inject(FeatureService);

  createLayers(): Layer[] {
    return [
      {
        id: 'DLHProperty',
        visible: true,
        source: 'assets/DLHProperty.geojson',
        geometryType: 'polygon',
        labelOn: false,
        labelLayers: [],
        fillPolygon: true,
        style: {
          fillColor: 'yellow',
          strokeWeight: 5,
          strokeColor: '#22b77b',
          fillOpacity: 0.8,
          zIndex: 10,
        },
      },
      {
        id: 'Schools',
        visible: true,
        source: 'assets/SchoolSites.geojson',
        geometryType: 'point',
        labelOn: false,
        fillPolygon: true,
        style: {
          icon: {
            url: 'assets/SchoolSites.png',
            scaledSize: new google.maps.Size(20, 20),
          },
        },
      },
      {
        id: 'Trails',
        visible: true,
        geometryType: 'line',
        labelOn: false,
        fillPolygon: true,
        source: 'assets/Trails.geojson',
        style: {
          strokeColor: '#94acbf',
          strokeWeight: 5,
          zIndex: 11,
        },
      },

      {
        id: 'SchoolDistrict',
        visible: true,
        labelOn: false,
        labelLayers: [],
        fillPolygon: true,
        source: 'assets/SchoolDistrict.geojson',
        geometryType: 'polygon',
        style: {
          fillColor: '#207094a3',
          strokeColor: '#207094',
          strokeWidth: 4,
          fillOpacity: 0.3,
          zIndex: 7,
        },
      },
      {
        id: 'FutureLandUse',
        visible: true,
        labelOn: false,
        labelLayers: [],
        fillPolygon: true,
        source: 'assets/FutureLandUse.geojson',
        geometryType: 'polygon',
        style: {
          fillColor: '#71431ca1',
          strokeColor: '#71431c',
          strokeWidth: 4,
          fillOpacity: 0.6,
          zIndex: 8,
        },
      },
      {
        id: 'ZoningDistrict',
        visible: true,
        labelOn: false,
        labelLayers: [],
        fillPolygon: true,
        source: 'assets/ZoningDistricts.geojson',
        geometryType: 'polygon',
        style: {
          fillColor: '#50538f3b',
          strokeColor: '#b5b1bf',
          strokeWidth: 1,
          fillOpacity: 0.7,
          zIndex: 9,
        },
      },
         {
        id: 'CityLimits',
        visible: true,
        source: 'assets/Cities.geojson',
        geometryType: 'polygon',
        labelOn: false,
        labelLayers: [],
        fillPolygon: true,
        style: {
          fillColor: 'transparent',
          strokeWeight: 1,
          strokeColor: '#f2d158',
          fillOpacity: 0.8,
          zIndex: 6,
        },
      },
    ];
  }

  getPolygonLabelLayers(mapLayer: google.maps.Data,
    map: google.maps.Map,
    layerId:string,
    attributeName: string = 'NAME',
    lblColor:string ='#b9e9ff' ): google.maps.marker.AdvancedMarkerElement[] {
    const advancedMarkers: google.maps.marker.AdvancedMarkerElement[] = [];
    const bounds = new google.maps.LatLngBounds();
    const labels = [];

    mapLayer.forEach((feature: google.maps.Data.Feature) => {
      const geometry = feature.getGeometry();
      const lblText = String(feature.getProperty(attributeName));

      if (geometry && lblText) {


        if (geometry.getType() === 'MultiPolygon') {
          const multiPolygonGeometry =
            geometry as google.maps.Data.MultiPolygon;
          let allMultiPolygonPaths: google.maps.LatLngLiteral[] = [];

          multiPolygonGeometry.getArray().forEach((polygon) => {
            polygon.getArray().forEach((path) => {
              path.getArray().forEach((latLng) => {
                allMultiPolygonPaths.push({
                  lat: latLng.lat(),
                  lng: latLng.lng(),
                });
                bounds.extend(latLng); // Extend bounds for each point
              });
            });
          });
          // Calculate the center for the entire MultiPolygon feature
          const center = bounds.getCenter();
          const label = new PolygonLabelOverlay(center,lblText,map,lblColor)

          labels.push(label);



        }
      }
    });
    return labels
  }
}
