import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuthService } from '../../_services/auth.service';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.page.html',
  styleUrls: ['./reset.page.scss'],
})
export class ResetPage implements OnInit {
  resetForm: any;

  constructor(
    private formBuilder: FormBuilder,
    private auth: AuthService,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private router: Router
  ) { }

  ngOnInit() {
    this.resetForm = this.formBuilder.group({
      resetToken: ['', Validators.compose([Validators.required])],
      newPassword: ['', Validators.compose([Validators.minLength(6), Validators.required])],
    });
  }



  async reset() {
    console.log(this.resetForm.value);
    const loading = await this.loadingController.create({
      spinner: null,

      cssClass: 'custom-loading'
    });
    await loading.present();
    this.auth.reset(this.resetForm.value).subscribe(async (res: any) => {
      if (res.success === false) {
        await loading.dismiss();
        const alert = await this.alertController.create({
          header: 'Failed',
          message: res.message,
          buttons: ['OK'],
        });
        await alert.present();
      } else {
        await loading.dismiss();
        const alert = await this.alertController.create({
          header: 'Successfull',
          message: res.message,
          buttons: ['OK'],
        });
        await alert.present();
        this.router.navigateByUrl('/auth');
      }
    });
  }

}
