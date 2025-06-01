declare var google: any;

export class PolygonLabelOverlay extends google.maps.OverlayView {
  private div?: HTMLDivElement;

  /**
   *
   */
  constructor(
    private position: google.maps.LatLng,
    private labelText: string,
    private mapInstance: google.maps.Map,
    private colorCode:string
  ) {
    super();
    (this as any).setMap(this.mapInstance);
  }

  onAdd() {
    this.div = document.createElement('div');
    this.div.style.cssText = `
    z-index: 1000;
    position: absolute;
    background-color: white;
    border: 1px solid #ccc;
    padding: 4px 8px;
    border-radius: 4px;
    font-weight: bold;
    font-size: 13px;
    display:none;
    color: ${this.colorCode};
    white-space: nowrap;
    transform: translate(-50%, -50%); /* Center the label visually */
  `;
    this.div.innerText = this.labelText;
    const panes = (this as any).getPanes();
    panes.overlayLayer.appendChild(this.div);
  }

  draw() {
    const projection = (this as any).getProjection();
    const pos = projection.fromLatLngToDivPixel(this.position);
    if (this.div && pos) {
      this.div.style.left = pos.x + 'px';
      this.div.style.top = pos.y + 'px';
    }
  }

  onRemove() {
    if (this.div?.parentNode) {
      this.div.parentNode.removeChild(this.div);
    }
    this.div = undefined;
  }

  setVisible(visible: boolean) {
    if (this.div) {
      this.div.style.display = visible ? 'block' : 'none';
    }
  }
}
