import { Component, NgZone, OnInit } from '@angular/core';
import { AlertController, LoadingController, ModalController, ToastController } from '@ionic/angular';
// import { TestPage } from '../test/test.page';
import { Router } from '@angular/router';
import { AuthService } from '../_services/auth.service';
// import { User } from '../_helpers/user.model';
import { OrderDetailsComponent } from './order-details/order-details.component';
import { NgForm } from '@angular/forms';
import {
  Capacitor,
  Plugins,
  LocalNotificationEnabledResult,
  LocalNotificationActionPerformed,
  LocalNotification,
  Device
} from '@capacitor/core';
import { LocationService } from '../_services/location.service';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
// import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
// import {  } from '@capacitor/core';

const { Storage, Geolocation, Toast, LocalNotifications } = Plugins;
const TOKEN_KEY = 'rider-token';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  firstName = '';
  profilePic = 'assets/imgs/Avatar.png';
  // userdetails = [
  //   {
  //     email: "",
  //     firstName: "",
  //     lastName: "",
  //     phone: "",
  //     profilePic: "",
  //     userId: "",
  //     walletBal: "",
  //   }
  // ];
  userdetails;
  // firstName;
  time;
  returnedData = false;
  testValue;
  status: any ;
  token: { value: string; };
  lat: any;
  lng: any;
  watchId: any;
  address = '';
  deliveries: any;
  declineModel: any = {};
  segmentModel = 'assigned';
  acceptedDeliveries: any;
  deliveriesHistories: any;
  refresh: any;
  constructor(
    public modalController: ModalController,
    private router: Router,
    private auth: AuthService,
    private toastController: ToastController,
    private alertController: AlertController,
    private loadingController: LoadingController,
    public ngZone: NgZone,
    private locationService: LocationService,
    private nativeGeocoder: NativeGeocoder,
    // private localNotifications: LocalNotifications
  ) {

    const date = new Date();
    const hrs = date.getHours();
    if (hrs >= 0 && hrs <= 11.59) {
      this.time = 'Good Morning';
    }
    else if (hrs >= 12 && hrs <= 16.59) {
      this.time = 'Good Afternoon';
    }
    //   else if (hrs>=17 && hrs <= 24) {
    //   this.time = 'Good Evening'
    // }
    else {
      this.time = 'Good Evening';
    }

    // this.time = new Date().getHours();
  }

  segmentChanged(ev: any) {
    // console.log('Segment changed', ev);
  }
  async ngOnInit() {
    await LocalNotifications.requestPermission();
    LocalNotifications.registerActionTypes({
      types: [
        {
          id: 'pmur_driver',
          actions: [
            {
              id: 'view',
              title: 'View Requests',
              foreground: true
            },
            {
              id: 'remove',
              title: 'Dismiss',
              destructive: true
            }
          ]
        }
      ]
    });
  }
  async ionViewWillEnter() {
    this.token = await Storage.get({ key: TOKEN_KEY });
    this.getStatus();
    this.getMyLocation();
    this.fetchAssignedDeliveries();
    this.fetchAcceptedOrders();
    this.fetchOrderHistories();
    this.refresh = setInterval(() => {
      this.getMyLocation();
      this.updateLocation();
      this.fetchAssignedDeliveries();
      this.fetchAcceptedOrders();
      this.fetchOrderHistories();
    }, 15000);
    const obj = { token: this.token.value };
    this.auth.getUserProfile(obj).subscribe(
      (res: any) => {
        // console.log(res);
        this.userdetails = res.riderDetails;
        this.firstName = this.userdetails.firstName;
        // console.log(this.userdetails);
      }
    );
  }
  ionViewWillLeave() {
    clearInterval(this.refresh);
    if (this.refresh) {
      clearInterval(this.refresh);
    }
  }

  async getMyLocation() {
    const hasPermission = await this.locationService.checkGPSPermission();
    if (hasPermission) {
      if (Capacitor.isNative) {
        const canUseGPS = await this.locationService.askToTurnOnGPS();
        this.postGPSPermission(canUseGPS);
      }
      else { this.postGPSPermission(true); }
    }
    else {
      const permission = await this.locationService.requestGPSPermission();
      if (permission === 'CAN_REQUEST' || permission === 'GOT_PERMISSION') {
        if (Capacitor.isNative) {
          const canUseGPS = await this.locationService.askToTurnOnGPS();
          this.postGPSPermission(canUseGPS);
        }
        else { this.postGPSPermission(true); }
      }
      else {
        await Toast.show({
          text: 'User denied location permission'
        });
      }
    }
  }

  updateLocation() {
    console.log(this.address);
    if (this.address !== '') {
        this.auth.updateRiderLocation(this.token.value, this.address).subscribe((res: any) => {
        console.log(res);
      });
    }
  }

  async postGPSPermission(canUseGPS: boolean) {
    if (canUseGPS) { this.watchPosition(); }
    else {
      await Toast.show({
        text: 'Please turn on GPS to get location'
      });
    }
  }

  async watchPosition() {
    try {
      this.watchId = Geolocation.watchPosition({}, (position, err) => {
        this.ngZone.run(() => {
          if (err) { console.log('err', err); return; }
          this.lat = position.coords.latitude;
          this.lng = position.coords.longitude;
          this.clearWatch();
          this.address = `${this.lat}, ${this.lng}`;
          const options: NativeGeocoderOptions = {
            useLocale: true,
            maxResults: 5
          };
          this.nativeGeocoder.reverseGeocode(this.lat, this.lng, options)
            .then((result: NativeGeocoderResult[]) => {
              // countryName,administrativeArea,subAdministrativeArea,thoroughfare,subThoroughfare,locality, subAdministrativeArea
              // tslint:disable-next-line: max-line-length
              const data = `${result[0].subThoroughfare}, ${result[0].thoroughfare}, ${result[0].locality}, ${result[0].subAdministrativeArea}, ${result[0].administrativeArea}, ${result[0].countryName}`;
              const latlng = `${this.lat}, ${this.lng}`;
              const address = [data, latlng];
              this.address = JSON.stringify(address);
              // const address = [result[0].latitude, result[0].longitude];
              // this.address = JSON.stringify(address);
              // console.log(JSON.stringify(result));
              // console.log(this.address);
              // alert(JSON.stringify(result[0]));
          })
          .catch((error: any) => console.log(error));
        });
      });
    }
    catch (err) { console.log('err', err); }
  }

  clearWatch() {
    if (this.watchId != null) {
      Geolocation.clearWatch({ id: this.watchId });
    }
  }



  getStatus() {
    const obj = { token: this.token.value };
    this.auth.getRiderStatus(obj).subscribe((res: any) => {
      // console.log(res);
      this.status = res.isAvailable;
    });
  }



  async showDetails(reference, details) {
    // alert(details);
    const modal = await this.modalController.create({
      component: OrderDetailsComponent,
      componentProps: { reference, details }
    });
    modal.onDidDismiss().then((data) => {
      this.fetchAssignedDeliveries();
      this.fetchAcceptedOrders();
      this.fetchOrderHistories();
      if (data.data === 'true') {
        this.returnedData = data.data;
        // console.log(this.returnedData);
      }
      else {
        console.log(data.data);
      }
    });

    await modal.present();
  }
  // onClick() {
  //   this.presentModal();
  // }
  // async presentModal() {
  //   const modal = await this.modalController.create({
  //     component: TestPage,
  //     cssClass: 'mymodal', showBackdrop: true, backdropDismiss: true
  //   });
  //   return await modal.present();
  // }


  openInbox() {
    this.router.navigateByUrl('/inbox');
  }

  async presentToast(message: string, color: string) {
    const toast = await this.toastController.create({
      animated: true,
      message,
      color,
      mode: 'ios',
      duration: 3000,
      keyboardClose: true,
      position: 'bottom'
    });
    toast.present();
  }
  async changeStatus(status) {
    const obj = { token: this.token.value };
    let message = '';
    let color = '';
    if (status.available === true) {
      const loading = await this.loadingController.create({
        spinner: null,
        cssClass: 'custom-loading'
        });
      await loading.present();
      this.auth.makeRiderAvailable(obj).subscribe(async (res: any) => {
        // console.log(res);
        await loading.dismiss();
        if (res.success === true) {
          message = 'You\'re Available for Jobs';
          color = 'primary';
        }
        else {
          message = res.message;
          color = 'secondary';
        }
        this.presentToast(message, color);
      });
      // message = 'You\'re no longer Available for Jobs';
      // color = 'dark';
    }
    if (status.available === false) {
      const loading = await this.loadingController.create({
        spinner: null,
        cssClass: 'custom-loading'
        });
      await loading.present();
      this.auth.makeRiderUnvailable(obj).subscribe(async (res: any) => {
        // console.log(res);
        await loading.dismiss();
        if (res.success === true) {
          message = 'You\'re no longer Available for Jobs';
          color = 'dark';
        }
        else {
          message = res.message;
          color = 'secondary';
        }
        this.presentToast(message, color);
      });
    }

    this.presentToast(message, color);
    // console.log(status.available);
    this.status = status.available;
  }

  fetchAssignedDeliveries() {
    this.auth.fetchAssignedDeliveries(this.token.value).subscribe((res: any) => {
      this.deliveries = res.deliveries;
      if (this.deliveries.length > 0) {
        // alert(this.deliveries.length);
        this.scheduleNotification();
      }
      // console.log(res);
    });
  }

  fetchAcceptedOrders() {
    this.auth.fetchAcceptedOrders(this.token.value).subscribe((res: any) => {
      this.acceptedDeliveries = res.deliveries;
      if (this.acceptedDeliveries.length > 0) {
        // alert(this.deliveries.length);
      }
      // console.log(res);
    });
  }

  fetchOrderHistories() {
    this.auth.fetchOrderHistory(this.token.value).subscribe((res: any) => {
      // console.log(res);
      this.deliveriesHistories = res.deliveries;
      if (this.deliveriesHistories.length > 0) {
        // alert(this.deliveries.length);
      }
      // console.log(res);
    });
  }

  async acceptRequestOrder(reference, type) {
    const loading = await this.loadingController.create({
        spinner: null,
        cssClass: 'custom-loading'
        });
    await loading.present();
    const obj = {
      token: this.token.value,
      reference,
      deliveryType: type
    };
    // console.log(obj);
    this.auth.acceptOrder(obj).subscribe(async (res: any) => {
      await loading.dismiss();
      const toast = await this.toastController.create({
          message: res.message,
        duration: 2000,
        color: 'primary',
          mode: 'ios'
        });
      toast.present();
      this.segmentModel = 'accepted';
      this.fetchAcceptedOrders();
      this.fetchAssignedDeliveries();
    });
  }

  confirmDecline() {
    // console.log(this.declineModel);
  }
  async declineRequestOrder(reference, type) {
    const loading = await this.loadingController.create({
        spinner: null,
        cssClass: 'custom-loading'
        });
    await loading.present();
    const obj = {
      token: this.token.value,
      reference,
      deliveryType: type,
      reason: 'I\'m busy'
    };
    // console.log(obj);
    this.auth.declineOrder(obj).subscribe(async (res: any) => {
      await loading.dismiss();
      const toast = await this.toastController.create({
          message: res.message,
        duration: 2000,
        color: 'primary',
          mode: 'ios'
        });
      toast.present();
      this.fetchAssignedDeliveries();
    });
  }

  async scheduleNotification() {
    await LocalNotifications.schedule({
      notifications: [
        {
          id: 1,
          title: 'Pending Requests',
          body: 'You have a pending Requests',
          sound: 'assets/music/music.mp3',
          ongoing: true,
          iconColor: '#f9ed00',
          extra: {
            data: ''
          },
          actionTypeId: 'pmur_driver'
      // led: 'FF0000',
      // icon: 'http://example.com/icon.png',
    // foreground: true
        }
      ]
    });
//       id: 1,
//       title: 'Pending Requests',
//     text: 'You have a pending Requests',
//     sound: 'assets/music/music.mp3',
//       led: 'FF0000',
//       icon: 'http://example.com/icon.png',
//     foreground: true
//   // data: { secret: key }
// });
  }
}
