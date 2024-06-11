import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController, ModalController, NavController } from '@ionic/angular';
import { ApiService } from '../../api.service';
import { GlobalService } from '../../global.service';

@Component({
  selector: 'app-search-group',
  templateUrl: './search-group.page.html',
  styleUrls: ['./search-group.page.scss'],
})
export class SearchGroupPage implements OnInit {
  search_grpArr: any = "";
  search_keyword: any = "";
  loading:boolean = false;
  constructor(public navCtrl: NavController,
    public global: GlobalService,
    public menuCtrl: MenuController,
    public modalController: ModalController,
    public api: ApiService,
    private route: Router,) { }

  ngOnInit() {
  }

  searchGroup() {
    if (this.search_keyword.length > 1) {
      //console.log(this.search_keyword)
     // this.global.loadingOpen()
     this.loading = true;
      this.api.searchGroup('search_group', { search_key: this.search_keyword, page: "", limit: "50" }).then((res: any) => {
        console.log(res)
        if (res.status == 200) {
         // this.global.loadingClose();
          //console.log(res?.data);
          this.loading = false;
          this.search_grpArr = res?.data;
        } else {
          this.loading = false;
          //this.global.loadingClose();
          //this.global.toast_msg(res?.message)
        }
      }).catch((err: any) => {
        this.loading = false;
        //this.global.toast_msg('Sorry! Something went wrong.')
      })
    }else if(this.search_keyword.length == 0){
      this.loading = true;
      setTimeout(() => {
        this.search_grpArr = [];
        this.loading = false;
      }, 300);
      
    }
  }

  grpdetails(item){
    let param = {data:item,from:'home'}
    this.route.navigate(['./group-details'], {state : param});
  }


}
