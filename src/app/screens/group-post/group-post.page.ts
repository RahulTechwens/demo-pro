import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActionSheetController, AlertController, ModalController, NavController } from '@ionic/angular';
import { ApiService } from 'src/app/api.service';

import { GlobalService } from 'src/app/global.service';
import { ViewImagePage } from '../view-image/view-image.page';
import { CommentModalPage } from '../comment-modal/comment-modal.page';
import { CreatePostPage } from '../create-post/create-post.page';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-group-post',
  templateUrl: './group-post.page.html',
  styleUrls: ['./group-post.page.scss'],
})
export class GroupPostPage implements OnInit {
  grpDetails: any;
  posts: any = "";
  skeliton_loader: boolean = true;
  grpDetails_slug: any = "";
  membersArr: any = [
    {
      user: {
        profile_picture: {
          path: ""
        }
      }
    }
  ]
  constructor(private nav: NavController,
    private modalController: ModalController,
    private route: Router,
    public global: GlobalService,
    public api: ApiService,
    public alertController: AlertController,
    public actionSheetController: ActionSheetController,
    public navCtrl: NavController,
    public translate: TranslateService
  ) {
    //console.log(route.getCurrentNavigation().extras.state);
    if (route.getCurrentNavigation().extras.state) {
      let page = route.getCurrentNavigation().extras.state?.from;
      if (page == 'my-group') {
        let data = route.getCurrentNavigation().extras.state?.data;
        //console.log(data)
        this.grpDetails_slug = data?.group?.group_slug;
        this.getGrpDeatils(data?.group?.group_slug, null);
      } else {
        let data = route.getCurrentNavigation().extras.state?.data;
        this.grpDetails_slug = data?.group_slug;
        this.getGrpDeatils(data?.group_slug, null);
      }

    }
  }

  showDp(member) {
    let value = "";
    value = member?.user?.profile_picture?.path;
    //console.log(value)
    return this.global?.image_path + value
    // return 'https://source.unsplash.com/user/c_v_r/1900x800'
  }
  getGrpDeatils(slug, event) {
    this.api.getGrpDeatils('group_info/' + slug).then((res: any) => {
      if (res.status == '200') {
        this.grpDetails = res;
        this.membersArr = res?.data?.members;   
        this.getAllPost(this.grpDetails?.data?.group_slug)
        if (event != null) { event.target.complete(); }
      } else if (res.status == '201') {
        this.grpDetails = res;
        this.membersArr = [];
        if (event != null) { event.target.complete(); }
      } else {
        this.global.toast_msg(res?.message);
        if (event != null) { event.target.complete(); }
      }
    }).catch((err: any) => {
      this.global.getTranslateLabel('others.server_error');
      if (event != null) { event.target.complete(); }
    })
  }



  getAllPost(slug) {
    this.skeliton_loader = true
    this.api.getGroupPosts('all_posts', { group_slug: slug }).then((res: any) => {
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
      this.global.loadingClose();
      this.global.getTranslateLabel('others.server_error');
    })
  }

  doRefresh(event) {
    this.getGrpDeatils(this.grpDetails_slug, event)
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
      }, {
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

  viewMembers() {
    let param = { data: this.grpDetails }
    this.route.navigate(['./members-list'], { state: param });
  }


  deleteConfrimation(item) {
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

  deletePost(post_id) {
    //console.log(post_id)
    this.global.loadingOpen()
    this.api.deletePost({ "post_id": post_id }).then((res: any) => {
      //console.log(res)
      if (res.status == 200) {
        this.global.loadingClose();
        this.global?.toast_msg(res?.message);
        this.getAllPost(this.grpDetails?.data?.group_slug)
      } else {
        this.global.loadingClose();
        this.global?.toast_msg(res?.message)
      }
    }).catch(() => {
      this.global.loadingClose()
      this.global.getTranslateLabel('others.server_error');
    })
  }

  ngOnInit() { }

  goback() {
    this.nav.pop();
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
        this.getAllPost(this.grpDetails?.data?.group_slug)
      }
    });
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
        this.getAllPost(this.grpDetails?.data?.group_slug)
      }
    });
  }

  async createPost() {
    const modal = await this.modalController.create({
      component: CreatePostPage,
      componentProps: {
        paramData: this.grpDetails
      },
      cssClass: 'create-post',
    });

    await modal.present();

    const data = await modal.onDidDismiss().then((res) => {
      if (res?.data?.refesh) {
        this.getAllPost(this.grpDetails?.data?.group_slug)
      }
    });
  }

  async moreInfo() {
    let msg = "";
    let cancel_label = "";
    let exit_grp = "";

    this.translate.get('others.pick_an_action').subscribe(value => { msg = value;})
    this.translate.get('others.cancel_btn').subscribe(value => {cancel_label = value;})
    this.translate.get('others.exit_Group').subscribe(value => {exit_grp = value;})


    const actionSheet = await this.actionSheetController.create({
      header: msg,
      cssClass: 'my-custom-class',
      buttons: [{
        text: exit_grp,
        icon: 'arrow-redo-outline',
        handler: () => {
          this.exitGroupConfrimation()
        }
      }, {
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

  exitGroupConfrimation() {
    var header_msg = "";
    var msg = "";
    var no="";
    var yes = "" 
    this.translate.get('others.no').subscribe(value => {no = value;})
    this.translate.get('others.yes').subscribe(value => {yes = value;})
    this.translate.get('others.header_alert').subscribe(value => { header_msg = value;})
    this.translate.get('others.group_exit_msg').subscribe(value => { msg = value;})

    this.alertController.create({
      header: header_msg,
      message: msg,
      backdropDismiss: false,
      buttons: [{
        text: no,
        role: 'cancel',
        handler: () => { }
      }, {
        text: yes,
        handler: () => {
          this.exitGroup()
        }
      }]
    })
      .then(alert => {
        alert.present();
      });
  }

  exitGroup() {
    this.global.loadingOpen()
    this.api.exitGroup({ "group_id": this.grpDetails?.data?.id }).then((res: any) => {
      //console.log(res)
      if (res.status == 200) {
        this.global.loadingClose();
        this.global?.toast_msg(res?.message);
        this.navCtrl.pop()
      } else {
        this.global.loadingClose();
        this.global?.toast_msg(res?.message)
      }
    }).catch(() => {
      this.global.loadingClose()
      this.global.getTranslateLabel('others.server_error');
    })
  }

  likePost(item, val) {
    this.global.loadingOpen()
    this.api.likeUnlike('post/like', { "post_id": item?.id, "is_like": val }).then((res: any) => {
      //console.log(res)
      if (res.status == 200) {
        // this.global?.toast_msg(res?.message);
        // this.getAllPost(this.grpDetails?.data?.group_slug)
        this.api.getGroupPosts('all_posts', { group_slug: this.grpDetails?.data?.group_slug }).then((res: any) => {
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
        }).catch(() => {
          this.global.loadingClose()
          this.global.getTranslateLabel('others.server_error');
        })

      } else {
        this.global.loadingClose();
        this.global?.toast_msg(res?.message)
      }
    }).catch(() => {
      this.global.loadingClose()
      this.global.getTranslateLabel('others.server_error');
    })
  }
}
