import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController, NavParams } from '@ionic/angular';
import { ApiService } from 'src/app/api.service';
import { GlobalService } from 'src/app/global.service';

@Component({
  selector: 'app-group-details',
  templateUrl: './group-details.page.html',
  styleUrls: ['./group-details.page.scss'],
})
export class GroupDetailsPage implements OnInit {
  showBackButton: boolean = true;
  grpDetails:any="";
  activeSegment:any = 'about';
  request_sent:boolean = false;
  paramData:any;
  constructor(
    private nav: NavController,
    private params: NavParams,
    private route: Router,
    public global: GlobalService,
    public api: ApiService,
    ) {
    console.log(route.getCurrentNavigation().extras.state);
    this.paramData = route.getCurrentNavigation().extras.state?.data;
  //  if(route.getCurrentNavigation().extras.state){
  //    let page = route.getCurrentNavigation().extras.state?.from;
  //    if(page == 'my-group'){
  //     let data = route.getCurrentNavigation().extras.state?.data;
  //     this.getGrpDeatils(data?.group?.group_slug)
  //    }else{
  //     let data = route.getCurrentNavigation().extras.state?.data;
  //     this.getGrpDeatils(data?.group_slug)
  //    }
  //  }
  }
 
  ionViewWillEnter() {
    let data = this.paramData;
    console.log(data)
    this.getGrpDeatils(data?.group_slug)
  }

  getGrpDeatils(slug){
    console.log(slug)
    this.global.loadingOpen()
    this.api.getGrpDeatils('group_info/'+slug ).then((res: any) => {
      console.log(res)
      if (res.status == '200') {
        this.global.loadingClose();
        console.log(res);
        this.grpDetails = res;
      }else if (res.status == '201') {
        this.global.loadingClose();
        console.log(res);
        this.grpDetails = res
      } else {
        this.global.loadingClose();
        this.global.toast_msg(res?.message)
      }
    }).catch(()=>{
      this.global.loadingClose()
      this.global.getTranslateLabel('others.server_error');
    })
  }



  ngOnInit() {}

  goback() {
    this.nav.pop();
  }

  onScroll(ev) {
    const offset = ev.detail.scrollTop;
    this.showBackButton = offset < 140;
  }

  segmentChanged(ev: any) {
    console.log('Segment changed', this.activeSegment);
  }

  joinRequest(){
    if(this.grpDetails.is_active_join_req == true){
      this.global.toast_msg(this.grpDetails.message)
    }else{
      this.global.loadingOpen();
      this.api.grpJoinRequest('user/send_group_join_request',{user_id:this.global?.userdetails?.id,group_id:this.grpDetails?.data?.id}).then((res: any) => {
        if(res.status == 200){
          console.log(res);
          this.grpDetails = res;
          this.global.loadingClose()
          this.global.toast_msg(res?.message)
        }else{
          this.global.loadingClose();
          this.global.toast_msg(res?.message)
        }
      }).catch(()=>{
        this.global.loadingClose()
        this.global.getTranslateLabel('others.server_error');
      })
    }
    
  }

  gotoMembersPage(){
    let param = {data:this.grpDetails}
    this.route.navigate(['./members-list'], {state : param});
  }

  showDp(member){
    let value = "";
    value = member?.user?.profile_picture?.path;
    console.log(value)
    return this.global?.image_path + value
    // return 'https://source.unsplash.com/user/c_v_r/1900x800'
  }
}
