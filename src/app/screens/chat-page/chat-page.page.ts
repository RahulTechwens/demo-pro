import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, set, push, update } from "firebase/database";
import { ApiService } from 'src/app/api.service';
import { GlobalService } from 'src/app/global.service';
import { IonContent, ModalController, NavController } from '@ionic/angular';
import * as moment from 'moment';

import { Camera, CameraOptions } from '@awesome-cordova-plugins/camera/ngx';
import { ActionSheetController } from '@ionic/angular';

import { PhotoViewer } from '@awesome-cordova-plugins/photo-viewer/ngx';

@Component({
  selector: 'app-chat-page',
  templateUrl: './chat-page.page.html',
  styleUrls: ['./chat-page.page.scss'],
})
export class ChatPagePage implements OnInit {
  public memberDetails: any;
  public cur_user: any = "";
  public oponent_user: any = "";
  public chat_root: any;

  public chat_load: boolean = true;
  public typing: boolean;

  public msg: any = "";
  public msgArr: any = [];
  public chatStarted: any = ""
  public textSendButton: boolean;

  public uploadMedia: boolean = true;

  public mediaArr: any = [];

  @ViewChild(IonContent, { static: false }) content: IonContent;
  constructor(
    private route: Router, public global: GlobalService,
    public api: ApiService,
    private camera: Camera,
    public actionSheet: ActionSheetController,
    private photoViewer: PhotoViewer
  ) {
    if (route.getCurrentNavigation().extras.state) {
      this.memberDetails = route.getCurrentNavigation().extras.state?.data;
      if (this.memberDetails) {
        this.cur_user = this.global?.userdetails?.firebase_id?.fire_id;
        this.oponent_user = this.memberDetails?.firebase_id?.fire_id;
        this.getChatUserDetails()
      }
    }
  }

  ngOnInit() { }

  getChatUserDetails() {
    const starCountRef = ref(getDatabase(), 'chat_user/' + this.cur_user + '/');
    onValue(starCountRef, (snapshot) => {
      if (snapshot.val()) {
        let chatUser = snapshot.val();
        for (let key in chatUser) {
          if (key == this.oponent_user) {
            this.chat_root = chatUser[key]?.chat_root;
            this.chatStarted = chatUser[key]?.chatStaterd
          }
        }
        if (this.chat_root) {
          this.getChat();
          this.getTypingStatus()
        } else {
          this.chat_root = this.cur_user + ',' + this.oponent_user;
          this.chat_load = false;
        }
      } else {
        this.chat_load = false;
        this.chat_root = this.cur_user + ',' + this.oponent_user;
      }
    })
  }

  getChat() {
    console.log(this.chat_root)
    const starCountRef = ref(getDatabase(), 'chats/' + this.chat_root);
    onValue(starCountRef, (snapshot) => {
      if (snapshot != null) {
        let chats = snapshot.val();
        this.msgArr = [];
        for (let k in chats) {
          this.msgArr.push(chats[k])
          setTimeout(() => {
            this.content.scrollToBottom();
          }, 100)

        }
        console.log(this.msgArr)
        this.chat_load = false;
      }
    });
  }

  sendMessage() {
    if (this.msg.trim()) {
      this.saveChat()
    } else {
      this.msg = ""
    }

  }

  getTypingStatus() {
    const starCountRef = ref(getDatabase(), 'chat_user/' + this.cur_user + '/' + this.oponent_user);
    onValue(starCountRef, (snapshot) => {
      if (snapshot != null) {
        let data = snapshot.val();
        this.typing = data?.typing;
      }
    })

  }

  typingEffect() {
    if (this.msgArr != "") {
      if (this.msg.length == 1) {
        this.textSendButton = true;
        update(ref(getDatabase(), 'chat_user/' + this.oponent_user + '/' + this.cur_user + '/'), {
          typing: true
        })
      } else if (this.msg.length == 0) {
        update(ref(getDatabase(), 'chat_user/' + this.oponent_user + '/' + this.cur_user + '/'), {
          typing: false
        })
        this.textSendButton = false;
      }

    } else {
      if (this.msg.length == 1) {
        this.textSendButton = true;
      } else if (this.msg.length == 0) {
        this.textSendButton = false;
      }
    }
  }

