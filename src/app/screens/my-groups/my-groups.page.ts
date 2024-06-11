import { Component,OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { GlobalService } from '../../global.service';
import { ApiService } from 'src/app/api.service';
import { ActionSheetController, AlertController, MenuController, ModalController, NavController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { ViewImagePage } from '../view-image/view-image.page';
import { CommentModalPage } from '../comment-modal/comment-modal.page';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-my-groups',
  templateUrl: './my-groups.page.html',
  styleUrls: ['./my-groups.page.scss'],
})
export class MyGroupsPage implements OnInit {
  slideOptions = {
    slidesPerView: 3.3,
    freeMode: true,
    spaceBetween : 10
  };

  mygroupArr:any = ""
  suggested_grp:any = "";
  posts:any = "";
  skeliton_loader:boolean = true;
  constructor(
    public api: ApiService,
    public navCtrl: NavController,
    public global: GlobalService,
    public menuCtrl: MenuController,
    public modalController: ModalController,
    private route: Router,
    public actionSheetController: ActionSheetController,
    public alertController: AlertController,
    public translate: TranslateService
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.getMyGroup(null);
  }

  doRefresh(event){
    this.getMyGroup(event);
  }

  getMyGroup(event) {
    event == null ?this.global.loadingOpen():null;
    
    this.api.getGrpList('get_user_group_info').then((res: any) => {
      console.log(res)
      if (res.status == 200) {
        event != null ?event.target.complete():this.global.loadingClose();
        //console.log(res?.my_group);
        this.mygroupArr = res?.my_group;
        this.suggested_grp = res?.suggested_group;
        this.getAllPost(event)
      } else {
        this.skeliton_loader = false
        this.getAllPost(event)
        //this.global.toast_msg(res?.message)
      }
    }).catch((err: any) => {
      event != null ?event.target.complete():this.global.loadingClose();
      this.skeliton_loader = false
      this.global.getTranslateLabel('others.server_error');
    })
  }

  getAllPost(event) {
   this.skeliton_loader = true
    this.api.getMyPost('my_posts').then((res: any) => {
      //console.log(res)
      if (res.status == '200') {
      event != null ?event.target.complete():this.global.loadingClose();
       //console.log(res);
        this.posts = res?.data
        setTimeout(() => {
          this.skeliton_loader = false
        }, 1000)

      } else if (res.status == '201') {
        event != null ?event.target.complete():this.global.loadingClose();;
        //console.log(res);
        setTimeout(() => {
          this.skeliton_loader = false
        }, 1000)
      } else {
        event != null ?event.target.complete():this.global.loadingClose();;
        
        this.global.toast_msg(res?.message);
        setTimeout(() => {
          this.skeliton_loader = false
        }, 1000)
      }
    }).catch((err: any) => {
      event != null ?event.target.complete():this.global.loadingClose();
      this.global.getTranslateLabel('others.server_error');
    })
  }


  async deletePostActionSheet(item) {
    let msg = "";
    let cancel_label = "";
    let delete_post = "";

    this.translate.get('others.pick_an_action').subscribe(value => { msg = value;})

    this.translate.get('others.cancel_btn').subscribe(value => {cancel_label = value;})

    this.translate.get('others.delete_post_btn').subscribe(value => {delete_post = value;})

    const actionSheet = await this.actionSheetController.create({
      header: msg,
      cssClass: 'my-custom-class',
      buttons: [{
        text: delete_post,
        icon: 'trash',
        handler: () => {
          this.deleteConfrimation(item)
        }
      },{
        text: cancel_label,
        icon: 'close',
        role: 'cancel',
        handler: () => {
          //console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();
  }

  deleteConfrimation(item){
    let header = ""
    let msg = "";
    let no = "";
    let yes = "";

    this.translate.get('others.header_alert').subscribe(value => { header = value;})
    this.translate.get('others.delete_post_msg').subscribe(value => { msg = value;})
    this.translate.get('others.no').subscribe(value => {no = value;})
    this.translate.get('others.yes').subscribe(value => {yes = value;})

    this.alertController.create({
      header: header,
      message: msg,
      backdropDismiss: false,
      buttons: [{
        text: no,
        role: 'cancel',
        handler: () => { }
      }, {
        text: yes,
        handler: () => {
          this.deletePost(item?.id)
        }
      }]
    })
      .then(alert => {
        alert.present();
      });
  }

  deletePost(post_id){
    //console.log(post_id)
    this.global.loadingOpen()
    this.api.deletePost({ "post_id": post_id}).then((res: any) => {
      //console.log(res)
      if(res.status == 200){
       this.global.loadingClose();
       this.global?.toast_msg(res?.message);
       this.getAllPost(null);
      }else{
        this.global.loadingClose();
        this.global?.toast_msg(res?.message)
      }
    }).catch((err:any)=>{
      this.global.loadingClose();
      this.global.getTranslateLabel('others.server_error');
    })
  }

  grpdetails(item){
    let param = {data:item,from:'my-group'}
    this.route.navigate(['./group-post'], {state : param});
  }

  searchGrp(){
    this.route.navigate(['./search-group']);
  }

  async viewImage(item) {
    //console.log(item)
    const modal = await this.modalController.create({
      component: ViewImagePage,
      componentProps: {
        paramData: item
      },
      cssClass: 'create-post',
    });

    await modal.present();

    const data = await modal.onDidDismiss().then((res) => {
      if (res?.data?.refesh) {
        this.getAllPost(null);
      }
    });
  }

  async commentModal(item) {
    const modal = await this.modalController.create({
      component: CommentModalPage,
      cssClass: 'drawer-modal comments',
      componentProps: {
        paramData: item
      }
    });
    await modal.present();
    const data = await modal.onDidDismiss().then((res) => {
      if (res?.data?.refesh) {
        this.skeliton_loader = true
        this.getAllPost(null)
      }
    });
  }

  likePost(item, val) {
    this.global.loadingOpen()
    this.api.likeUnlike('post/like', { "post_id": item?.id, "is_like": val }).then((res: any) => {
      //console.log(res)
      if (res.status == 200) {
       // this.global?.toast_msg(res?.message);
        // this.getAllPost(this.grpDetails?.data?.group_slug)
        this.api.getMyPost('my_posts').then((res: any) => {
          //console.log(res)
          if (res.status == '200') {
            this.global.loadingClose();
            //console.log(res);
            this.posts = res?.data
            setTimeout(() => {
              this.skeliton_loader = false
            }, 1000)

          } else if (res.status == '201') {
            this.global.loadingClose();
            //console.log(res);
            setTimeout(() => {
              this.skeliton_loader = false
            }, 1000)
          } else {
            this.global.loadingClose();
            this.global.toast_msg(res?.message);
            setTimeout(() => {
              this.skeliton_loader = false
            }, 1000)
          }
        }).catch((err: any) => {
          this.global.loadingClose()
          this.global.getTranslateLabel('others.server_error');
        })

      } else {
        this.global.loadingClose();
        this.global?.toast_msg(res?.message)
      }
    }).catch((err: any) => {
      this.global.loadingClose();
      this.global.getTranslateLabel('others.server_error');
    })
  }
}
