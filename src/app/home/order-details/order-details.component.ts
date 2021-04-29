import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ModalController, AlertController, ToastController, IonicSafeString, LoadingController } from '@ionic/angular';
import { NgForm } from '@angular/forms';
import { Capacitor, Plugins } from '@capacitor/core';
import { AuthService } from '../../_services/auth.service';
import { Router } from '@angular/router';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import { CallNumber } from '@ionic-native/call-number/ngx';

const { Storage, Geolocation, Toast } = Plugins;
const TOKEN_KEY = 'rider-token';

// tslint:disable-next-line: max-line-length
declare var google: { maps: { DirectionsService: new () => any; DirectionsRenderer: new () => any; Map: new (arg0: any, arg1: { zoom: number; center: { lat: number; lng: number; }; }) => any; }; };
@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss'],
})
export class OrderDetailsComponent implements OnInit {

  @ViewChild('map', { static: false }) mapElement: ElementRef;

  // tslint:disable-next-line: new-parens
  directionsService = new google.maps.DirectionsService;
  // tslint:disable-next-line: new-parens
  directionsDisplay = new google.maps.DirectionsRenderer;
  @Input() reference: any;
  @Input() details: any;
  message: string | IonicSafeString;
  color: string;
  map: any;
  // top = '30vh';
  type = 'pickup';
  token: { value: string; };
  deliveries: any = {};
  acceptedDeliveries: any;
  pickedup = false;
  delivered = false;
  deliveriesHistory: any;
  deliveriesHistories: any = {};
  showHistory = false;
  pickupAddress = '';
  dropoffAddress = '';
  pickupArea = '';
  pickupState = '';
  dropoffArea = '';
  dropoffState = '';
  address2: any;
  dropoffInfo: any;
  constructor(
    private modalController: ModalController,
    private alertCtrl: AlertController,
    // private toastCtrl: ToastController,
    private auth: AuthService,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private router: Router,
    private callNumber: CallNumber
  ) { }

  async ngOnInit() {}
  async ionViewWillEnter() {
    this.token = await Storage.get({ key: TOKEN_KEY });
    if (this.details === 'history') {
      this.fetchOrderHistory();
      this.showHistory = true;
    } else {
      this.showHistory = false;
      this.fetchAcceptedOrders();
    }
  }

  async showAddress() {
    this.map = new google.maps.Map(this.mapElement.nativeElement, {
      zoom: 7,
      center: {lat: 6.571396999999999, lng: 3.371669}
      });
    this.directionsDisplay.setMap(this.map);
    setTimeout(() => {
      // this.loadMap()
      this.calculateAndDisplayRoute();
    });


  }

  calculateAndDisplayRoute() {

    const address = `${this.pickupAddress}, ${this.pickupArea}, ${this.pickupState}`;
    if (this.dropoffAddress) {
      this.address2 = `${this.dropoffAddress}, ${this.dropoffArea}, ${this.dropoffState}`;
    } else {
      this.address2 = `${this.dropoffInfo[0].address}, ${this.dropoffInfo[0].area}, ${this.dropoffState}`
    }
    // alert(address)
    // alert(address2)
    this.directionsService.route({
      origin: address,
      destination: this.address2,
      travelMode: 'DRIVING'
    }, async (response, status) => {
      if (status === 'OK') {
        this.directionsDisplay.setDirections(response);
      } else {
       const alert = await this.alertCtrl.create({
          header: 'Failed to load map',
          mode: 'ios',
          message: response.message,
          buttons: ['OK']
        });

       await alert.present();
      }
    });
  }

