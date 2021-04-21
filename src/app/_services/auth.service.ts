import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
// import { Storage } from '@ionic/storage';
import { ToastController, Platform } from '@ionic/angular';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
// import { of, Observable, Subject, throwError, BehaviorSubject } from 'rxjs';
// import { map, tap, switchMap } from 'rxjs/operators';
import { BehaviorSubject, from, Observable, of, Subject } from 'rxjs';
import { catchError, retry, map, switchMap, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
// import { environment } from '../../environments/environment.prod';

import { Plugins } from '@capacitor/core';
const { Storage } = Plugins;
const TOKEN_KEY = 'rider-token';



@Injectable({
  providedIn: 'root'
})
export class AuthService {

  httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    Accept: 'application/fhir+json',
    AUTHORIZATION: ' [jwt]',
    'X-Requested-With': 'XMLHttpRequest',
  }),
};
  isAuthenticated: BehaviorSubject<any>;
  public currentUser: Observable<any>;
  token = '';

  // authState = new BehaviorSubject(false);

  constructor(
    private router: Router,
    public toastController: ToastController,
    private http: HttpClient,
  ) {
    this.isAuthenticated = new BehaviorSubject<any>(
      JSON.parse(localStorage.getItem('currentUser'))
    );
    this.loadToken();
    this.currentUser = this.isAuthenticated.asObservable();
  }

  async loadToken() {
    const token = await Storage.get({ key: TOKEN_KEY });
    if (token && token.value) {
      // console.log('set token: ', token.value);
      this.token = token.value;
      this.isAuthenticated.next(true);
    } else {
      this.isAuthenticated.next(false);
    }
  }

  public get currentUserValue() {
    return this.isAuthenticated.value;
  }


  // Start Authentication
  register(registeForm) {
    const url = environment.api + 'signup.php';
    return this.http.post(url, registeForm).pipe(
      map((user: any) => {
        const token = (user.token);
        if (token !== undefined) {
          Storage.set({ key: TOKEN_KEY, value: token });
        }
        // Storage.set({ key: TOKEN_KEY, value: token });
        this.isAuthenticated.next(user);
        return user;
      })
    );
  }

  login(loginForm: { email, password }): Observable<any> {
    const url = environment.api + 'signin.php';
    return this.http.post(url, loginForm).pipe(
      // map((data: any) => data.token),
      map((user: any) => {
        const token = (user.token);
        if (token !== undefined) {
          Storage.set({ key: TOKEN_KEY, value: token });
        }
        this.isAuthenticated.next(user);
        return user;
      })
      // ,switchMap(token => {
      //   return from(Storage.set({ key: TOKEN_KEY, value: token }));
      // }),
      // tap(_ => {
      //   this.isAuthenticated.next(true);
      // })
    );
  }

  forgot(data) {
    const url = environment.api + 'forgot-password.php';
    return this.http.post(url, data).pipe();
  }

  reset(data) {
    const url = environment.api + 'reset-password.php';
    return this.http.post(url, data).pipe();
  }

  logout(): Promise<void> {
    this.isAuthenticated.next(false);
    return Storage.remove({ key: TOKEN_KEY });
  }


  // End Authentication


  // User Profile

  getUserProfile(obj) {

    const url = environment.api + 'fetch-rider-details.php';
    // const obj = { token: token.value };
    // console.log(obj);
    return this.http.post(url, obj).pipe();
  }
  editUserProfile(data) {
    const url = environment.api + 'edit-rider-profile.php';

    return this.http.post(url, data).pipe();
  }

  editUserPassword(data) {
    const url = environment.api + 'edit-rider-password.php';

    return this.http.post(url, data).pipe();
  }

  getRiderStatus(obj) {
    const url = environment.api + 'get-rider-availability.php';

    return this.http.post(url, obj).pipe();
  }

  makeRiderAvailable(obj) {
    const url = environment.api + 'on-rider-availability.php';
    return this.http.post(url, obj).pipe();
  }

  makeRiderUnvailable(obj) {
    const url = environment.api + 'off-rider-availability.php';
    return this.http.post(url, obj).pipe();
  }

  getVerificationStatus(obj) {
    const url = environment.api + 'get-rider-verification-status.php';
    // const obj = { token: this.token };
    return this.http.post(url, obj).pipe();
  }

  uploadDocument(data) {
    const httpOptions = {
      headers: new HttpHeaders({
          enctype: 'multipart/form-data',
      })
  };
    // const token = this.token;
    const url = environment.api + 'upload-documents.php';
    const formData: any = new FormData();
    formData.append('token', data.token);
    formData.append('ridersCard', data.ridersCard);
    formData.append('vehicleLicense', data.vehicleLicense);
    formData.append('stageCarriage', data.stageCarriage);
    console.log(JSON.stringify(formData));
    formData.forEach((value, key) => {
      console.log(key + ' , ' + value);
    });
    return this.http.post(url, formData, httpOptions).pipe(
      catchError(this.handleError('uploadDocument', formData))
    );
  }


  uploadImage(blobData, ext) {
    const url = environment.api + 'upload-profile-pic.php';
    const formData: any = new FormData();
    formData.append('token', this.token);
    formData.append('avatar', blobData, `myimage.${ext}`);
    // formData.append('test', 'tstsssssss')
    console.log(JSON.stringify(formData));
    formData.forEach((value, key) => {
      console.log(key + ' , ' + value);
    });

    return this.http.post(url, formData, {
      reportProgress: true,
      observe: 'events'
    });
  }
  async uploadImageFile(file: File) {
    // await this.loadToken();
    // const token = Storage.get({ key: TOKEN_KEY });
    const url = environment.api + 'upload-profile-pic.php';
    const formData: any = new FormData();
    formData.append('token', this.token);
    formData.append('avatar', file);
    // formData.append('test', 'tstsssssss')
    console.log(JSON.stringify(formData));
    formData.forEach((value, key) => {
      console.log(key + ' , ' + value);
    });

    return this.http.post(url, formData, {
      reportProgress: true,
      observe: 'events'
    });
  }


  // Start Inbox
  async fetchInbox() {
    await this.loadToken();
    // const token = Storage.get({ key: TOKEN_KEY});
    const obj = { token: this.token };
    const url = environment.api + 'fetch-user-inbox.php';
    // alert(obj);
    return this.http.post(url, obj).pipe();
  }

  async readInbox(data) {
    await this.loadToken();
    // const token = Storage.get({ key: TOKEN_KEY});
    const obj = { token: this.token, messageId: data };
    // console.log(obj);
    const url = environment.api + 'read-inbox-message.php';
    return this.http.post(url, obj).pipe();
  }

  async deleteInbox(item) {
    await this.loadToken();
    // const token = Storage.get({ key: TOKEN_KEY});
    const obj = { token: this.token, messageId: item };
    // console.log(obj);
    const url = environment.api + 'delete-inbox-message.php';
    return this.http.post(url, obj).pipe();
  }

  // Wallet System API
  createTransaction(data) {
    const url = environment.api + 'create-transaction.php';
    return this.http.post(url, data).pipe();
  }

  confirmTransaction(data) {
    const obj = {
      token: this.token,
      reference: data
    };
    const url = environment.api + 'confirm-transaction.php';
    return this.http.post(url, obj).pipe();
  }

  setTransactionPin(data) {
    const url = environment.api + 'set-transaction-pin.php';
    return this.http.post(url, data).pipe();
  }

  editTransactionPin(data: any) {
    const url = environment.api + 'edit-transaction-pin.php';
    return this.http.post(url, data).pipe();
  }

  checkTransactionPin() {
    const obj = { token: this.token };
    console.log(obj);
    const url = environment.api + 'check-transaction-pin.php';
    return this.http.post(url, obj).pipe();
  }

  // Deliveries API

  async fetchStates() {
    await this.loadToken();
    // const token = Storage.get({ key: TOKEN_KEY});
    const obj = { token: this.token };
    // console.log(obj);
    const url = environment.api + 'fetch-states.php';
    return this.http.post(url, obj).pipe();
  }

  async fetchAreas() {
    await this.loadToken();
    const token = Storage.get({ key: TOKEN_KEY});
    const obj = { token: this.token };
    // console.log(obj);
    const url = environment.api + 'fetch-areas.php';
    return this.http.post(url, obj).pipe();
  }

  createSingleDelivery(data) {
    const url = environment.api + 'create-single-delivery.php';
    return this.http.post(url, data).pipe();
  }
  confirmSingleDelivery(data) {
    // await this.loadToken();
    // const token = Storage.get({ key: TOKEN_KEY});
    // const obj = { token: this.token };

    const url = environment.api + 'confirm-single-delivery.php';
    return this.http.post(url, data).pipe();
  }


  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      this.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
  private log(message: string) {
    console.log(message);
  }



  updateRiderLocation(token, address) {
    const obj = {
      token,
      location: address
    };
    const url = environment.api + 'update-rider-location.php';
    return this.http.post(url, obj).pipe();
  }

  fetchAssignedDeliveries(token) {
    const obj = {
      token,
    };
    const url = environment.api + 'fetch-assigned-deliveries.php';
    return this.http.post(url, obj).pipe();
  }

  acceptOrder(data) {
    const url = environment.api + 'accept-order.php';
    return this.http.post(url, data).pipe();
  }

  declineOrder(data) {
    const url = environment.api + 'decline-order.php';
    return this.http.post(url, data).pipe();
  }

  pickupOrder(data) {
    const url = environment.api + 'pickup-order.php';
    return this.http.post(url, data).pipe();
  }

  deliveredOrder(data) {
    const url = environment.api + 'deliver-order.php';
    return this.http.post(url, data).pipe();
  }

  fetchOrderHistory(token) {
    const url = environment.api + 'fetch-order-history.php';
    return this.http.post(url, {token}).pipe();
  }

  fetchAcceptedOrders(token) {
    const url = environment.api + 'fetch-accepted-orders.php';
    return this.http.post(url, {token}).pipe();
  }

  fetchPaymentHistories(token) {
    const url = environment.api + 'fetch-payment-history.php';
    return this.http.post(url, {token}).pipe();
  }
}
