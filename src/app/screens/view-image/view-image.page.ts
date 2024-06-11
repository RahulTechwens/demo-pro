import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { ApiService } from '../../api.service';
import { GlobalService } from '../../global.service';

@Component({
  selector: 'app-view-image',
  templateUrl: './view-image.page.html',
  styleUrls: ['./view-image.page.scss'],
})
export class ViewImagePage implements OnInit {
  allImg:any = ""
  constructor( 
    private navParams: NavParams, 
    public global: GlobalService,
    private api: ApiService,
    private modalController: ModalController,
    ) { 
    let value = this.navParams.get('paramData');
    
    this.allImg = value;
    console.log('value',this.allImg);
  }

  ngOnInit() {
  }

  close(){
    this.modalController.dismiss();
  }

}
