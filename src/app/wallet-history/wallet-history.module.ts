import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WalletHistoryPageRoutingModule } from './wallet-history-routing.module';

import { WalletHistoryPage } from './wallet-history.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WalletHistoryPageRoutingModule
  ],
  declarations: [WalletHistoryPage]
})
export class WalletHistoryPageModule {}
