
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TravelService {
  private isTraveling: boolean = false;
  private travelDetails: any;

  startTravel() {
    this.isTraveling = true;
    // Lógica para iniciar el viaje, si es necesario.
  }

  stopTravel() {
    this.isTraveling = false;
    // Lógica para detener el viaje, si es necesario.
  }

  getIsTraveling(): boolean {
    return this.isTraveling;
  }

  setTravelDetails(details: any) {
    this.travelDetails = details;
  }

  getTravelDetails(): any {
    return this.travelDetails;
  }
}
