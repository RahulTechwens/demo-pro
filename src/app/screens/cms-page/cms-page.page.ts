import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../api.service';
import { GlobalService } from '../../global.service';

@Component({
  selector: 'app-cms-page',
  templateUrl: './cms-page.page.html',
  styleUrls: ['./cms-page.page.scss'],
})
export class CmsPagePage implements OnInit {
  content:any ="";
  constructor(
    public global: GlobalService,
    private api: ApiService,
    private route: Router,) {
   }

   ionViewWillEnter() {
    this.getcmsdata();
  }

   getcmsdata(){
    this.global.loadingOpen();
    this.api.cmsContent('cms_pages',{language:localStorage.getItem('default_language'),content_type:"footer"}).then((res: any) => {
       
      if (res.status == 200) {
        this.global.loadingClose();
        let contentArr = res?.data;
        for(let i=0; i<contentArr.length; i++){
          if(contentArr[i].content_type == 'about-us'){
            this.content = contentArr[i]
          }
        }
      } else {
        this.global.loadingClose();
      }
    }).catch((err:any)=>{
      this.global.loadingClose();
    })
  }

  ngOnInit() {
  }

}
