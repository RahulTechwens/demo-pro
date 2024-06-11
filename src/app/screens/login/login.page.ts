import { Component, OnInit } from '@angular/core';
import { MenuController, ModalController, NavController } from '@ionic/angular';

import { GlobalService } from '../../global.service';
import { ApiService } from 'src/app/api.service';

import { FacebookLogin, FacebookLoginResponse, FacebookLoginPlugin } from '@capacitor-community/facebook-login';
import { Plugins } from '@capacitor/core';

import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { ForgotPasswordPage } from '../forgot-password/forgot-password.page';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  public passwordType: string = 'password';
  public passwordIcon: string = 'eye-off';
  public selectedLanguage: any = ""

  fbLogin: FacebookLoginPlugin;
  user = null;
  token = null;

  public email: any = "";
  public password: any = ""

  constructor(
    public navCtrl: NavController,
    private global: GlobalService,
    private http: HttpClient,
    private route: Router,
    public menuCtrl: MenuController,
    public modalController: ModalController,
    public api: ApiService,
  ) {
    this.selectedLanguage = this.global.default_language;
    this.setupFbLogin();
  }

  ngOnInit() {
    this.logout()
  }

  ionViewWillEnter() {
    this.menuCtrl.enable(false);
    this.menuCtrl.swipeGesture(false)
  }

  ionViewWillLeave() {
    this.menuCtrl.enable(true);
    this.menuCtrl.swipeGesture(true)
  }

  public hideShowPassword() {
    this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
    this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
  }

  languageChanged() {
    this.global.setLanguage(this.selectedLanguage)
  }



  async setupFbLogin() {
    this.fbLogin = FacebookLogin;
  }

  login() {
    if (!this.email.trim()) {
      this.global.getTranslateLabel('validation_error_msg.blank_email');
    } else if (!this.global.isvalidEmailFormat(this.email)) {
      this.global.getTranslateLabel('validation_error_msg.invalid_email');
    } else if (!this.password.trim()) {
      this.global.getTranslateLabel('validation_error_msg.blank_password');
    } else {
      this.global.loadingOpen();
      this.api.sigin('auth/login', { email: this.email, password: this.password }).then((res: any) => {
        //console.log(res)
        if (res.success == true) {
          this.global.loadingClose();
          this.global.toast_msg(res.message);
          this.store_data(res)
          this.route.navigate(['/home']);
        } else {
          this.global.toast_msg(res.message)    
          this.global.loadingClose()
        }
      })
    }
  }

  store_data(res) {
    let uData = res?.data;
    this.global.userdetails = uData;
    this.global.user_role = uData?.user_permission?.roles?.role_name;
    localStorage.setItem('token', res?.token);
    localStorage.setItem('privateGroup_Udata_local', JSON.stringify(uData));
  }


  async forgotPassword() {
    const modal = await this.modalController.create({
      component: ForgotPasswordPage,
      cssClass: 'forgotPassword-modal',
      showBackdrop: true,
      backdropDismiss: true,
      animated: true,
      swipeToClose: false,
    });
    modal.onDidDismiss().then((modelData) => {
    });
    return await modal.present();
  }

  gotoRegistionPage() {
    this.route.navigate(['/registration']);
  }



  async fblogin() {
    const FACEBOOK_PERMISSIONS = ['email','user_birthday'];
    const result = await this.fbLogin.login({ permissions: FACEBOOK_PERMISSIONS });
    if (result.accessToken && result.accessToken.userId) {
      this.token = result.accessToken;
      this.loadUserData();
      console.log('get token from if', this.token)
    } else if (result.accessToken && !result.accessToken.userId) {
      // Web only gets the token but not the user ID
      // Directly call get token to retrieve it now
      this.getCurrentToken();
    } else {
      // Login failed;
      console.log('login failed')
    }
  }


  async getCurrentToken() {
    const result = await this.fbLogin.getCurrentAccessToken();
    console.log('get token from else',result)
    if (result.accessToken) {
      this.token = result.accessToken;
      console.log(this.token)
      this.loadUserData();
    } else {
      // Not logged in.
    }
  }

  async loadUserData() {
    const url = `https://graph.facebook.com/${this.token.userId}?fields=id,name,picture.width(720),birthday,email&access_token=${this.token.token}`;
    this.http.get(url).subscribe((res: any) => {    
      console.log(this.token)
      console.log("login res", res)
      let pdata = {
        "email": res.email?res.email:"",
        "phone":"",
        "name": res.name,
        "facebook_id": res.id
      }
      this.global.loadingOpen();
      this.api.sigin('social/facebook', pdata).then((res: any) => {
        console.log(res);
        if(res.status == 200 && (res?.data.contact_number == null || res?.data?.email == null) && res?.data?.email_verified == 'no'){
          let param = {data:res?.data}
          this.route.navigate(['./aditional-details'], {state : param});
          this.global.toast_msg(res.message);
          this.global.loadingClose();
        }else if(res.status == 200 && (res?.data.contact_number != null && res?.data?.email != null) && res?.data?.email_verified == 'no'){
          //let param = {data:res?.data}
         // this.route.navigate(['./aditional-details'], {state : param});
          this.global.toast_msg(res.message);
          this.global.loadingClose();
        }else if(res.status == 200 && (res?.data.contact_number != null && res?.data?.email != null) && res?.data?.email_verified == 'yes'){
          this.store_data(res);
          this.route.navigate(['/home']);
          this.global.toast_msg(res.message);
          this.global.loadingClose();
        }else{
          this.global.toast_msg(res.message);
          this.global.loadingClose();
        }
     
      })
    });
  }

  async logout() {
    await this.fbLogin.logout();
    this.user = null;
    this.token = null;
    //console.log('logout')
  }
}

       


