import { Component, ElementRef, OnInit } from '@angular/core';
import { AlertController, ModalController, NavController } from '@ionic/angular';
import { ApiService } from 'src/app/api.service';
import { GlobalService } from 'src/app/global.service';

import { getDate, getMonth, getYear, isThisQuarter } from 'date-fns';
import { id } from 'date-fns/locale';
import { format, parseISO, isMonday } from 'date-fns';
import {ViewChild } from '@angular/core';
import { IonContent} from '@ionic/angular';
import * as moment from 'moment';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.page.html',
  styleUrls: ['./date-picker.page.scss'],
})
export class DatePickerPage implements OnInit {
  maxDate: any;
  minDate: any;
  allTimeSlots: any = [];
  availableSlots: any;
  selectedDay: any;
  disabledDates: any;
  selectedSlot: any = "";
  selectedDate: any = "";
  leavedates: any;
  msg:any = ""
  @ViewChild(IonContent, { static: false }) content: IonContent;
  constructor(
    public modalController: ModalController,
    public global: GlobalService,
    public api: ApiService,
    public _element: ElementRef,
    public navCtrl: NavController,
    public alertController: AlertController,
    public translate: TranslateService
  ) {
    this.maxDate = this.global.max_date();
    this.minDate = this.global.tomorrow_date();
    this.getAllSlots();
    


  }

  ngOnInit() {
    const datetime = this._element.nativeElement.querySelector('ion-datetime');
    datetime.isDateDisabled = true
    ////console.log(datetime.isDateEnabled);
  }

  isDateEnabled = (dateIsoString: string) => {
    const date = new Date(dateIsoString);
    if (getDate(date) === 1 && getMonth(date) === 0 && getYear(date) === 2022) {
      ////console.log(false)
      return false;
    }
    return true;
  };

  getAllSlots() {
    this.global.loadingOpen()
    this.api.getGrpDeatils('advisor/all_slots').then((res: any) => {
      if (res.status == 200) {
        this.global.loadingClose();
        let responsone = res?.data;
        //////console.log(responsone)
        for (let k in responsone) {
          //////console.log(responsone[k]);
          for (let key in responsone[k]) {
            responsone[k][key] = {
              id: key,
              slot: responsone[k][key],
              selected: false
            }
          }
        }
        this.allTimeSlots = responsone;
        this.getHoliday();
        //console.log('all slots', this.allTimeSlots)

      } else if (res?.status == 401) {
        this.global.loadingClose();
        this.global.tokenloss_logout()
      } else {
        this.global.loadingClose();
        //this.global.toast_msg(res?.message)
      }
    }).catch((err: any) => {
      this.global.getTranslateLabel('others.server_error');
    })
  }

  getHoliday() {
    this.api.getGrpDeatils('advisor/leave_list').then((res: any) => {
      //console.log(res)
      if (res.status == 200) {
        //console.log(res);
        let holiday = res?.data;
        this.leavedates = [];
        holiday.forEach(key => {
          this.leavedates.push(key.leave_dates)
        });

        let currDate = new Date();
        let date = moment(currDate).format('YYYY-MM-DD');
        let weekDayName = moment(currDate).format('dddd');
        this.selectedDate = date;
        //console.log('selected date ', this.selectedDate);
        this.availableSlots = [];
        this.viewAllSlot(date, weekDayName);
      } 
      else {
        ////console.log(res?.message)
      }
    }).catch((err: any) => {
      this.global.getTranslateLabel('others.server_error');
    })
  }

  fetchSlots(value) {
    this.selectedSlot = ""
    var weekDayName = moment(value).format('dddd');
    let date = moment(value).format('YYYY-MM-DD');
    this.selectedDate = date;
    this.viewAllSlot(date, weekDayName)

  }

  viewAllSlot(date, weekDayName) {
    //console.log('fff',this.leavedates)
    var flag = false;
    for (let i = 0; i < this.leavedates.length; i++) {
      if (this.leavedates[i] == date) {
        flag = true;
        break
      }
    }

    if (flag == true) {
      this.global.getTranslateLabel('others.advisor_not_available');
      this.availableSlots = [];  
      this.translate.get('others.advisor_on_leave').subscribe(
        value => {
          this.msg = value;
        }
      )

    } else {
      //console.log("Sorry! Slot not available");
      this.selectedDay = weekDayName.toLowerCase();
      //////console.log(this.selectedDay)
      this.availableSlots = this.allTimeSlots[this.selectedDay];
      //console.log(this.availableSlots)
      this.translate.get('others.advisor_on_leave').subscribe(
        value => {
          this.msg = value;
        }
      )
    }
  }

  selectSlot(index) {
    //////console.log(this.allTimeSlots[this.selectedDay][index])
    this.allTimeSlots[this.selectedDay][index].selected = true;
    this.selectedSlot = this.allTimeSlots[this.selectedDay][index].slot
    for (let i = 0; i < this.allTimeSlots[this.selectedDay].length; i++) {
      if (i != index) {
        this.allTimeSlots[this.selectedDay][i].selected = false;
      }
    }
    this.content.scrollToBottom(2000);
  }

  bookNow() {

    var title = "";
    var msg = "";

    var no ="";
    var yes ="";

   this.translate.get('others.header_alert').subscribe(
      (value:any) => {
        title = value
      }
    )

    this.translate.get('others.book_slot_confrimation').subscribe(
      (value:any) => {
        msg = value
      }
    )
   
    this.translate.get('others.no').subscribe(
      (value:any) => {
        no = value
      }
    )

    this.translate.get('others.yes').subscribe(
      (value:any) => {
        yes = value
      }
    )

    let param = {
      "date": this.selectedDate,
      "member_id": this.global.userdetails?.id,
      "slot": this.selectedSlot
    }
    if (this.selectedDate != "" && this.selectedSlot != "") {

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
            this.bookSlot(param)
          }
        }]
      })
        .then(alert => {
          alert.present();
        });
    }

  }

  bookSlot(param){
    this.global.loadingOpen()
    this.api.appointmentBook(param).then((res: any) => {
      //console.log(res);
      if (res.status == 200) {
        this.global.loadingClose()
        ////console.log(res)
        this.global.toast_msg(res?.message);
      } else if (res?.status == 401) {
        this.global.loadingClose();
        this.modalController.dismiss()
        this.global.tokenloss_logout();
        this.global.getTranslateLabel('others.login_exp_msg');
      } else {
        this.global.loadingClose()
        this.global.toast_msg(res?.message)
      }
    }).catch(()=>{
      this.global.loadingClose();
      this.global.getTranslateLabel('others.server_error');
    })
  }


  close() {
    this.modalController.dismiss();
  }
}
