import { Component, QueryList, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, IonRouterOutlet, MenuController, NavController, ToastController } from '@ionic/angular';
import { GlobalService } from './global.service';
import { ApiService } from 'src/app/api.service';
import { TranslateService } from '@ngx-translate/core';
import { ScreenOrientation } from '@awesome-cordova-plugins/screen-orientation/ngx';
import { getDatabase, ref, onDisconnect } from "firebase/database";
import { Platform } from '@ionic/angular';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  backButtonSubscription;
  @ViewChildren(IonRouterOutlet) routerOutlets: QueryList<IonRouterOutlet>;
  public lastTimeBackPress = Date.now();
  public timePeriodToExit = 2000;
  public curUser: any;
  public fire_db: any;

  constructor(private router: Router,
    public global: GlobalService,
    private api: ApiService,
    public toastController: ToastController,
    public navCtrl: NavController,
    public alertController: AlertController,
    private menu: MenuController,
    public translate: TranslateService,
    private screenOrientation: ScreenOrientation,
    public platform: Platform
  ) {
    this.backButtonEvent();
    this.global.getDefaultLanguage();
    this.getUserData();
    if (this.platform.is('android')) {
      this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
    }

    this.userOffline()
  }

  ionViewWillEnter() { }

  userOffline() {
    this.curUser = this.global.userdetails?.firebase_id?.fire_id;
    console.log('current user',this.curUser)
    // User logoff;
    this.fire_db = getDatabase();
    this.platform.pause.subscribe(async () => {
      console.log('platform pause')
      const presenceRef = ref(this.fire_db, "users/" + this.curUser + "/online");
      const onDisconnectRef = onDisconnect(presenceRef);
      onDisconnectRef.set(false);
    });
  }

  getUserData() {
    let localdata = localStorage.getItem('privateGroup_Udata_local');
    let uData = JSON.parse(localdata);
    if (uData) {
      this.global.userdetails = uData;
      this.global.user_role = uData?.user_permission?.roles?.role_name;
    }
  }

  backButtonEvent() {
    document.addEventListener('backbutton', () => {
      this.routerOutlets.forEach((outlet: IonRouterOutlet) => {
        if (outlet && outlet.canGoBack()) {
          outlet.pop();
        } else if (this.router.url === '/home') {
          if (Date.now() - this.lastTimeBackPress < this.timePeriodToExit) {
            navigator['app'].exitApp();
          } else {
            this.translate.get('others.press_back_btn').subscribe(
              value => {
                this.showToast(value);
              }
            )
            this.lastTimeBackPress = new Date().getTime();
          }
        }
      });
    });
  }

  async showToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000,
      // mode: 'ios'
    });
    toast.present();
  }

  openScreen(screen) {
    //console.log(screen)
    //this.router.navigate([screen]);
    if (screen == 'logout') {
      this.logout()
    } else {
      this.navCtrl.navigateRoot([screen]);
      this.menu.close()
    }

  }

  opencms(from) {
    this.navCtrl.navigateRoot([from]);
  }

  logout() {
    var logout_title = "";
    var logout_msg = "";

    var no = "";
    var yes = "";

    this.translate.get('others.logout').subscribe(
      (value: any) => {
        logout_title = value
      }
    )

    this.translate.get('others.Did_you_want_to_logout_from_app').subscribe(
      (value: any) => {
        logout_msg = value
      }
    )

    this.translate.get('others.no').subscribe(
      (value: any) => {
        no = value
      }
    )

    this.translate.get('others.yes').subscribe(
      (value: any) => {
        yes = value
      }
    )
    this.alertController.create({
      header: logout_title,
      message: logout_msg,
      backdropDismiss: false,
      buttons: [{
        text: no,
        role: 'cancel',
        handler: () => { }
      }, {
        text: yes,
        handler: () => {
          this.global.userdetails = "";
          localStorage.removeItem("token");
          localStorage.removeItem("privateGroup_Udata_local");
          this.navCtrl.navigateRoot(['./login']);
        }
      }]
    })
      .then(alert => {
        alert.present();
      });
  }
}
