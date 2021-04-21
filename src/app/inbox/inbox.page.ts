import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { LoadingController, AlertController, ModalController } from '@ionic/angular';

import { AuthService } from '../_services/auth.service';
import { ViewInboxPage } from './view-inbox/view-inbox.page';
@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.page.html',
  styleUrls: ['./inbox.page.scss'],
})
export class InboxPage implements OnInit {

  item: any;
  message: any;
  messageList = [];
  messageContent: any;
  isread: any;
  messageHeader: any;
  messageId: any;
  constructor(
    private auth: AuthService,
    private loadingController: LoadingController,
    private alertController: AlertController,
    public modalController: ModalController,
    public toastController: ToastController
  ) { }

  async ngOnInit() {
    this.getInbox()
    
  }

  async getInbox() {
    const loading = await this.loadingController.create({
      spinner: null,
      cssClass: 'custom-loading'
    });
    await loading.present();
    (await this.auth.fetchInbox()).subscribe(
      async (res: any) => {
        // console.log(res);
        if (res.success === true) {
          // const token = res.token;
          await loading.dismiss();
          this.messageList = res.inbox;
          console.log(this.messageList);
          // tslint:disable-next-line: prefer-for-of
          for (let i = 0; i < this.messageList.length; i++) {
            this.messageHeader = this.messageList[i].message.heading;
            this.messageContent = this.messageList[i].message.content;
            this.messageId = this.messageList[i].messageId;
            this.isread = this.messageList[i].isRead;
          }
          // console.log(this.isread);
          // console.log(res.message);
        } else {
          await loading.dismiss();
          const alert = await this.alertController.create({
            header: 'Failed!!!',
            message: res.message,
            buttons: ['OK'],
          });
          await alert.present();
        }
      },

      err => {
        console.log(err);
      });
  }
  async unread(item: any) {
    (await this.auth.readInbox(item)).subscribe(
      res => {
        console.log(res);
      }
    );
  }
  async delete(item: any) {
    (await this.auth.deleteInbox(item)).subscribe(
      async (res:any) => {
        const toast = await this.toastController.create({
      message: res.message,
          position: 'bottom',
      color: 'primary',
      duration: 5000,
    });
        toast.present();
        
        this.getInbox();
      }
    )
  }

  openInboxMessage() {
    this.presentModal();
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: ViewInboxPage,
      componentProps: {
        messageHeader: this.messageHeader,
        messageContent: this.messageContent,
        messageId: this.messageId
        // other: {couldAlsoBeAnObject: true}
      },
      swipeToClose: true,
      cssClass: '', showBackdrop: true, backdropDismiss: true
    });
    return await modal.present();
  }
}
