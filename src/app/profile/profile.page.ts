import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  ModalController,
  AlertController,
  ActionSheetController,
  Platform
} from '@ionic/angular';
import { Router } from '@angular/router';

// import { FundWalletComponent } from './fund-wallet/fund-wallet.component';
import { SettingsComponent } from './settings/settings.component';
import { AuthService } from '../_services/auth.service';
import { User } from '../_helpers/user.model';
import { PinComponent } from './pin/pin.component';
import { CameraResultType, CameraSource, Plugins } from '@capacitor/core';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { ToastController, LoadingController } from '@ionic/angular';
const { Camera, Storage } = Plugins;
const TOKEN_KEY = 'rider-token';





@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {


  @ViewChild('fileInput', { static: false }) fileInput: ElementRef;

  userEmail;
  userdetails: any = [];
  setPin;
  editPin;
  pinStatus: any;
  percentDone;
  walletBal = 10000;
  profilePic = 'assets/imgs/Avatar.png';
  isVerified: any;
  token: { value: string; };
  //  = {
    // email: 'string',
    // firstName: 'string',
    // lastName: 'string',
    // phone: 'string',
    // profilePic: 'string',
    // userId: 'string',
    // walletBal: Number
  // };
  // userdetails: any;

  constructor(
    private modalCtrl: ModalController,
    private auth: AuthService,
    private router: Router,
    private alertController: AlertController,
    private actionSheetCtrl: ActionSheetController,
    private toastController: ToastController,
    private plt: Platform,
    private loadingController: LoadingController
  ) { }


  async selectImageSource() {
    const buttons = [
      {
        text: 'Take Photo',
        icon: 'camera',
        handler: () => {
          this.addImage(CameraSource.Camera);
        }
      },
      {
        text: 'Choose From Library',
        icon: 'image',
        handler: () => {
          this.addImage(CameraSource.Photos);
        }
      }
    ];

    if (!this.plt.is('hybrid')) {
      buttons.push({
        text: 'Choose a file',
        icon: 'attach',
        handler: () => {
          this.fileInput.nativeElement.click();
        }
      });
    }

    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Select Image Source',
      buttons
    });
    await actionSheet.present();
  }

  async uploadFile(event) {
    // const eventOb: MSInputMethodContext = event as MSInputMethodContext;
    // const target: HTMLInputElement = eventOb.target as HTMLInputElement;
    // const file: File = target.files[0];
    // console.log('file', file);

    const loading = await this.loadingController.create({
      spinner: null,
      cssClass: 'custom-loading'
    });
    await loading.present();
    const selectedFiles = event.target.files;
    const file = selectedFiles.item(0);
    // tslint:disable-next-line: no-shadowed-variable
    (await this.auth.uploadImageFile(file)).subscribe(async (event: HttpEvent<any>) => {
      // console.log(res)
      switch (event.type) {
        case HttpEventType.Sent:
          console.log('Request has been made!');
          break;
        case HttpEventType.ResponseHeader:
          console.log('Response header has been received!');
          break;
        case HttpEventType.UploadProgress:
          this.percentDone = Math.round(event.loaded / event.total * 100);
          console.log(`Uploaded! ${this.percentDone}%`);
          break;
        case HttpEventType.Response:
          loading.dismiss();
          // alert(event.body.message);
          const toast = await this.toastController.create({
            message: event.body.message,
            position: 'bottom',
            duration: 5000,
            color: 'primary',
          });
          toast.present();
          this.getUserProfile();
          console.log('event successfully created!', event.body);
          this.percentDone = false;
          // this.activeModal.close();
      }



    });
  }
  async addImage(source: CameraSource) {
    const image = await Camera.getPhoto({
      quality: 60,
      allowEditing: true,
      resultType: CameraResultType.Base64,
      source
    });

    const loading = await this.loadingController.create({
      spinner: null,
      cssClass: 'custom-loading'
    });
    await loading.present();
    console.log('image: ', image);
    const blobData = this.b64toBlob(image.base64String, `image/${image.format}`);
    const imageName = 'picmeup Profile picture';
    this.auth.uploadImage(blobData, image.format).subscribe(async (event: HttpEvent<any>) => {
     switch (event.type) {
        case HttpEventType.Sent:
          console.log('Request has been made!');
          break;
        case HttpEventType.ResponseHeader:
          console.log('Response header has been received!');
          break;
        case HttpEventType.UploadProgress:
          this.percentDone = Math.round(event.loaded / event.total * 100);
          console.log(`Uploaded! ${this.percentDone}%`);
          break;
        case HttpEventType.Response:
        //  alert(event.body.message);
        loading.dismiss();
        const toast = await this.toastController.create({
          message: event.body.message,
          position: 'bottom',
          duration: 5000,
          color: 'primary',
        });
        toast.present();
        this.getUserProfile();
        console.log('event successfully created!', event.body);
        this.percentDone = false;
          // this.activeModal.close();
      }
    });
  }

  b64toBlob(b64Data, contentType= '', sliceSize= 512){
  const byteCharacters = atob(b64Data);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  const blob = new Blob(byteArrays, {type: contentType});
  return blob;
}

  // fundWalletModal() {
  //   this.walletModal();
  // }

  createPin() {
    this.PinModal();
  }
  async accSettings() {
    const modal = await this.modalCtrl.create({
      component: SettingsComponent,
      cssClass: 'mymodal', showBackdrop: true, backdropDismiss: false
    });
    modal.onDidDismiss().then(() => {
      this.getUserProfile();
    });
    return await modal.present();
  }

  async ngOnInit() {
    // await this.checkPinStatus();
    // console.log(this.userdetails)
  }
  async ionViewWillEnter() {
    this.token = await Storage.get({ key: TOKEN_KEY });
    this.getUserProfile();
    this.getVerificationStatus();
  }
  getVerificationStatus() {
    const obj = { token: this.token.value };
    this.auth.getVerificationStatus(obj).subscribe((res: any) => {
      console.log(res);
      this.isVerified = res.isVerified;
    });
  }

  async checkPinStatus() {
    this.auth.checkTransactionPin().subscribe((res: any) => {
      if (res.pinExists === true) {
        console.log(res);
        this.pinStatus = res.pinExists;
        // alert(this.pinStatus)
        // this.editPin = true;
        // this.setPin = false;
      }
      else {
        this.editPin = false;
        this.setPin = true;
      }
    });
    // alert(this.setPin + '' + this.editPin)
  }
  getUserProfile() {
    // console.log('Entering')
    const obj = { token: this.token.value };
    this.auth.getUserProfile(obj).subscribe(
      (res: any) => {
        console.log(res);
        this.userdetails = res.riderDetails;
        this.userEmail = this.userdetails.email;
        if (this.userdetails.profilePic !== null) {
          this.profilePic = this.userdetails.profilePic;
        }
      }
    );
    // console.log(this.userdetails)
  }

  // async walletModal() {
  //   const modal = await this.modalCtrl.create({
  //     component: FundWalletComponent,
  //     componentProps: {
  //       email: this.userEmail
  //     },
  //     cssClass: 'mymodal', showBackdrop: true, backdropDismiss: true
  //   });

  //   modal.onDidDismiss().then(() => {
  //     this.getUserProfile();
  //   });
  //   return await modal.present();
  // }

  async PinModal() {
    const modal = await this.modalCtrl.create({
      component: PinComponent,
      componentProps: {
        pinStatus: this.pinStatus
      },
      cssClass: 'mymodal', showBackdrop: true, backdropDismiss: true
    });

    modal.onDidDismiss().then(() => {
      this.getUserProfile();
    });
    return await modal.present();
  }

  async logout() {
    const alert = await this.alertController.create({
      header: 'Confirm Log Out!',
      message: 'Are you sure you want to <strong>Log Out</strong>!!!',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Okay',
          handler: () => {
            this.auth.logout().then(
            res => {
              this.router.navigateByUrl('/auth');
            }
          );
            console.log('Confirm Okay');
          }
        }
      ]
    });

    await alert.present();
  }

  onClick() {
    this.router.navigateByUrl('/wallet-history')
  }
}
