import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { ApiService } from '../../api.service';
import { GlobalService } from '../../global.service';

@Component({
  selector: 'app-my-calender',
  templateUrl: './my-calender.page.html',
  styleUrls: ['./my-calender.page.scss'],
})
export class MyCalenderPage implements OnInit {
  public start_time: any = {
    "sunday": "",
    "monday": "",
    "tuesday": "",
    "wednesday": "",
    "thursday": "",
    "friday": "",
    "saturday": ""
  };

  public end_time: any = {
    "sunday": "",
    "monday": "",
    "tuesday": "",
    "wednesday": "",
    "thursday": "",
    "friday": "",
    "saturday": ""
  }
  constructor(
    public global: GlobalService,
    private api: ApiService,
  ) {
    this.fetchTimeSlot()
  }

  ngOnInit() {
  }

  getTime(value, date_type, date_name) {
    //console.log(value)
    if (date_type == 'start') {
      this.start_time[date_name] = value;
      //console.log(this.start_time)
    } else {
      this.end_time[date_name] = value;
      //console.log(this.end_time)
    }
  }

  fetchTimeSlot() {
    this.global.loadingOpen()
    this.api.getSlots().then((res: any) => {
      //console.log(res);
      if (res.status == 200) {
        this.global.loadingClose()
        //this.global.toast_msg(res.message);
        this.start_time = res.data?.start_time;
        this.end_time = res.data?.end_time;
      } else {
        this.global.loadingClose()
        this.global.toast_msg(res.message)
      }
    })
  }

  updatetimeSlot() {
    let timeSlot = {
      start_time: this.start_time,
      end_time: this.end_time
    }
    this.global.loadingOpen()
    this.api.updateTimeSlot(timeSlot).then((res: any) => {
      //console.log(res);
      if (res.status == 200) {
        this.global.loadingClose()
        this.global.toast_msg(res.message);
        this.start_time = res.data?.start_time;
        this.end_time = res.data?.end_time;
      } else {
        
        this.global.loadingClose()
        this.global.toast_msg(res.message)
      }
    })


  }

}
