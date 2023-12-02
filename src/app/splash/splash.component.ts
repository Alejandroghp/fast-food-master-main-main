import { Component, OnInit } from '@angular/core';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private splashScreen: SplashScreen) {}

  ngOnInit() {
    // Muestra el splash screen durante 2 segundos (ajusta según sea necesario)
    this.splashScreen.show();
    setTimeout(() => {
      this.splashScreen.hide();
    }, 2000);
  }
}


