import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { AlertController, LoadingController } from "@ionic/angular";
import { AuthService } from "../../_services/auth.service";

@Component({
  selector: "app-forgot",
  templateUrl: "./forgot.page.html",
  styleUrls: ["./forgot.page.scss"],
})
export class ForgotPage implements OnInit {
  forgotForm: any;

  constructor(
    private formBuilder: FormBuilder,
    private auth: AuthService,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private router: Router
  ) {}

  ngOnInit() {
    this.forgotForm = this.formBuilder.group({
      email: [
        "",
        Validators.compose([
          Validators.maxLength(30),
          Validators.required,
          Validators.email,
        ]),
      ],
      // password: ['', Validators.compose([Validators.minLength(6), Validators.required])],
    });
  }
  async verify() {
    // console.log(this.forgotForm.value);
    const loading = await this.loadingController.create({
      spinner: null,
      cssClass: "custom-loading",
    });
    await loading.present();
    this.auth.forgot(this.forgotForm.value).subscribe(async (res: any) => {
      if (res.success === false) {
        await loading.dismiss();
        const alert = await this.alertController.create({
          header: "Verification Failed",
          message: res.message,
          buttons: ["OK"],
        });
        await alert.present();
      } else {
        await loading.dismiss();
        const alert = await this.alertController.create({
          header: "Verification Successfull",
          message: res.message,
          buttons: ["OK"],
        });
        await alert.present();
        this.router.navigateByUrl("/auth/reset");
      }
    });
  }
}
