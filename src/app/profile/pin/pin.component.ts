import { Component, Input, OnInit } from '@angular/core';
import { LoadingController, ModalController, ToastController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';



import { AuthService } from '../../_services/auth.service';
import { environment } from '../../../environments/environment';
import { Plugins } from '@capacitor/core';
import { HttpClient } from '@angular/common/http';
const { Storage } = Plugins;
const TOKEN_KEY = 'rider-token';


// tslint:disable-next-line: class-name
export class model {
  newPin: number;
  oldPin: number;
  token: string;
  }

@Component({
  selector: 'app-pin',
  templateUrl: './pin.component.html',
  styleUrls: ['./pin.component.scss'],
})
export class PinComponent implements OnInit {
  @Input() pinStatus: any;
  token: { value: any; };
  createPinForm: FormGroup;
  model: any = {};
  constructor(
    private modalCtrl: ModalController,
    private auth: AuthService,
    public formBuilder: FormBuilder,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private http: HttpClient,
  ) { }

  async ngOnInit() {
    // alert(this.setPin + ''+ this.editPin)
    // await this.checkPinStatus();
    this.token = await Storage.get({ key: TOKEN_KEY });
    this.model = { token: this.token.value };
    this.createPinForm = this.formBuilder.group({
      ridersCard: [''],
      vehicleLicense: [''],
      stageCarriage: [''],
      token: this.token.value
    });
  }

  onFileSelect(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.createPinForm.get('ridersCard').setValue(file);
    }
  }

  onFileSelect2(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.createPinForm.get('vehicleLicense').setValue(file);
    }
  }
  onFileSelect3(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.createPinForm.get('stageCarriage').setValue(file);
    }
  }

  async onSubmit() {
    // console.log(this.createPinForm.value);
    const loading = await this.loadingController.create({
      spinner: null,
      cssClass: 'custom-loading'
    });
    await loading.present();
    this.auth.uploadDocument(
      this.createPinForm.value).subscribe(async (res: any) => {
      console.log(res);
      loading.dismiss();
      if (res.success === false) {
        const toast = await this.toastController.create({
          message: res.message,
          position: 'bottom',
          duration: 5000,
          color: 'danger',
        });
        toast.present();
      }
      else {
        const toast = await this.toastController.create({
          message: res.message,
          position: 'bottom',
          duration: 5000,
          color: 'primary',
        });
        toast.present();
        this.onClick();
      }
    }, err => {
        console.log(`Error ${err}`);
    });
  }

  // onSubmitted() {
  //   const url = environment.api + 'upload-documents.php';
  //   const formData = new FormData();
  //   formData.append('stageCarriage', this.createPinForm.get('stageCarriage').value);
  //   formData.append('vehicleLicense', this.createPinForm.get('vehicleLicense').value);
  //   formData.append('ridersCard', this.createPinForm.get('ridersCard').value);

  //   this.http.post<any>(url, formData).subscribe(
  //     (res) => console.log(res),
  //     (err) => console.log(err)
  //   );
  // }

  // checkPinStatus() {
  //   this.auth.checkTransactionPin().subscribe((res: any) => {
  //     if (res.pinExists === true) {
  //       alert(res)
  //       this.editPin = true;
  //       this.setPin = false;
  //     }
  //     else {
  //       this.editPin = false;
  //       this.setPin = true;
  //     }
  //   })
  // }

  // async createPin() {
  //   // console.log(this.createPinForm.value);
  //   const loading = await this.loadingController.create({
  //     spinner: null,
  //     cssClass: 'custom-loading'
  //   });
  //   await loading.present();
  //   this.auth.setTransactionPin(this.createPinForm.value).subscribe(
  //     async (res: any) => {
  //       console.log(res);
  //       loading.dismiss();
  //       if (res.success === false) {
  //         this.onClick();
  //         const toast = await this.toastController.create({
  //         message: res.message,
  //         position: 'bottom',
  //         duration: 5000,
  //         color: 'danger',
  //       });
  //         toast.present();
  //       }
  //       else {
  //         this.onClick();
  //         const toast = await this.toastController.create({
  //         message: res.message,
  //         position: 'bottom',
  //         duration: 5000,
  //         color: 'primary',
  //       });
  //         toast.present();
  //       }

  //     }
  //   );
  // }



  onClick() {
    this.modalCtrl.dismiss({
      dismissed: true
    });
  }
}
