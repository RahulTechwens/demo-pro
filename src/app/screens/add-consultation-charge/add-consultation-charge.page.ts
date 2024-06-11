import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ApiService } from 'src/app/api.service';
import { GlobalService } from 'src/app/global.service';

@Component({
  selector: 'app-add-consultation-charge',
  templateUrl: './add-consultation-charge.page.html',
  styleUrls: ['./add-consultation-charge.page.scss'],
})
export class AddConsultationChargePage implements OnInit {
  consultationRate:any = ""
  constructor(
    public global: GlobalService,
    private api: ApiService,
    public translate: TranslateService
  ) { 
    this.getConsultationrate()
  }
  

  ngOnInit() {
  }

  getConsultationrate(){
    this.global.loadingOpen();
    this.api.getBookingHistory("advisor/get/consultation_charge").then((res: any) => {
       
      if (res.status == 200) {
        this.global.loadingClose();
         
        this.consultationRate = res?.data?.consultation_charge
      } else {
        this.global.loadingClose();
      }
    }).catch((err: any) => {
      this.global.loadingClose();
      this.translate.get('others.server_error').subscribe(
        value => {
          this.global.toast_msg(value);
        }
      )
    })
  }

  updateRate(){
    if(!this.consultationRate.trim()){
      this.translate.get('others.rate_cant_be_blank').subscribe(
        value => {
          this.global.toast_msg(value);
        }
      )
    }else{
      this.global.loadingOpen()
      this.api.updateConsultationRate('advisor/add/consultation_charge', {"consultation_charge":this.consultationRate}).then((res: any) => {
         
        if (res.status == 200) {
          this.global.loadingClose()
           
          this.global.toast_msg(res?.message)
        } else {
          this.global.loadingClose()
          this.global.toast_msg(res?.message)
        }
      }).catch((err: any) => {
        this.global.loadingClose();
        this.translate.get('others.server_error').subscribe(
          value => {
            this.global.toast_msg(value);
          }
        )
      })
    }
  }

}
