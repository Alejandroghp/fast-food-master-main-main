import { Component, OnInit } from '@angular/core';
import { SupabaseService } from '../supabase.service';
import { AlertController, NavController } from '@ionic/angular';

@Component({
  selector: 'registro-login',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {
  email = '';
  password = '';
  nombre = '';

  constructor(
    private readonly supabase: SupabaseService,
    private alertController: AlertController,
    private navCtrl: NavController
  ) {}

  ngOnInit() {}

  async handleSignUp() {
    if (!this.email || !this.password || !this.nombre) {
      this.presentAlert('Campos incompletos', 'Por favor, completa todos los campos antes de Registrarse.');
    } else {
      const loader = await this.supabase.createLoader();
      await loader.present();
      try {
        // Utilizando el nuevo método insertUsuario en lugar de signUp
        await this.supabase.insertUsuario(this.email, this.password, this.nombre);
        await loader.dismiss();
        await this.supabase.createNotice('Registro exitoso. Por favor, revisa tu correo electrónico.');

        // Navegar a la página de inicio después de un registro exitoso
        this.navCtrl.navigateRoot('/inicio');
      } catch (error) {
        await loader.dismiss();
        await this.supabase.createNotice(error.error_description || error.message);
      }
    }
  }

  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });

    await alert.present();
  }
}
