import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController, Platform } from '@ionic/angular';
import { ApiService } from 'src/app/api.service';
import { GlobalService } from 'src/app/global.service';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.page.html',
  styleUrls: ['./contact-us.page.scss'],
})
export class ContactUsPage implements OnInit {
  content: any;
  public name: any = '';
  public email: any = '';
  public phone: any = '';
  public message: any = '';

  constructor(
    private route: Router,
    public global: GlobalService,
    public api: ApiService,
    private platform: Platform,
    public menuCtrl: MenuController

  ) { }

  ngOnInit() {
    // this.checkPlatfrom();
    this.menuCtrl.enable(true);
    this.menuCtrl.swipeGesture(true)
  }

  ionViewWillEnter() {
    //this.global.presentLoadingDefault();
    // this.getinfo()
  }

  contactUs() {
    if (!this.name.trim()) {
      this.global.getTranslateLabel('others.name_blank_err');
    } else if (!this.global.charecterValidation(this.name)) {
      this.global.getTranslateLabel('others.charecter_validation');
    } else if (!this.email.trim()) {
      this.global.getTranslateLabel('others.email_blank_err');
    } else if (!this.global.isvalidEmailFormat(this.email)) {
      this.global.getTranslateLabel('others.email_valid_err');
    } else if (!this.phone.trim()) {
      this.global.getTranslateLabel('others.mobile_blank_err');
    } else if (!this.message.trim()) {
      this.global.getTranslateLabel('others.contact_msg');
    } else {
      this.global.loadingOpen();
      let data = {
        name: this.name,
        email: this.email,
        phone: this.phone,
        message: this.message
      }
      this.api.contact_us('contact_quote', data).then((res: any) => {
        //console.log(res);
        if (res.status == 200) {
          this.global.loadingClose()
          //console.log(res)
          this.global.toast_msg(res?.message);
          this.name = "",
          this.email="",
          this.phone ="",
          this.message =""
        } else {
          this.global.loadingClose()
          this.global.toast_msg(res?.message)
        }
      })
    }
  }

}

