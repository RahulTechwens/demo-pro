import { Component, OnInit } from '@angular/core';
import { Camera, CameraOptions } from '@awesome-cordova-plugins/camera/ngx';
import { ActionSheetController, ModalController, NavParams } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { ApiService } from 'src/app/api.service';
import { GlobalService } from 'src/app/global.service';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.page.html',
  styleUrls: ['./create-post.page.scss'],
})
export class CreatePostPage implements OnInit {
  imageArr: any = [];
  text_content: any = "";
  blobArr: any = [];
  grpDetails: any = "";
  constructor(private camera: Camera,
    public actionSheet: ActionSheetController,
    public global: GlobalService,
    private api: ApiService,
    private modalController: ModalController,
    private navParams: NavParams,
    public translate: TranslateService
  ) {
    let value = this.navParams.get('paramData');
    this.grpDetails = value;
  }

  ngOnInit() {
  }

  async imgUpload() {
    var cameraText = ""
    var gelleryText = ""
    this.translate.get('others.camera').subscribe(
      (value: any) => {
        cameraText = value
      }
    )

    this.translate.get('others.gallery').subscribe(
      (value: any) => {
        gelleryText = value
      }
    )
    const actionSheet = await this.actionSheet.create({
      buttons: [
        {
          text: cameraText,
          icon: 'camera',
          handler: () => {
            this.getCamera();
          },
        },
        {
          text: gelleryText,
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
    };
    this.camera.getPicture(cameraOptions).then(
      (fileUri) => {
        let show_url = 'data:image/jpg;base64,' + fileUri;
        this.imageArr.push(show_url)
        const blobData = this.b64toBlob(fileUri, `image/jpeg`);
        this.blobArr.push(blobData)
         
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
        let show_url = 'data:image/jpg;base64,' + fileUri;
        this.imageArr.push(show_url)
        const blobData = this.b64toBlob(fileUri, `image/jpeg`);
        this.blobArr.push(blobData)
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


  publishPost() {
    if (this.text_content.trim() || this.blobArr.length >= 1) {
      this.global.loadingOpen();
      const fd = new FormData();
      fd.append('group_id', this.grpDetails?.data?.id);
      this.blobArr.forEach(element => {
        fd.append('images[]', element)
      });
      fd.append('text_content', this.text_content);

      this.api.publishPost(fd).then((res: any) => {
        this.global.loadingClose();
        //console.log(res)
        if (res.status == 200) {
          this.global.toast_msg(res.message);
          this.modalController.dismiss({ refesh: true })
        } else {
          this.global.toast_msg(res.message);
        }

      }).catch(() => {
        this.global.loadingClose()
        this.global.getTranslateLabel('others.server_error');
      })
    }


  }

  deleteImg(index) {
    this.imageArr.splice(index, 1);
    this.blobArr.splice(index, 1)
  }

  close() {
    this.modalController.dismiss();
  }

}
