import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadingController, AlertController, ModalController } from '@ionic/angular';
import { AuthService } from '../../_services/auth.service';

@Component({
  selector: 'app-view-inbox',
  templateUrl: './view-inbox.page.html',
  styleUrls: ['./view-inbox.page.scss'],
})
export class ViewInboxPage implements OnInit {

  @Input() messageHeader: string;
  @Input() messageContent: any;
  @Input() messageId: string;

  messageList: any;
  // messageContent: any;
  isread: any;
  // id;

  constructor(
    private loadingController: LoadingController,
    private auth: AuthService,
    private alertController: AlertController,
    private route: ActivatedRoute,
    private modalCtrl: ModalController
  ) { }

  async ngOnInit() {
    // console.log(this.messageContent, this.messageHeader, this.messageId);
    // this.route.paramMap.subscribe(paramMap => {
    //   this.id = paramMap.get('id');
    //   alert(this.id);
    // });
    // const loading = await this.loadingController.create();
    // await loading.present();
    (await this.auth.readInbox(this.messageId)).subscribe(
      async (res: any) => {
        // await loading.dismiss();
        console.log(res);
    },

      async err => {
        // await loading.dismiss();
        console.log(err);
      });
  }

  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalCtrl.dismiss({
      dismissed: true
    });
  }

}
