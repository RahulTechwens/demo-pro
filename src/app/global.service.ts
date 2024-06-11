import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AlertController, LoadingController, NavController, ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { getDatabase, ref, onValue, set, push, update } from "firebase/database";
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  public default_language: any;
  public loading: any;
  public userdetails: any = {};
  //public image_path = "https://dev8.ivantechnology.in/privategroup/public/"

  public base_ul = "https://p74.ivantechnology.in/privategroup/api";
  public image_path = "https://p74.ivantechnology.in/privategroup/public/"
  public user_role: any = "";
  


  constructor(
    private translate: TranslateService,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    public alertController: AlertController,
    public http: HttpClient,
    public navCtrl: NavController,
  ) {}

  isvalidEmailFormat(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  isvalidPasswordFormat(password) {
    var re = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    return re.test(password);
  }

  tokenloss_logout(){
    this.userdetails = "";
    localStorage.removeItem("token");
    localStorage.removeItem("privateGroup_Udata_local");
    this.navCtrl.navigateRoot(['./login']);
  }

  maxday_dob() {
    let today = new Date();
    let todayDate = ('0' + (today.getDate())).slice(-2);
    let todayMonth = ('0' + (today.getMonth() + 1)).slice(-2);
    let lstyear = today.getFullYear()
    let maxdate = lstyear + '-' + todayMonth + '-' + todayDate;
    return (maxdate);
  }

  getfiredatebase() {
    let database = getDatabase();
    return database;
  }

  tomorrow() {
    var currentDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
    var day = ('0' +(currentDate.getDate())).slice(-2)
    var month = ('0' +(currentDate.getMonth() + 1)).slice(-2);
    var y = currentDate.getFullYear();
    var mindate = y + "-" + month + "-" + day;
    console.log(mindate)
    return (mindate);
  }

  tomorrow_date() {
		let today = new Date();
		let todayDate = ('0' + (today.getDate())).slice(-2);
		let todayMonth = ('0' + (today.getMonth() + 1)).slice(-2);
		let year = today.getFullYear();
		let mindate = year + '-' + todayMonth + '-' + todayDate;
		return (mindate);
	}

	max_date() {
		let today = new Date();
		let todayDate = ('0' + (today.getDate())).slice(-2);
		let todayMonth = ('0' + (today.getMonth() + 1)).slice(-2);
		let lstyear = today.getFullYear() + 30;
		let maxdate = lstyear + '-' + todayMonth + '-' + todayDate;
		return (maxdate);
	}

  charecterValidation(text) {
    var charRegex = /^[A-Za-z0-9]+$/
    return charRegex.test(text);
  }

  maxday() {
    let today = new Date();
    let todayDate = ('0' + (today.getDate())).slice(-2);
    let todayMonth = ('0' + (today.getMonth() + 1)).slice(-2);
    let lstyear = today.getFullYear();
    let maxdate = lstyear + '-' + todayMonth + '-' + todayDate;
    return (maxdate);
  }

  async loadingOpen() {
    this.loading = await this.loadingCtrl.create({
      message: '',
      cssClass: 'loader-waiting'
    });
    await this.loading.present();
  }

  loadingClose() {
    this.loading.dismiss();
  }

  async toast_msg(txt: any) {
    const toast = await this.toastCtrl.create({
      message: txt,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }

  getDefaultLanguage() {
    
    if (localStorage.getItem('default_language') != undefined) {
      let default_language = localStorage.getItem('default_language');
      this.translate.setDefaultLang(default_language);
      this.translate.use(default_language);
      this.default_language = default_language;
    } else {
      this.translate.setDefaultLang('en');
      this.translate.use('en');
      this.default_language = 'en';
      localStorage.setItem('default_language', 'en')
    }
  }

  setLanguage(lang) {
    console.log(lang)
    let setLanguge = lang
    this.translate.setDefaultLang(setLanguge);
    localStorage.setItem('default_language', setLanguge)
    this.translate.use(setLanguge);
    this.default_language = setLanguge;
    return setLanguge
  }

  getTranslateLabel(key) {
    this.translate.get(key).subscribe((value: any) => {
      console.log(value)
      this.toast_msg(value)
    })
  }

  getToken() {
    return localStorage.getItem('token');
  }

}
