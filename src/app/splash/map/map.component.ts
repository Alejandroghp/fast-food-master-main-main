import { Component, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';

@Component({
  selector: 'app-map',
  template: '<div id="map"></div>',
  styles: ['#map { position: absolute; top: 0; bottom: 0; width: 100%; height: 100%; }'],
})
export class MapComponent implements OnInit {
  private map: any;

  ngOnInit() {
    mapboxgl.accessToken = 'pk.eyJ1IjoiYWxlamFuZHJvZ3BoIiwiYSI6ImNscGQxazVmbjAzdXgyam9odnVlY2xpazIifQ.iW6hy_P0aqunbyCHdCxeaA';

    this.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-71.543, -35.6751],
      zoom: 5,
    });

    // Llamar a la función para agregar los marcadores
    this.addMarkers([-71.543, -35.6751], [-73.9352, 40.7306]);
  }

  addMarkers(marker1Coords: number[], marker2Coords: number[]) {
    // Agregar el primer marcador
    new mapboxgl.Marker().setLngLat(marker1Coords).addTo(this.map);

    // Agregar el segundo marcador
    new mapboxgl.Marker().setLngLat(marker2Coords).addTo(this.map);
  }
}
