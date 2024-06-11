import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController, ModalController, NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { ApiService } from 'src/app/api.service';
import { GlobalService } from 'src/app/global.service';
import { CommentModalPage } from '../comment-modal/comment-modal.page';
import { DatePickerPage } from '../date-picker/date-picker.page';

@Component({
  selector: 'app-advisor-details',
  templateUrl: './advisor-details.page.html',
  styleUrls: ['./advisor-details.page.scss'],
})
export class AdvisorDetailsPage implements OnInit {
  slideOptions = {
    slidesPerView: 3.3,
    freeMode: true,
    spaceBetween: 10,
  };

  advisorDetails:any = ""
  constructor(
    private modalController: ModalController,
    public global: GlobalService,
    public menuCtrl: MenuController,
    public api: ApiService,
    private route: Router,
    public navCtrl: NavController,
    public translate: TranslateService
    ) {
     this.getAdvisorDetails();
    }

  ngOnInit() {}

  back(){
    this.navCtrl.pop()
  }

  getAdvisorDetails(){
    this.global.loadingOpen()
    this.api.getAdvisorDetails('consult_with').then((res: any) => {
      //console.log(res)
      if (res.status == 200) {
        this.global.loadingClose();
        //console.log(res);
        this.advisorDetails = res?.data
      } else {
        this.global.loadingClose();
      }
    }).catch(()=>{
      this.global.loadingClose()
      this.translate.get('others.server_error').subscribe(
        value => {
          this.global.toast_msg(value);
        }
      )
    })
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: DatePickerPage,
      cssClass: 'booking-date-modal',
      backdropDismiss: false,
    });

    await modal.present();

    const data = await modal.onDidDismiss();
    
  }

  async commentModal() {
    const modal = await this.modalController.create({
      component: CommentModalPage,
      cssClass: 'drawer-modal comments',
      backdropDismiss: false,
    });

    await modal.present();

    const data = await modal.onDidDismiss();
   
  }

  searchGrp() {
    this.route.navigate(['./search-group']);
  }
}
