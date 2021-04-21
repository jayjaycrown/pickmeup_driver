import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';


import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
// import { IonicStorageModule } from '@ionic/storage';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { HttpClientModule } from '@angular/common/http';

// import { Angular4PaystackModule } from 'angular4-paystack';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AuthGuard } from './guards/auth.guard';
import { NativeGeocoder } from '@ionic-native/native-geocoder/ngx';
// import { AuthGuard } from './_helpers/auth.guard';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  schemas: [
  CUSTOM_ELEMENTS_SCHEMA
],
  imports: [
    BrowserModule,
    // IonicStorageModule.forRoot(),
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    // Angular4PaystackModule.forRoot('pk_test_f800b0dba70e0b2db874b4c0605aef1618346744'),
  ],
  providers: [
    StatusBar,
    SplashScreen,
    AuthGuard,
    NativeGeocoder,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
