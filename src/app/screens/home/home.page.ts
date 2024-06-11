import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { GlobalService } from '../../global.service';
import { ApiService } from 'src/app/api.service';
import { MenuController, ModalController, NavController, Platform } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { getDatabase, ref, onValue, update} from "firebase/database";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  suggested_grp: any;
  homeContent: any = "";
  requested_grp: any;
  consultantData: any;
  fire_db: any;
  curUser:any;
  constructor(
    public navCtrl: NavController,
    public global: GlobalService,
    public menuCtrl: MenuController,
    public modalController: ModalController,
    public api: ApiService,
    private route: Router,
    public platform: Platform
  ) {

    this.curUser = this.global.userdetails?.firebase_id?.fire_id;
 
    //Set user as online
    this.fire_db = getDatabase();
    update(ref(this.fire_db,"users/"+this.curUser+"/"), {
      online: true
    }).then(()=>{
      console.log('current user', this.curUser);
    })
  }

  ionViewWillEnter() {
    this.getSuggestedGroup(null);
    this.getcmsdata();
  }

  ionViewWillLeave() {}


  getcmsdata() {
    this.api.cmsContent('cms_pages', { language: localStorage.getItem('default_language'), content_type: "home" }).then((res: any) => {
      //console.log(res)
      if (res.status == 200) {
        this.homeContent = res?.data[0];
      } else {
        this.global.loadingClose();
      }
    }).catch((err: any) => {
     
    })
  }

  doRefresh(event) {
    this.getSuggestedGroup(event);
  }

  getSuggestedGroup(event) {
    event == null ? this.global.loadingOpen() : null;
    this.api.getGrpList('get_user_group_info').then((res: any) => {
      // //console.log(res)
      if (res.status == 200) {
        console.log(res);
        this.suggested_grp = res?.suggested_group;
        this.requested_grp = res?.join_requests;
        this.consultantData = res?.consult_with;
        event != null ? event.target.complete() : this.global.loadingClose();
      } else if (res.status == 401) {
        event != null ? event.target.complete() : this.global.loadingClose();
        this.global.toast_msg('Sorry! Login expired. Please log in again.')
        this.global.tokenloss_logout();
      } else {
        event != null ? event.target.complete() : this.global.loadingClose();
        this.global.toast_msg(res?.message)
      }
    }).catch((err: any) => {
      this.global.toast_msg('Sorry! Something went wrong.');
      event != null ? event.target.complete() : this.global.loadingClose();
    })
  }

  grpdetails(item, type) {
    if (type == 'suggested_grp') {
      let param = { data: item, from: 'home' }
      this.route.navigate(['./group-details'], { state: param });
    } else if (type == 'requested_grp') {
      let data = item;
      data.group_slug = data?.group?.group_slug;
      let param = { data: item, from: 'my-group' }
      this.route.navigate(['./group-details'], { state: param });
    }
  }

  searchGrp() {
    this.route.navigate(['./search-group']);
  }

  gotoAdvisorPage() {
    this.route.navigate(['./advisor-details']);
  }



}
