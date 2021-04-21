import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';
import { CallNumber } from '@ionic-native/call-number/ngx';

import { HomePageRoutingModule } from './home-routing.module';
// import { TestPageModule } from '../test/test.module';
import { OrderDetailsComponent } from './order-details/order-details.component';
// import { LocalNotifications } from '@ionic-native/local-notifications/ngx';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
  ],
  providers: [CallNumber,
    // LocalNotifications
  ],
  declarations: [HomePage, OrderDetailsComponent]
})
export class HomePageModule {}
