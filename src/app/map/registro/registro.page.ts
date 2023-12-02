import { Component, OnInit } from '@angular/core';
import { SupabaseService } from '../supabase.service';
import { AlertController } from '@ionic/angular';

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
    private alertController: AlertController
  ) {}

  ngOnInit() {}

  async handleLogin() {
    if (!this.email || !this.password || !this.nombre) {
      
      this.presentAlert('Campos incompletos', 'Por favor, completa todos los campos antes de Registrarse.');
    } else {
      
      const loader = await this.supabase.createLoader();
      await loader.present();
      try {
        await this.supabase.signIn(this.email);
        await loader.dismiss(); 
        await this.supabase.createNotice('Ahora revisa tu email, faltan solo unos pasos!');
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