  saveChat() {
    push(ref(getDatabase(), 'chats/' + this.chat_root + '/'), {
      text: this.msg,
      media:"",
      messagTime: moment().format('hh:mm A'),
      messageDate: moment().format("YYYY-MM-DD"),
      uid: this.cur_user,
      username: this.global?.userdetails?.name,
    }).then(() => {
      this.msg = ""
      this.content.scrollToBottom(100);
      set(ref(getDatabase(), 'chat_user/' + this.cur_user + '/' + this.oponent_user + '/'), {
        chat_root: this.chat_root,
        typing: false,
        author: this.memberDetails?.email,
        uid: this.oponent_user,
        lastMessage: moment().format('hh:mm A'),
        chatStaterd: this.chatStarted == "" ? moment().format('hh:mm A') : this.chatStarted
      }).then(() => {
        set(ref(getDatabase(), 'chat_user/' + this.oponent_user + '/' + this.cur_user + '/'), {
          chat_root: this.chat_root,
          author: this.global?.userdetails?.email,
          typing: false,
          uid: this.cur_user,
          lastMessage: moment().format('hh:mm A'),
          chatStaterd: this.chatStarted == "" ? moment().format('hh:mm A') : this.chatStarted
        })
      })
    });
  }

  async mediaOptions() {
    const actionSheet = await this.actionSheet.create({
      buttons: [
        {
          text: 'Camera',
          icon: 'camera',
          handler: () => {
            this.getCamera();
          },
        },
        {
          text: 'Gallery',
          icon: 'images-outline',
          handler: () => {
            this.getGallery();
          },
        },
      ],
      cssClass: 'camera-opions',
    });
    await actionSheet.present();
  }

  getGallery() {
    const cameraOptions = {
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      correctOrientation: true,
      output:2
    };
    this.camera.getPicture(cameraOptions).then(
      (fileUri) => {
        const blobData = this.b64toBlob(fileUri, `image/jpeg`);
        this.profileImage(blobData);
      },
      (err) => { }
    );
  }

  getCamera() {
    const cameraOptions = {
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      correctOrientation: true,
    };
    this.camera.getPicture(cameraOptions).then(
      (fileUri) => {
        const blobData = this.b64toBlob(fileUri, `image/jpeg`);
        console.log(blobData)
        this.profileImage(blobData);
      },
      (err) => { }
    );
  }

  b64toBlob(b64Data, contentType = '', sliceSize = 512) {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }


  profileImage(blobdata) {
    let imgData:any = [];
    imgData.push(blobdata)
    console.log(imgData)
    this.global.loadingOpen();
    const fd = new FormData();
    imgData.forEach(element => {
      fd.append('files[]', element);
    });
    
    this.api.chatAttachments(fd).then((res: any) => {
      console.log(res)
      this.global.loadingClose();
      if (res.status == 200) {
        this.global.toast_msg(res.message);
        this.mediaArr = res.data;
        
        this.saveMediaChat()
      } else {
        this.global.toast_msg(res.message);
      }
    });
  }

  saveMediaChat() {
    console.log(this.mediaArr)
    push(ref(getDatabase(), 'chats/' + this.chat_root + '/'), {
      text: "",
      media:this.mediaArr,
      messagTime: moment().format('hh:mm A'),
      messageDate: moment().format("YYYY-MM-DD"),
      uid: this.cur_user,
      username: this.global?.userdetails?.name,
    }).then(() => {
      this.msg = ""
      this.content.scrollToBottom(100);
      set(ref(getDatabase(), 'chat_user/' + this.cur_user + '/' + this.oponent_user + '/'), {
        chat_root: this.chat_root,
        typing: false,
        author: this.memberDetails?.email,
        uid: this.oponent_user,
        lastMessage: moment().format('hh:mm A'),
        chatStaterd: this.chatStarted == "" ? moment().format('hh:mm A') : this.chatStarted
      }).then(() => {
        set(ref(getDatabase(), 'chat_user/' + this.oponent_user + '/' + this.cur_user + '/'), {
          chat_root: this.chat_root,
          author: this.global?.userdetails?.email,
          typing: false,
          uid: this.cur_user,
          lastMessage: moment().format('hh:mm A'),
          chatStaterd: this.chatStarted == "" ? moment().format('hh:mm A') : this.chatStarted
        })
      })
    });
  }

  viewPhoto(url){
    this.photoViewer.show(this.global.image_path + url);
  }

}
