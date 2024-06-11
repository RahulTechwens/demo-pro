import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/api.service';
import { GlobalService } from 'src/app/global.service';

@Component({
  selector: 'app-terms-and-conditions',
  templateUrl: './terms-and-conditions.page.html',
  styleUrls: ['./terms-and-conditions.page.scss'],
})
export class TermsAndConditionsPage implements OnInit {

  content: any = "";
  constructor(
    public global: GlobalService,
    private api: ApiService,
    private route: Router,) {
  }

  ionViewWillEnter() {
    this.getcmsdata();
  }

  getcmsdata() {
    this.global.loadingOpen();
    this.api.cmsContent('cms_pages', { language: localStorage.getItem('default_language'), content_type: "footer" }).then((res: any) => {
      //console.log(res)
      if (res.status == 200) {
        this.global.loadingClose();
        let contentArr = res?.data;
        for (let i = 0; i < contentArr.length; i++) {
          if (contentArr[i].content_type == 'terms-and-conditions') {
            this.content = contentArr[i]
          }
        }
        //this.Content = res?.data[0];
        //console.log(res);
      } else {
        this.global.loadingClose();
      }
    }).catch(() => {
      this.global.loadingClose()
      this.global.getTranslateLabel('others.server_error');
    })
  }

  ngOnInit() {
  }

}
