import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController, NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { ApiService } from 'src/app/api.service';
import { GlobalService } from 'src/app/global.service';

@Component({
  selector: 'app-aditional-details',
  templateUrl: './aditional-details.page.html',
  styleUrls: ['./aditional-details.page.scss'],
})
export class AditionalDetailsPage implements OnInit {
  public email: any = "";
  public contact_number: any = "";
  public userDetails: any = "";
  public dial_code: any = "+49";
  constructor(
    public global: GlobalService,
    public api: ApiService,
    public navCtrl: NavController,
    public translateService: TranslateService,
    public menuCtrl: MenuController,
    private route: Router,
  ) {
    if (route.getCurrentNavigation().extras.state) {
      this.userDetails = route.getCurrentNavigation().extras.state?.data;
      this.userDetails.email = this.userDetails.email == null ? '' : this.userDetails.email;
      this.userDetails.contact_number = this.userDetails.contact_number == null ? '' : this.userDetails.contact_number;
      console.log(this.userDetails);
      this.email =  this.userDetails?.email;
      this.contact_number = this.userDetails?.contact_number;
    }
  }

  ngOnInit() {
  }

  ionViewWillLeave() {
    this.menuCtrl.enable(true);
    this.menuCtrl.swipeGesture(true)
  }

  ionViewWillEnter() {
    this.menuCtrl.enable(false);
    this.menuCtrl.swipeGesture(false);
  }

  submit() {
    if (!this.email.trim()) {
      this.global.getTranslateLabel('validation_error_msg.blank_email');
    } else if (!this.global.isvalidEmailFormat(this.email)) {
      this.global.getTranslateLabel('validation_error_msg.invalid_email');
    } else if (!this.contact_number.trim()) {
      this.global.getTranslateLabel('validation_error_msg.blank_phone');
    } else if (!this.global.charecterValidation(this.contact_number)) {
      this.global.getTranslateLabel('validation_error_msg.invalid_phone_format');
    } else {
      let data = {
        "email": this.email,
        "dial_code": this.dial_code,
        "phone": this.contact_number,
        "facebook_id": this.userDetails?.facebook_id,
      }
      this.global.loadingOpen()
      this.api.signup('email_for_social_login', data).then((res: any) => {
        console.log('submit response', res)
        if (res.success == true) {
          this.global.loadingClose();
          this.global.toast_msg(res?.message);
          this.navCtrl.pop();
        } else {
          this.global.loadingClose();
          this.global.toast_msg(res?.message)
        }
      })
    }
  }
}
