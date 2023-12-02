import { Component, OnInit } from '@angular/core';
import 'mapbox-gl';

declare var mapboxgl: any;

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
  }
}
