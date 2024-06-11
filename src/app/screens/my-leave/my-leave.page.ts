import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/api.service';
import { GlobalService } from 'src/app/global.service';
import * as moment from 'moment'
import { AlertController, ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-my-leave',
  templateUrl: './my-leave.page.html',
  styleUrls: ['./my-leave.page.scss'],
})
export class MyLeavePage implements OnInit {
  slot: any = ""
  leaveSlotArr: any;
  maxDate: any;
  minDate: any;
  loading: boolean = true;
  constructor(public global: GlobalService, public translate: TranslateService,
    private api: ApiService, public alertController: AlertController,private modalController: ModalController,) {
    this.fetchTimeSlot();
    this.maxDate = this.global.tomorrow();
  }

  ngOnInit() {

  }

  fetchTimeSlot() {
    this.api.getleaves().then((res: any) => {
      //console.log(res);
      if (res.status == 200) {
        //this.global.toast_msg(res.message);
        this.leaveSlotArr = res.data;
        this.loading = false;
      } else {
        //this.global.loadingClose()
        this.global.toast_msg(res.message);
        this.loading = false;
      }
    })
  }

  getDate(value) {
    return this.slot = value;
  }

  selectDate(value) {
    //console.log(value);
    //this.slot = moment(value).format('YYYY-MM-DD');
    //this.addLeave(this.slot)
    //return this.slot
    let val = moment(value).format('MM-DD-YYYY');
    let oldDate = new Date(val)
    console.log(val, oldDate)
    
    let diff = new Date().getTime() - oldDate.getTime();
    console.log(diff)
    if (diff > 0) {
      console.log('Given Date is in Past');
    }else{
      console.log('Given Date is in future');
      this.slot = moment(value).format('YYYY-MM-DD');
      this.modalController.dismiss()
      this.addLeave(this.slot)
    }
  }

  addLeave(date) {
    let requestedDate = { leave_date: date };
    let data_insert_permission = false;
    for (let i = 0; i < this.leaveSlotArr.length; i++) {
      if (requestedDate?.leave_date == this.leaveSlotArr[i].leave_dates) {
        data_insert_permission = false;
        break;
      } else {
        data_insert_permission = true;
      }
    }

    if (data_insert_permission == true) {
      this.global.loadingOpen()
      this.api.setLeavedate(requestedDate).then((res: any) => {
        //console.log(res);
        if (res.status == 200) {
          this.global.loadingClose()
          this.global.toast_msg(res.message);
          this.fetchTimeSlot()
        } else {
          this.global.loadingClose()
          this.global.toast_msg(res.message)
        }
      })
    } else {
      this.global.getTranslateLabel('others.data_already_exist');
    }
  }

  removeDate(date) {
    this.askToremove(date)
  }

  askToremove(date) {
    let header = ""
    let msg = "";
    let no = "";
    let yes = "";

    this.translate.get('others.header_alert').subscribe(value => { header = value; })
    this.translate.get('others.leave_date_msg').subscribe(value => { msg = value; })
    this.translate.get('others.no').subscribe(value => { no = value; })
    this.translate.get('others.yes').subscribe(value => { yes = value; })

    this.alertController.create({
      header: header,
      message: msg,
      backdropDismiss: false,
      buttons: [{
        text: no,
        role: 'cancel',
        handler: () => { }
      }, {
        text: yes,
        handler: () => {
          let requestedDate = { leave_date: date };
          this.global.loadingOpen()
          this.api.setLeavedate(requestedDate).then((res: any) => {
            //console.log(res);
            if (res.status == 200) {
              this.global.loadingClose()
              this.global.getTranslateLabel('others.data_removed_msg');
              this.fetchTimeSlot()
            } else {
              this.global.loadingClose()
              this.global.toast_msg(res.message)
            }
          })
        }
      }]
    })
      .then(alert => {
        alert.present();
      });

  }

}



// /advisor/add_remove_leaves