  fetchAcceptedOrders() {
    this.auth.fetchAcceptedOrders(this.token.value).subscribe((res: any) => {
      this.acceptedDeliveries = res.deliveries;
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < this.acceptedDeliveries.length; i++) {
        const element = this.acceptedDeliveries[i];
        if (element.reference === this.reference) {
          this.deliveries = element;
          this.pickupAddress = this.deliveries.pickupAddress;
          this.pickupArea = this.deliveries.pickupArea;
          this.pickupState = this.deliveries.pickupState;
          this.dropoffAddress = this.deliveries.dropoffAddress;
          this.dropoffArea = this.deliveries.dropoffArea;
          this.dropoffState = this.deliveries.dropoffState;
          this.dropoffInfo = this.deliveries.dropoffInfo;
          this.showAddress();
          if (this.deliveries.status === 'Assigned') {
            this.pickedup = true;
            this.delivered = false;
          } else if (this.deliveries.status === 'Picked up') {
            this.delivered = true;
            this.pickedup = false;
            } else {

            }
          console.log(this.deliveries);
        } else {
          console.log('Not Found', this.reference);
        }
      }
      console.log(res);
    });
  }


  fetchOrderHistory() {
    this.auth.fetchOrderHistory(this.token.value).subscribe((res: any) => {
      this.deliveriesHistory = res.deliveries;
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < this.deliveriesHistory.length; i++) {
        const element = this.deliveriesHistory[i];
        if (element.reference === this.reference) {
          this.deliveriesHistories = element;
          this.pickupAddress = this.deliveriesHistories.pickupAddress;
          this.pickupArea = this.deliveriesHistories.pickupArea;
          this.pickupState = this.deliveriesHistories.pickupState;
          this.dropoffAddress = this.deliveriesHistories.dropoffAddress;
          this.dropoffArea = this.deliveriesHistories.dropoffArea;
          this.dropoffState = this.deliveriesHistories.dropoffState;
          this.dropoffInfo = this.deliveriesHistories.dropoffInfo;
          this.showAddress();
          console.log(this.deliveries);
        } else {
          console.log('Not Found', this.reference);
        }
      }
      console.log(res);
    });
  }
  dismiss() {
    this.modalController.dismiss('dismissed');
  }


  async presentToastWithButtons() {
      const toast = await this.toastController.create({
        animated: true,
        buttons: [
          {
            text: 'OK',
            role: 'cancel',
            handler: () => {
              console.log('Cancel clicked');
            }
          }
        ],
        color: this.color,
        cssClass: 'toast-success',
        duration: 5000,
        keyboardClose: true,
        message: this.message,
        mode: 'ios',
        position: 'bottom',
      });
      toast.present();
    }
  onSubmit(test: NgForm) {
    this.message = 'Status updated Successfully';
    this.color = 'primary';
    console.log(test.value);
    this.presentToastWithButtons();
  }

  async pickedUp(reference, type) {
    const obj = {
      token: this.token.value,
      reference,
      deliveryType: type
    };
    console.log(obj);
    const loading = await this.loadingController.create({
        spinner: null,
        cssClass: 'custom-loading'
      });
    await loading.present();
    this.auth.pickupOrder(obj).subscribe(async (res: any) => {
      await loading.dismiss();
      if (res.success === true) {
        const toast = await this.toastController.create({
          message: res.message,
          duration: 2000,
          color: 'primary',
          mode: 'ios'
        });
        toast.present();
        this.dismiss();
        // this.fetchAcceptedOrders();
      } else {
        const toast = await this.toastController.create({
          message: res.message,
          duration: 2000,
          color: 'danger',
          mode: 'ios'
        });
        toast.present();
      }
    });
  }

  async deliveredOrder(reference, type) {
    const obj = {
      token: this.token.value,
      reference,
      deliveryType: type
    };
    console.log(obj);
    const loading = await this.loadingController.create({
        spinner: null,
        cssClass: 'custom-loading'
      });
    await loading.present();
    this.auth.deliveredOrder(obj).subscribe(async (res: any) => {
      await loading.dismiss();
      if (res.success === true) {
        const toast = await this.toastController.create({
          message: res.message,
          duration: 2000,
          color: 'primary',
          mode: 'ios'
        });
        toast.present();
        this.dismiss();
        // this.router.navigateByUrl('/home');
      } else {
        const toast = await this.toastController.create({
          message: res.message,
          duration: 2000,
          color: 'danger',
          mode: 'ios'
        });
        toast.present();
      }
    });
  }


  segmentChanged(ev){
    // console.log(ev);
  }

  placeAcall(phone: string) {
    console.log(phone);
    this.callNumber.callNumber(phone, true)
  .then(res => console.log('Launched dialer!', res))
  .catch(err => console.log('Error launching dialer', err));
  }
}
