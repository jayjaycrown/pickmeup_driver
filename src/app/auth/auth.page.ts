import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { AlertController, LoadingController } from "@ionic/angular";
import { AuthService } from "../_services/auth.service";

// import { Plugins } from '@capacitor/core';
// const { Storage } = Plugins;
// const TOKEN_KEY = 'auth-token';
@Component({
  selector: "app-auth",
  templateUrl: "./auth.page.html",
  styleUrls: ["./auth.page.scss"],
})
export class AuthPage implements OnInit {
  type;
  firstPage;
  secondPage;
  loginForm: any;
  registerForm: any;
  return = "";
  returnUrl: string;
  constructor(
    public formBuilder: FormBuilder,
    private auth: AuthService,
    private alertController: AlertController,
    private router: Router,
    private loadingController: LoadingController,
    private route: ActivatedRoute
  ) {
    if (this.auth.currentUserValue) {
      alert("Already logged in");
      this.router.navigate(["/home"]);
    }
  }
  segmentChanged(ev) {}
  changeState() {
    this.firstPage = !this.firstPage;
    this.secondPage = !this.secondPage;
    this.regMail();
  }

  ngOnInit() {
    this.type = "signin";
    this.firstPage = true;
    this.secondPage = false;
    this.loginForm = this.formBuilder.group({
      email: [
        "",
        Validators.compose([
          Validators.maxLength(30),
          Validators.required,
          Validators.email,
        ]),
      ],
      password: [
        "",
        Validators.compose([Validators.minLength(6), Validators.required]),
      ],
    });
    this.registerForm = this.formBuilder.group({
      email: [
        "",
        Validators.compose([
          Validators.maxLength(30),
          Validators.required,
          Validators.email,
        ]),
      ],
      password: [
        "",
        Validators.compose([Validators.minLength(6), Validators.required]),
      ],
      firstName: [
        "",
        Validators.compose([
          Validators.maxLength(30),
          Validators.pattern("[a-zA-Z ]*"),
          Validators.required,
        ]),
      ],
      lastName: [
        "",
        Validators.compose([
          Validators.maxLength(30),
          Validators.pattern("[a-zA-Z ]*"),
          Validators.required,
        ]),
      ],
      state: [
        "",
        Validators.compose([
          Validators.maxLength(30),
          Validators.pattern("[a-zA-Z ]*"),
          Validators.required,
        ]),
      ],
      phone: [
        "",
        Validators.compose([
          Validators.maxLength(30),
          Validators.minLength(6),
          Validators.pattern("[0-9]*"),
          Validators.required,
        ]),
      ],
      sex: ["", Validators.required],
    });

    // tslint:disable-next-line: no-string-literal
    this.returnUrl = this.route.snapshot.queryParams["returnUrl"] || "/home";
    // Get the query params
    this.route.queryParams
      // tslint:disable-next-line: no-string-literal
      .subscribe((params) => (this.return = params["return"] || "/home"));
  }

  async login() {
    // console.log(this.loginForm.value);
    // this.router.navigateByUrl('/home');
    const loading = await this.loadingController.create({
      spinner: null,

      cssClass: "custom-loading",
    });
    await loading.present();

    this.auth.login(this.loginForm.value).subscribe(
      async (res: any) => {
        // console.log(res);
        if (res.success === true) {
          // const token = res.token;
          await loading.dismiss();
          // Storage.set({ key: TOKEN_KEY, value: token });
          const alert = await this.alertController.create({
            // header: 'Login Successfull',
            message: "Login Successfull",
            buttons: ["OK"],
          });
          await alert.present();
          this.router.navigate([this.returnUrl]);
        } else {
          await loading.dismiss();
          const alert = await this.alertController.create({
            header: "Login Failed!!!",
            message: res.message,
            buttons: ["OK"],
          });
          await alert.present();
        }
      },
      async (err) => {
        await loading.dismiss();
        // console.log(err);
      }
      // async (res) => {
      //   // console.log(res);
      //   await loading.dismiss();
      //   this.router.navigateByUrl('/home', { replaceUrl: true });
      // },
      // async (res) => {
      //   await loading.dismiss();
      //   const alert = await this.alertController.create({
      //     header: 'Login failed',
      //     message: res.error.error,
      //     buttons: ['OK'],
      //   });
      //   await alert.present();
      // }
    );
  }

  async register() {
    // console.log(this.registerForm.value);
    // this.router.navigateByUrl('/home');
    const loading = await this.loadingController.create({
      spinner: null,

      cssClass: "custom-loading",
    });
    await loading.present();
    this.auth.register(this.registerForm.value).subscribe(
      async (res: any) => {
        // console.log(res);
        if (res.success === true) {
          await loading.dismiss();
          // alert(res.token);
          const alert = await this.alertController.create({
            // header: 'Registration Successfull',
            message: "Registration Successfull",
            buttons: ["OK"],
          });
          await alert.present();

          this.router.navigateByUrl("/profile");
        } else {
          await loading.dismiss();
          const alert = await this.alertController.create({
            header: "Registration failed",
            message: res.message,
            buttons: ["OK"],
          });
          await alert.present();
        }
      },
      async (err) => {
        await loading.dismiss();
        // console.log(err);
      }
    );
  }

  get email() {
    return this.loginForm.get("email");
  }

  get password() {
    return this.loginForm.get("password");
  }

  regMail() {
    return this.registerForm.get("firstName");
  }
}
