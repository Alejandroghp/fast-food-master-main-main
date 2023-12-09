// codigoqr.component.ts

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as QRCode from 'qrcode';

@Component({
  selector: 'app-codigoqr',
  templateUrl: './codigoqr.component.html',
  styleUrls: ['./codigoqr.component.scss']
})
export class CodigoqrComponent implements OnInit {
  qrCodeData: string = 'https://drive.google.com/drive/u/1/my-drive';
  qrCodeImage: string;

  constructor(private router: Router) { }

  ngOnInit() {
    this.generateQrCode();
  }

  async generateQrCode() {
    this.qrCodeImage = await QRCode.toDataURL(this.qrCodeData);
  }

  goToInicio() {
    this.router.navigate(['/inicio']);
  }
}
