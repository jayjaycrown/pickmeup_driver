import { NgModule, CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
// import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { ProfilePageRoutingModule } from './profile-routing.module';

import { ProfilePage } from './profile.page';
// import { FundWalletComponent } from './fund-wallet/fund-wallet.component';
import { SettingsComponent } from './settings/settings.component';
import { PasswordComponent } from './settings/password/password.component';
import { PinComponent } from './pin/pin.component';
// import { Angular4PaystackModule } from 'angular4-paystack';
// import { TooltipsModule } from 'ionic-tooltips';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProfilePageRoutingModule,
    ReactiveFormsModule,
    // TooltipsModule.forRoot(),
    // Angular4PaystackModule.forRoot('pk_test_f800b0dba70e0b2db874b4c0605aef1618346744'),
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA],
  declarations: [ProfilePage, SettingsComponent, PasswordComponent, PinComponent]
})
export class ProfilePageModule {}
