// map.service.ts

import { Injectable } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import * as MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import { environment } from '../environments/environment';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  private map: mapboxgl.Map;
  private marker: mapboxgl.Marker;
  private geocoder: MapboxGeocoder;
  public coordinatesSelected = new BehaviorSubject<number[]>(null);
  public selectedPlaceName = new BehaviorSubject<string>(null);
  public selectedStreetName = new BehaviorSubject<string>(null);
  public searchResults = new BehaviorSubject<any[]>(null);
  public routeCoordinates$ = new BehaviorSubject<number[][]>(null);

  private searchUrl = 'https://api.mapbox.com/geocoding/v5/mapbox.places/';

  constructor(private http: HttpClient) {
    mapboxgl.accessToken = environment.mapbox.accessToken;
  }

  initializeMap(container: string, initialCoordinates?: number[]) {
    this.map = new mapboxgl.Map({
      container: container,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: initialCoordinates || [-71.6127, -33.0476],
      zoom: 12
    });

    this.geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      marker: false,
      mapboxgl: mapboxgl
    });

    this.geocoder.on('result', (event) => {
      this.centerMapOnPlace(event.result);
    });

    this.map.addControl(this.geocoder);

    this.map.on('click', (event: mapboxgl.MapMouseEvent) => {
      const clickedCoordinates = [event.lngLat.lng, event.lngLat.lat];
      this.adjustMarker(clickedCoordinates);
    });
  }

  adjustMarker(newCoordinates: number[]) {
    this.addMarker(newCoordinates);
    this.coordinatesSelected.next(newCoordinates);
  }

  removeMarkerAndClearSearch() {
    this.removeMarker();
    this.clearGeocoderSearch();
  }

  removeMarker() {
    if (this.marker) {
      this.marker.remove();
      this.coordinatesSelected.next(null);
      this.selectedPlaceName.next(null);
      this.selectedStreetName.next(null);
    }
  }

  private addMarker(coordinates: number[]) {
    this.removeMarker();

    const bounds = this.map.getBounds();
    const newCoordinates = [
      Math.max(bounds.getWest(), Math.min(bounds.getEast(), coordinates[0])),
      Math.max(bounds.getSouth(), Math.min(bounds.getNorth(), coordinates[1]))
    ];

    this.marker = new mapboxgl.Marker()
      .setLngLat([this.wrapTo360(newCoordinates[0]), newCoordinates[1]])
      .addTo(this.map);
  }

  private clearGeocoderSearch() {
    this.geocoder.clear();
  }

  private wrapTo360(coord: number): number {
    return ((coord + 180) % 360 + 360) % 360 - 180;
  }

  searchPlaceByName(query: string) {
    const searchParams = {
      access_token: mapboxgl.accessToken,
      types: 'address,poi',
      language: 'es',
      limit: 5,
    };

    const searchEndpoint = `${this.searchUrl}${encodeURIComponent(query)}.json`;

    this.http.get(searchEndpoint, { params: searchParams }).pipe(
      catchError((error) => {
        console.error('Error en la búsqueda por nombre:', error);
        return of([]);
      })
    ).subscribe((results: any[]) => {
      this.searchResults.next(results);

      if (results.length > 0) {
        this.centerMapOnPlace(results[0]);
      }
    });
  }

  centerMapOnPlace(result: any) {
    const clickedCoordinates = result.center;
    const placeName = result.place_name;
    const streetName = result.text;

    const zoomLevel = streetName ? 17 : 14;

    this.map.flyTo({
      center: clickedCoordinates,
      zoom: zoomLevel,
    });

    this.removeMarker();
    this.addMarker(clickedCoordinates);
    this.coordinatesSelected.next(clickedCoordinates);
    this.selectedPlaceName.next(placeName);
    this.selectedStreetName.next(streetName);
    this.clearGeocoderSearch();
  }

  traceRoute(startCoordinates: number[], endCoordinates: number[]) {
    const coordinates = [startCoordinates, endCoordinates];

    const routeUrl = `https://api.mapbox.com/directions/v5/mapbox/walking/${coordinates.join(';')}?geometries=geojson&access_token=${mapboxgl.accessToken}`;

    this.http.get(routeUrl).pipe(
      catchError((error) => {
        console.error('Error al trazar la ruta:', error);
        return of(null);
      })
    ).subscribe((data: any) => {
      if (data && data.routes && data.routes.length > 0) {
        const routeGeometry = data.routes[0].geometry.coordinates;
        this.routeCoordinates$.next(routeGeometry);
        this.drawRoute(routeGeometry);
      } else {
        this.routeCoordinates$.next(null);
        console.warn('No se encontraron rutas.');
      }
    });
  }

  private drawRoute(coordinates: number[][]) {
    if (this.map.getLayer('route')) {
      this.map.removeLayer('route');
      this.map.removeSource('route');
    }

    this.map.addLayer({
      id: 'route',
      type: 'line',
      source: {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: coordinates,
          },
        },
      },
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
      paint: {
        'line-color': '#3887be',
        'line-width': 5,
        'line-opacity': 0.75,
      },
    });
  }
}
