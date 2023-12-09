// home.page.ts
import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { DataSharingService } from '../services/data-sharing.service';
import { MapService } from '../map.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  searchInputValue: string;
  selectedCoordinates: number[];
  selectedPlaceName: string;
  selectedStreetData: any;

  constructor(
    private mapService: MapService,
    private dataSharingService: DataSharingService,
    private navCtrl: NavController
  ) {}

  ngOnInit() {
    this.mapService.initializeMap('map');

    this.mapService.coordinatesSelected.subscribe((coordinates: number[]) => {
      this.selectedCoordinates = coordinates;
    });

    this.mapService.selectedPlaceName.subscribe((placeName: string) => {
      this.selectedPlaceName = placeName;
    });

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

  sendDataToInicioPage() {
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
