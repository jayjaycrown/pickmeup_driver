import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController, ToastController } from '@ionic/angular';
import { FormBuilder, Validators } from '@angular/forms';

import { AuthService } from '../../../_services/auth.service';

import { Plugins } from '@capacitor/core';
const { Storage } = Plugins;
const TOKEN_KEY = 'rider-token';

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.scss'],
})
export class PasswordComponent implements OnInit {
  token;
  passwordForm: any;


  constructor(
    private modalCtrl: ModalController,
    public formBuilder: FormBuilder,
    private auth: AuthService,
    private loadingController: LoadingController,
    private toastController: ToastController
  ) { }

  onClick() {
    this.modalCtrl.dismiss({
      dismissed: true
    });
  }
  async ngOnInit() {
    this.token = await Storage.get({ key: TOKEN_KEY });
    this.passwordForm = this.formBuilder.group({
      newPassword: ['', Validators.compose([Validators.minLength(6), Validators.required])],
      oldPassword: ['', Validators.compose([Validators.minLength(6), Validators.required])],
      token: this.token.value
    });
  }

  async editPassword() {
    const loading = await this.loadingController.create({
      spinner: null,
      cssClass: 'custom-loading'
    });
    await loading.present();
    this.auth.editUserPassword(this.passwordForm.value).subscribe(
      async (res: any) => {
        loading.dismiss();
        this.onClick();
        const toast = await this.toastController.create({
          message: res.message,
          position: 'bottom',
          duration: 5000,
          color: 'primary',
        });
        toast.present();
      }
    );
  }

}
