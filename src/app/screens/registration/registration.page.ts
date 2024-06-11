import { Component, OnInit, ViewChild,ElementRef } from '@angular/core';
import { IonDatetime, MenuController, NavController } from '@ionic/angular';
import * as moment from 'moment'
import { ApiService } from 'src/app/api.service';
import { GlobalService } from 'src/app/global.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { format, parseISO, getDate, getMonth, getYear } from 'date-fns';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.page.html',
  styleUrls: ['./registration.page.scss'],
})
export class RegistrationPage implements OnInit {
  public passwordType: string = 'password';
  public passwordIcon: string = 'eye-off';

  public con_passwordType: string = 'password';
  public con_passwordIcon: string = 'eye-off';

  public occupation_dropwoen_arr: any;
  public maxday:any;

  public name: any = "";
  public email: any = "";
  public contact_number: any = "";
  public dob: any = "";
  public gender: any = "";
  public occupation: any = "";
  public password: any = "";
  public confirm_password: any = ""
  public dial_code:any = "+49"
  public nationality:any = "";
  public nationality_dropwoen_arr:any;
  day: any;
  month: any;
  year: any;

  maxDate: any;
  minDate: any;
   
  dateValue = '';
  dateValue2 = '';
  @ViewChild('datetimePicker', { read: ElementRef, static: false}) private pickerDate: ElementRef;
  constructor(
    public global: GlobalService,
    public api: ApiService,
    public navCtrl: NavController,
    public translateService: TranslateService,
    public menuCtrl: MenuController,
  ) {

    this.maxDate = this.global.maxday_dob();
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
    //this.dob = this.global.maxday()
    this.getOcupationList();
    //console.log(this.global.maxday());
    this.maxday = this.global.maxday();
   
  }

  public hideShowPassword(type) {
    if (type == 'con') {
      this.con_passwordType = this.con_passwordType === 'text' ? 'password' : 'text';
      this.con_passwordIcon = this.con_passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
    } else {
      this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
      this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
    }
  }

  formatDate(value: string) {
    //console.log(value)
    return this.dob = moment(value).format('YYYY-MM-DD')
  }


  getOcupationList() {
    this.global.loadingOpen()
    this.api.getOccupationList('get_occupations', {}).then((res: any) => {
      //console.log(res)
      if (res.status == '200') {
       // this.global.loadingClose();
        this.occupation_dropwoen_arr = res?.data;
        this.getNationality() 
      } else {
        this.global.loadingClose();
        this.global.toast_msg(res?.message)
      }
    })
  }

  getNationality() {
    //this.global.loadingOpen()
    this.api.getOccupationList('nationalities', {}).then((res: any) => {
      //console.log(res)
      if (res.status == '200') {
        this.global.loadingClose();
        this.nationality_dropwoen_arr = res?.data
      } else {
        this.global.loadingClose();
        this.global.toast_msg(res?.message)
      }
    })
  }

  registration() {
    if (!this.name.trim()) {
      this.global.getTranslateLabel('validation_error_msg.blank_name');
    } else if (!this.global.charecterValidation(this.name)) {
      this.global.getTranslateLabel('validation_error_msg.mixCharecter_err');
    } else if (!this.contact_number.trim()) {
      this.global.getTranslateLabel('validation_error_msg.blank_phone');
    }else if (!this.global.charecterValidation(this.contact_number)) {
      this.global.getTranslateLabel('validation_error_msg.invalid_phone_format');
    } else if (!this.email.trim()) {
      this.global.getTranslateLabel('validation_error_msg.blank_email');
    } else if (!this.global.isvalidEmailFormat(this.email)) {
      this.global.getTranslateLabel('validation_error_msg.invalid_email');
    }  else if (this.gender == '') {
      this.global.getTranslateLabel('validation_error_msg.blank_gender');
    } else if (this.occupation == '') {
      this.global.getTranslateLabel('validation_error_msg.blank_occupation');
    } else if (this.dob == '') {
      this.global.getTranslateLabel('validation_error_msg.blank_dob');
    } else if (this.nationality == '') {
      this.global.getTranslateLabel('validation_error_msg.blank_nationality');
    }else if (!this.password.trim()) {
      this.global.getTranslateLabel('validation_error_msg.blank_password');
    }else if (!this.global.isvalidPasswordFormat(this.password)) {
      this.global.getTranslateLabel('validation_error_msg.password_valid_format_error');
    } else if (this.password.length < 8) {
      this.global.getTranslateLabel('validation_error_msg.password_length_error');
    } else if (!this.confirm_password.trim()) {
      this.global.getTranslateLabel('validation_error_msg.blank_confrim_password');
    } else if (this.password != this.confirm_password) {
      this.global.getTranslateLabel('validation_error_msg.password_with_confrimpassword_validate_err');
    } else {
      this.global.loadingOpen()
      let registerParam = {
        name: this.name,
        email: this.email,
        contact_number: this.contact_number,
        dial_code:this.dial_code,
        dob: this.dob,
        gender: this.gender,
        occupation: this.occupation,
        password: this.password,
        confirm_password: this.confirm_password,
        nationality:this.nationality
      }
      this.api.signup('register', registerParam).then((res: any) => {
        //console.log(res)
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

  gotoSignin(){
    this.navCtrl.pop()
  }


}
