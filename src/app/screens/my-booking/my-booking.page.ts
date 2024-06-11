import {
  Component,
  OnInit
} from '@angular/core';
import { AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { ApiService } from 'src/app/api.service';
import { GlobalService } from 'src/app/global.service';
import { Clipboard } from '@awesome-cordova-plugins/clipboard/ngx';
@Component({
  selector: 'app-my-booking',
  templateUrl: './my-booking.page.html',
  styleUrls: ['./my-booking.page.scss'],
})
export class MyBookingPage implements OnInit {
  bookingHistory:any;
  skeliton_loader:Boolean = true;
  constructor(
    public global: GlobalService,
    private api: ApiService,
    public translate: TranslateService,
    public alertController: AlertController,
    private clipboard: Clipboard
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.loadBookingHistory(null)
  }

  loadBookingHistory(event) {
    this.api.getBookingHistory(this.global.user_role == 'Advisory'? 'advisor/booking_list' : 'my_bookings').then((res: any) => {
      console.log(res)
      if (res.status == 200) {
        //this.global.loadingClose();
        this.bookingHistory = res?.data;
        console.log(res);
        if (event != null) { event.target.complete(); }
        this.skeliton_loader = false;
      } else {
        //this.global.loadingClose();
        this.bookingHistory = "";
        if (event != null) { event.target.complete(); }
        this.skeliton_loader = false;
      }
    }).catch((err: any) => {
      //this.global.loadingClose();
      this.global.getTranslateLabel('others.server_error');
      if (event != null) { event.target.complete(); }
      this.skeliton_loader = false;
    })
  }

  doRefresh(event){
    this.loadBookingHistory(event)
  }

  convertDecimalPoint(amount){
    return parseFloat(amount).toFixed(2)
  }

  copyTransactionId(id) {
    this.clipboard.copy(id).then((res) => {
      this.global.getTranslateLabel('others.sequrity_copied');
    });
  }


  startVideoCall(data){
    var title = "";
    var msg = "";

    var no = "";
    var yes = "";

    this.translate.get('others.header_alert').subscribe(
      (value: any) => {
        title = value
      }
    )

    this.translate.get('others.videocall_start_msg').subscribe(
      (value: any) => {
        msg = value
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
      header: title,
      message: msg,
      backdropDismiss: false,
      buttons: [{
        text: no,
        role: 'cancel',
        handler: () => { }
      }, {
        text: yes,
        handler: () => {
          window.open(data.link);
        }
      }]
    })
      .then(alert => {
        alert.present();
      });
  }
  

}
