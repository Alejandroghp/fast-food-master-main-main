// home.page.ts

import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { MapService } from '../map.service';
import { DataSharingService } from '../services/data-sharing.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  selectedCoordinates: number[];
  selectedPlaceName: string;
  selectedStreetData: any;

  constructor(
    private mapService: MapService,
    private dataSharingService: DataSharingService,
    private navCtrl: NavController
  ) {}

  ngOnInit() {
    // Initialize the map
    this.mapService.initializeMap('map');

    // Subscribe to map service events
    this.mapService.coordinatesSelected.subscribe((coordinates: number[]) => {
      this.selectedCoordinates = coordinates;
    });

    this.mapService.selectedPlaceName.subscribe((placeName: string) => {
      this.selectedPlaceName = placeName;
    });

    // Subscribe to shared data changes
    this.dataSharingService.data$.subscribe((data: any) => {
      this.selectedStreetData = data?.selectedStreetData;
    });
  }

  removeMarker() {
    this.mapService.removeMarker();
    this.selectedCoordinates = null;
    this.selectedPlaceName = null;
    this.selectedStreetData = null;
  }

  searchByName(query: string) {
    this.mapService.searchPlaceByName(query);
  }

  navigateToInicioPage() {
    // Update shared data
    this.dataSharingService.setData({
      selectedCoordinates: this.selectedCoordinates,
      selectedPlaceName: this.selectedPlaceName,
      selectedStreetData: this.selectedStreetData,
    });

    // Navigate to InicioPage
    this.navCtrl.navigateForward('/inicio');
  }
}
