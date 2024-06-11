import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { PaymentModalPage } from '../payment-modal/payment-modal.page';

@Component({
  selector: 'app-join-page',
  templateUrl: './join-page.page.html',
  styleUrls: ['./join-page.page.scss'],
})
export class JoinPagePage implements OnInit {
  selectedOption:string = 'paypal';
  constructor(private modalController: ModalController) {}

  ngOnInit() {}

  async payWithCardModal() {
    this.selectedOption = 'cards';
    const modal = await this.modalController.create({
      component: PaymentModalPage,
      cssClass : 'drawer-modal payment',
      backdropDismiss : false
    }); 
  
    await modal.present();
  
    const data = await modal.onDidDismiss();
    //console.log(data)
  
  }
}
