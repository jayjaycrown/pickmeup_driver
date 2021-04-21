import { Component, Input, OnInit } from '@angular/core';
import { ModalController, LoadingController, ToastController } from '@ionic/angular';
import { FormBuilder, Validators } from '@angular/forms';

import { PasswordComponent } from './password/password.component';
import { AuthService } from '../../_services/auth.service';

import { Plugins } from '@capacitor/core';
const { Storage } = Plugins;
const TOKEN_KEY = 'rider-token';


@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  // @Input() userdetails: any;

  profileEdit: any;
  token;
  userdetails: any ;
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
    // this.auth.getUserProfile().subscribe(
    //   (res: any) => {
    //     this.userdetails = res.userDetails;
    //     console.log(this.userdetails);
    //   }
    // )
    // console.log(this.userdetails)
    this.token = await Storage.get({ key: TOKEN_KEY });
    this.profileEdit = this.formBuilder.group({
      email: ['', Validators.compose([Validators.maxLength(30), Validators.required, Validators.email])],
      lastName: ['', Validators.compose([Validators.maxLength(30), Validators.required])],
      firstName: ['', Validators.compose([Validators.maxLength(30), Validators.required])],
      phone: ['', Validators.compose(
        [Validators.maxLength(30), Validators.minLength(6), Validators.pattern('[0-9]*'), Validators.required])],
      token: this.token.value
    });
  }

  onChangePassword() {
    this.presentModal();
  }
  async presentModal() {
    const modal = await this.modalCtrl.create({
      component: PasswordComponent,
      cssClass: 'mymodal', showBackdrop: true, backdropDismiss: true
    });
    return await modal.present();
  }

  async editProfile() {
    console.log(this.profileEdit.value);
    const loading = await this.loadingController.create({
      spinner: null,
      cssClass: 'custom-loading'
    });
    await loading.present();
    this.auth.editUserProfile(this.profileEdit.value).subscribe(
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
