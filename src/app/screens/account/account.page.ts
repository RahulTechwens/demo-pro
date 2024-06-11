import { Component, OnInit,ViewChild } from '@angular/core';
import { ApiService } from 'src/app/api.service';
import { GlobalService } from 'src/app/global.service';
import * as moment from 'moment'
import { IonContent, ModalController, NavController } from '@ionic/angular';
import { Camera, CameraOptions } from '@awesome-cordova-plugins/camera/ngx';
import { ActionSheetController } from '@ionic/angular';
import { ChangePasswordPage } from '../change-password/change-password.page';
import { Router } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit {
  public selectedLanguage: any = "";
  maxday: any;
  public email: any = "";
  public contact_number: any = "";
  public gender: any;
  public dob: any;
  public dial_code: any = "";
  public wp_number: any = "";
  public genderArr = ['Male', 'Female', 'Others']
  public dob_edit: boolean = false;
  public gender_edit: boolean = false;
  public occupation_edit: boolean = false;
  public occupation_dropdown_arr: any;
  public occupation:any = "";
  public education_edit:boolean = false;

  public institute_name:any ="";
  public highest_qualification:any = ""
  public image:any = ""

  @ViewChild(IonContent, { static: false }) content: IonContent;
  dummyList: any;

  constructor(
    public global: GlobalService,
    private api: ApiService,
    private camera: Camera,
    public actionSheet: ActionSheetController,
    public modalController: ModalController,
    public navCtrl: NavController,
    private route: Router,
    public translate: TranslateService,
    
  ) {
    this.selectedLanguage = this.global?.default_language;
    this.email = this.global.userdetails?.email;
    this.contact_number = this.global?.userdetails?.contact_number;
    this.dob = this.global?.userdetails.dob;
    this.gender = this.global?.userdetails?.gender;
    this.dial_code = this.global?.userdetails?.user_details?.dial_code
    this.wp_number = this.global?.userdetails?.user_details?.whatsapp_number;
    this.institute_name = this.global.userdetails?.user_education_details?.institute_name;
    this.highest_qualification = this.global.userdetails?.user_education_details?.highest_qualification;
    this.image = this.api.image_path+this.global?.userdetails?.profile_picture?.path;
    //console.log(this.occupation)
    this.maxday = this.global.maxday();
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.getOcupationList();
  }

  getProfile(event) {
    this.api.getprofile('get_user').then((res: any) => {
      //console.log(res)
      if (res.status == 200) {
        if (event != null) { event.target.complete(); }
        let uData = res?.data;
        localStorage.setItem('privateGroup_Udata_local', JSON.stringify(uData));
        this.global.userdetails = uData;
        this.image = this.api.image_path+this.global?.userdetails?.profile_picture?.path;
      }else if (res.status == 401) {
        event != null ? event.target.complete() : null;
        this.translate.get('others.login_exp_msg').subscribe(
          value => {
            this.global.toast_msg(value);
          }
        )
        this.global.tokenloss_logout();
      } else {
        this.global.toast_msg(res?.message);
        if (event != null) { event.target.complete(); }
      }
    }).catch(()=>{
      if (event != null) { event.target.complete(); }
      this.translate.get('others.server_error').subscribe(
        value => {
          this.global.toast_msg(value);
        }
      )
    })
  }

  doRefresh(event) {
    this.getProfile(event)
  }

  languageChanged() {
    this.global.setLanguage(this.selectedLanguage)
  }

  addWhatsappNo() {
    if (this.dial_code == "") {
      this.translate.get('others.Please_choose_country_code').subscribe(
        value => {
          this.global.toast_msg(value);
        }
      )
    } else if (!this.wp_number.trim()) {
      this.translate.get('others.Please_enter_whatsapp_number').subscribe(
        value => {
          this.global.toast_msg(value);
        }
      )
    } else {
      this.global.loadingOpen()
      this.api.updateWhatsappNo('user/update_wp_number', { dial_code: this.dial_code, wp_number: this.wp_number }).then((res: any) => {
        //console.log(res);
        if (res.status == 200) {
          this.global.loadingClose()
          this.global.toast_msg(res.message);
          this.getProfile(null)
        } else {
          this.global.loadingClose()
          this.global.toast_msg(res.message)
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

  changeGender(type) {
    this.gender = type
    //console.log(this.gender)
  }

  saveDetails(param,endpoint) {
    //console.log(param)
    if (param.value != '') {
      this.global.loadingOpen()
      this.api.updateDetails(endpoint, param).then((res: any) => {
        ////console.log(res);
        if (res.status == 200) {
          this.global.loadingClose()
          this.global.toast_msg(res.message);
          this.getProfile(null)
          this.dob_edit = false;
          this.gender_edit = false;
          this.occupation_edit = false;
          
        } else {
          this.global.loadingClose()
          this.global.toast_msg(res.message);
          this.getProfile(null)
        }
      }).catch(()=>{
        this.global.loadingClose();
        this.translate.get('others.server_error').subscribe(
          value => {
            this.global.toast_msg(value);
          }
        )
      })
    }
  }

  

  formatDate(value: string) {
    console.log(value)
    let val = moment(value).format('MM-DD-YYYY');
    let oldDate = new Date(val)
    console.log(val, oldDate)
    
    let diff = new Date().getTime() - oldDate.getTime();
    console.log(diff)
    if (diff > 0) {
      this.modalController.dismiss()
      return this.dob=value;
      
    }
  }

  getOcupationList() {
    this.global.loadingOpen()
    this.api.getOccupationList('get_occupations', {}).then((res: any) => {
      //console.log(res)
      if (res.status == '200') {
        this.global.loadingClose();
        this.occupation_dropdown_arr = res?.data;
        this.occupation = this.global?.userdetails?.occupation?.id;
        //console.log(this.occupation)
      } else {
        this.global.loadingClose();
        this.global.toast_msg(res?.message)
      }
    }).catch(()=>{
      this.global.loadingClose();
      this.translate.get('others.server_error').subscribe(
        value => {
          this.global.toast_msg(value);
        }
      )
    })
  }

  toggleEducationDetails(type){
    if(type == 'open'){
      this.education_edit = true;
      this.content.scrollToBottom(2000);
    }else{
      this.education_edit = false;
      //this.content.scrollToTop();
    }

  }


  async profilePicOptions() {
    var cameraText = ""
    var gelleryText = ""
   this.translate.get('others.camera').subscribe(
      (value:any) => {
        cameraText = value
      }
    )

    this.translate.get('others.gallery').subscribe(
      (value:any) => {
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
        this.image = 'data:image/jpg;base64,' + fileUri;
        const blobData = this.b64toBlob(fileUri, `image/jpeg`);
        this.profileImage(blobData);
      },
      (err) => {}
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
        this.image = 'data:image/jpg;base64,' + fileUri;
        const blobData = this.b64toBlob(fileUri, `image/jpeg`);
        this.profileImage(blobData);
      },
      (err) => {}
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
    //console.log(blob);
    return blob;
  }


  profileImage(blobdata) {
    this.global.loadingOpen();
    const fd = new FormData();
    fd.append('type', 'profile_image');
    fd.append('file', blobdata, 'avatar.jpeg');
    fd.append('module_name', 'user');
    fd.append('respective_id', this.global.userdetails.id);
    //console.log(blobdata)
    this.api.uploadFile(fd).then((res: any) => {
      this.global.loadingClose();
      //console.log(res)
      if(res.status == 200){
        this.global.toast_msg(res.message);
        this.getProfile(null)
      }else{
        this.global.toast_msg(res.message);
        this.getProfile(null)
      }
      
    });
  }

  typing(){
   if(this.highest_qualification != '' && this.institute_name != ""){
    this.content.scrollToBottom(2000);
   }
  }
  async changePassword(){
    this.route.navigate(['/change-password']);
  }
}
