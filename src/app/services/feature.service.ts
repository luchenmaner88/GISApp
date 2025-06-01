import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FeatureService {

  getPolygonCenter(paths: google.maps.LatLngLiteral[]): google.maps.LatLngLiteral | null {
    if (!paths || paths.length === 0) {
      return null;
    }

    let latSum = 0;
    let lngSum = 0;
    let count = 0;

    paths.forEach(path => {
      latSum += path.lat;
      lngSum += path.lng;
      count++;
    });

    if (count === 0) {
      return null;
    }

    return {
      lat: latSum / count,
      lng: lngSum / count
    };
  }

  createPolygonLabel(lblText:string){
     const labelContent = document.createElement('div');
     labelContent.style.cssText = `
                    background-color: white;
                    border: 1px solid #ccc;
                    padding: 4px 8px;
                    border-radius: 4px;
                    font-weight: bold;
                    font-size: 13px;
                    color: #b9e9ff;
                    white-space: nowrap;
                    transform: translate(-50%, -50%); /* Center the label visually */
                `;

     labelContent.textContent = String(lblText);
     return labelContent;
  }

  getFeatureLabelProperty(layerName:string){
       switch (layerName) {
          case 'ZoningDistrict':
            return 'zoning';

          case 'SchoolDistrict':
            return 'NAME';

          case 'FutureLandUse':
            return 'Character';

          case 'DLHProperty':
            return 'name';

          case 'CityLimits':
            return 'CITY_NAME';
          default:
            return 'name'; // Default property if no match found
        }
  }

  getFeatureLabelColor(layerName:string){

       switch (layerName) {
          case 'ZoningDistrict':

            return '#b5b1bf'; // Change label color for ZoningDistrict

          case 'SchoolDistrict':

            return '#207094'; // Change label color for ZoningDistrict and SchoolDistrict

          case 'FutureLandUse':

            return '#71431c';

          case 'DLHProperty':

            return '#22b77b';

          case 'CityLimits':
            return '#f2d158'
          default:
            return '#000'

        }
  }

  getFeatureInfoWindowContent(feature: google.maps.Data.Feature, layer: any) {
     if (layer.id === 'ZoningDistrict') {
          if (feature) {
               const content = `
                      <div class="info-window-container">

                           <div class="title" style="color:#b5b1bf;">${layer.id} </div>

                            <div class="row">
                              <div class="name">Zoning:</div>
                              <div> ${feature.getProperty('zoning')}</div>
                            </div>
                            <div class="row">
                              <div class="name">Zoning_Ord:</div>
                              <div>${feature.getProperty('Zoning_Ord')} </div>
                            </div>
                            <div class="row">
                              <div class="name">Link:</div>
                              <a href='${feature.getProperty(
                                'Link'
                              )}' target="_blank">${
              feature.getProperty('Link') ?? ``
            }</a>
                            </div>
                              <div class="row">
                              <div class="name">PDInfo:</div>
                              <div>${feature.getProperty('PDInfo')}</div>
                            </div>
                            <div class="row">
                              <div class="name">PDPage:</div>
                              <a href='${feature.getProperty(
                                'PDPage'
                              )}' target="_blank">${feature.getProperty(
              'PDPage'
            )}</a>
                            </div>
                      </div>`;

            return content;
          }

        }
     if (layer.id === 'DLHProperty') {
          if (feature) {
               const content = `
                      <div class="info-window-container">
                           <div class="title" style="color:#22b77b">${layer.id} </div>
                            <div class="row">
                              <div class="name">name:</div>
                              <div> ${feature.getProperty('name')}</div>
                            </div>
                      </div>`;

            return content;
          }

        }
      if (layer.id === 'FutureLandUse') {
        if (feature) {
          const content = `
                  <div class="info-window-container">

                        <div class="title" style="color:#71431c;">${layer.id} </div>

                        <div class="row">
                          <div class="name">Character:</div>
                          <div> ${feature.getProperty('Character')}</div>
                        </div>

                  </div>`;

          return content;
        }
      }
    return null;
  } // Return empty string if no content is available


}
