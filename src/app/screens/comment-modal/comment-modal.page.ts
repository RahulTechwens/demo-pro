import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { ApiService } from 'src/app/api.service';
import { GlobalService } from 'src/app/global.service';

@Component({
  selector: 'app-comment-modal',
  templateUrl: './comment-modal.page.html',
  styleUrls: ['./comment-modal.page.scss'],
})
export class CommentModalPage implements OnInit {
  postDeatils:any = "";
  comment_content:any = "";
  comments:any;
  constructor( 
    private navParams: NavParams,
    public global: GlobalService,
    public api: ApiService,
    public modalController: ModalController,
    public translate: TranslateService
    ) { 
    let value = this.navParams.get('paramData');
     
    this.postDeatils = value;
  }

  ngOnInit() {}

  ionViewWillEnter() {
    this.getComments();
  }

  getComments(){
    this.global.loadingOpen()
    this.api.getComments("post/all_comments",{ "post_id": this.postDeatils.id}).then((res: any) => {
      
      if(res.status == 200){
        this.comments = res?.data;
        this.global.loadingClose()
      }else{
        this.comments = "";
        this.global.loadingClose() 
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
  close() {
    this.modalController.dismiss({ refesh: true })
  }

  commentNow(){
    if(this.comment_content.trim()){
      this.global.loadingOpen()
      this.api.commentOnPost('post_comment',{post_id:this.postDeatils?.id,comment:this.comment_content}).then((res: any) => {
         
        if(res.status == 200){
           
          this.global.loadingClose();
          this.comment_content = ""
          this.getComments()
          
        }else{
          this.global.loadingClose()
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
   
  }
}
