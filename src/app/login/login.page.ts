// login.page.ts

import { Component, OnInit } from '@angular/core';
import { SupabaseService } from '../supabase.service';
import { AlertController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  email = '';
  password = '';

  constructor(
    private readonly supabase: SupabaseService,
    private alertController: AlertController,
    private navCtrl: NavController
  ) {}

  ngOnInit() {}

  async handleLogin() {
    try {
      await this.validateInput(); // Usar "await" para esperar que se complete la validación

      // Mostrar loader mientras se realiza el inicio de sesión
      const loader = await this.supabase.createLoader();
      await loader.present();

      // Iniciar sesión usando el método signInWithEmailPassword del servicio Supabase
      const loginResult = await this.supabase.signInWithEmailPassword(this.email, this.password);

      if (loginResult) {
        // Si el inicio de sesión es exitoso, redirigir a la página de inicio
        await loader.dismiss();
        this.navCtrl.navigateRoot('/inicio');
        await this.supabase.createNotice('Inicio de sesión exitoso!');
      } else {
        // Si hay un error en el inicio de sesión, mostrar un mensaje de error
        await loader.dismiss();
        await this.supabase.createNotice('Error en el inicio de sesión. Verifica tus credenciales.');
      }
    } catch (error) {
      // Manejar cualquier error que se pueda producir durante la validación o el inicio de sesión
      await this.handleError(error);
    }
  }

  async validateInput() {
    // Validar que se ingresen valores en los campos de correo electrónico y contraseña
    if (!this.email || !this.password) {
      throw new Error('Campos incompletos. Por favor, completa todos los campos antes de iniciar sesión.');
    }
  }

  async handleError(error: any) {
    // Manejar y mostrar errores usando un cuadro de alerta
    const errorMessage = error.error_description || error.message || 'Hubo un error durante el inicio de sesión.';
    const alert = await this.alertController.create({
      header: 'Error',
      message: errorMessage,
      buttons: ['OK']
    });

    await alert.present();
  }
}
