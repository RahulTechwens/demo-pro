import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/api.service';
import { GlobalService } from 'src/app/global.service';

@Component({
  selector: 'app-members-list',
  templateUrl: './members-list.page.html',
  styleUrls: ['./members-list.page.scss'],
})
export class MembersListPage implements OnInit {
  isMember: boolean = false;
  grpDetails: any;
  constructor(private route: Router, public global: GlobalService,
    public api: ApiService,) {
    if (route.getCurrentNavigation().extras.state) {
      this.grpDetails = route.getCurrentNavigation().extras.state?.data;
      console.log(this.grpDetails)
    }
  }

  ngOnInit() { }

  details() {
    //this.route.navigate(['advisor-details']);
  }

  joinRequest() {
    if (this.grpDetails.is_active_join_req == true) {
      this.global.toast_msg(this.grpDetails.message)
    } else {
      this.global.loadingOpen();
      this.api.grpJoinRequest('user/send_group_join_request', { user_id: this.global?.userdetails?.id, group_id: this.grpDetails?.data?.id }).then((res: any) => {
        if (res.status == 200) {
          //console.log(res);
          this.grpDetails = res;
          this.global.loadingClose()
          this.global.toast_msg(res?.message)
        } else {
          this.global.loadingClose();
          this.global.toast_msg(res?.message);
        }
      }).catch(()=>{
        this.global.loadingClose();
      })
    }
  }

  gotoChat(member) {
    //console.log(member)
    let param = { data: member }
    this.route.navigate(['./chat-page'], { state: param });

  }

  gotoAdvisorPage() {
    this.route.navigate(['./advisor-details']);
  }
}
