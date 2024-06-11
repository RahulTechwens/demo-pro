import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, NavController, Platform } from '@ionic/angular';
import { ApiService } from 'src/app/api.service';
import { GlobalService } from 'src/app/global.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.scss'],
})
export class ChangePasswordPage implements OnInit {
  public new_password: any = "";
  public old_password:any = "";
  public passwordType: string = 'password';
  public passwordIcon: string = 'eye-off';

  public con_passwordType: string = 'password';
  public con_passwordIcon: string = 'eye-off';
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

  public hideShowPassword(type) {
    if (type == 'con') {
      this.con_passwordType = this.con_passwordType === 'text' ? 'password' : 'text';
      this.con_passwordIcon = this.con_passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
    } else {
      this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
      this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
    }
  }

  close() {
    this.navCtrl.pop();
  }

  changePassword() {
    if (!this.old_password.trim()) {
      this.global.getTranslateLabel('change_password.old_pass_err');
    } else if (!this.new_password.trim()){
      this.global.getTranslateLabel('change_password.new_pass_err');
    }else if (!this.global.isvalidPasswordFormat(this.new_password)) {
      this.global.getTranslateLabel('validation_error_msg.password_valid_format_error');
    } else if (this.new_password.length <8){
      this.global.getTranslateLabel('change_password.new_pass_length_err');
    } else {
      this.global.loadingOpen()
      this.api.changePassword('change_password', { old_password: this.old_password,new_password:this.new_password }).then((res: any) => {
        //console.log(res)
        if (res?.status == 200) {
          this.global.loadingClose();
          this.global.toast_msg(res.message);
          this.navCtrl.pop()
          //this.modalCtrl.dismiss();
        } else {
          this.global.loadingClose()
          this.global.toast_msg(res.message)
        }
      })
    }

  }

}
