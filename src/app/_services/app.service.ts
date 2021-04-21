import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
// import { Storage } from '@ionic/storage';
import { ToastController, Platform } from '@ionic/angular';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { BehaviorSubject, from, Observable, Subject } from 'rxjs';
import { catchError, retry, map, switchMap, tap } from 'rxjs/operators';
// import { environment } from '../../environments/environment';
import { environment } from '../../environments/environment.prod';
import { Plugins } from '@capacitor/core';
const { Storage } = Plugins;
const TOKEN_KEY = 'my-token';
@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor() { }
}
