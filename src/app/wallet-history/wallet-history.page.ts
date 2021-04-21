import { Component, OnInit } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';
import { AuthService } from '../_services/auth.service';
import { Plugins } from '@capacitor/core';
const { Camera, Storage } = Plugins;
const TOKEN_KEY = 'rider-token';
@Component({
  selector: 'app-wallet-history',
  templateUrl: './wallet-history.page.html',
  styleUrls: ['./wallet-history.page.scss'],
})
export class WalletHistoryPage implements OnInit {
  token: { value: string; };
  walletBalance: any;
  constructor(
    private auth: AuthService,
    private loadingController: LoadingController,
    private toastController: ToastController
  ) { }

  ngOnInit() {
  }

  async ionViewWillEnter() {
    this.token = await Storage.get({ key: TOKEN_KEY });
    this.walletHistories();
  }
  
  walletHistories() {
    this.auth.fetchPaymentHistories(this.token.value).subscribe((res: any) => {
      if (res.success === true) {
        this.walletBalance = res.payments
      }
    })
  }
}
