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
    this.dataSharingService.getData().subscribe((data: any) => {
      this.receivedPlaceName = data.selectedPlaceName;
      // ... handle other data you may need
    });
  }

  async addRestaurante() {
    // ... existing code
  }

  async removeRestaurante(restaurantName: string) {
    // ... existing code
  }

  // Nueva función para ir a la página de inicio
  goToHomePage() {
    // Opción 1: Usando el Router
    this.router.navigate(['/home']);

    // Opción 2: Usando NavController (requiere importar y utilizar NavController)
    // this.navCtrl.navigateForward('/home');
  }

  // Nueva función para manejar la navegación a categorías
  navigateToCategory(category: string) {
    // Puedes personalizar esta función para navegar a una página específica de categoría
    // o realizar la acción que necesites según la categoría seleccionada
    console.log('Categoría seleccionada:', category);
    // Ejemplo de navegación a una página específica de categoría
    this.router.navigate([`/categoria/${category}`]);
  }
}
