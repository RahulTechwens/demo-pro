import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, NavController, Platform } from '@ionic/angular';
import { ApiService } from 'src/app/api.service';
import { GlobalService } from 'src/app/global.service';


@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {
  public email: any = ""
  constructor(
    private route: Router,
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    private platform: Platform,
    private global: GlobalService,
    public modalController: ModalController,
    public api: ApiService,
  ) { }

  ngOnInit() {
  }

  close() {
    this.modalCtrl.dismiss();
  }

  forgotPassword() {
    if (!this.email.trim()) {
      this.global.getTranslateLabel('validation_error_msg.blank_email');
    } else if (!this.global.isvalidEmailFormat(this.email)) {
      this.global.getTranslateLabel('validation_error_msg.invalid_email');
    } else {
      this.global.loadingOpen()
      this.api.forgotPassword('forgot_password', { email: this.email }).then((res: any) => {
        //console.log(res)
        if (res?.status == 200) {
          this.global.loadingClose();
          this.global.toast_msg(res.message);
          this.modalCtrl.dismiss();
        } else {
          this.global.loadingClose()
          this.global.toast_msg(res.message)
        }
      })
    }

  }

}
