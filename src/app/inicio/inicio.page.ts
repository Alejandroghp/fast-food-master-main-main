// inicio.page.ts
import { Component, OnInit } from '@angular/core';
import { DataSharingService } from '../services/data-sharing.service';
import { SupabaseService } from '../supabase.service';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {
  newRestaurante: string = '';
  restaurantes: string[] = [];
  receivedPlaceName: string;

  constructor(
    private supabaseService: SupabaseService,
    private router: Router,
    private navCtrl: NavController,
    private dataSharingService: DataSharingService
  ) {}

  ngOnInit() {
    // Subscribe to the shared data
    this.dataSharingService.data$.subscribe((data: any) => {
      this.receivedPlaceName = data?.selectedPlaceName;
      // ... handle other data you may need
    });
  }

  async addRestaurante() {
    // ... existing code
  }

  async removeRestaurante(restaurantName: string) {
    // ... existing code
  }

  goToHomePage() {
    // Opción 1: Usando el Router
    this.router.navigate(['/home']);

    // Opción 2: Usando NavController
    // this.navCtrl.navigateForward('/home');
  }

  navigateToCategory(category: string) {
    console.log('Categoría seleccionada:', category);
    // Puedes personalizar esta función según tus necesidades
    // this.router.navigate([`/categoria/${category}`]);
  }
}
