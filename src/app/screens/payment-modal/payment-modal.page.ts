import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-payment-modal',
  templateUrl: './payment-modal.page.html',
  styleUrls: ['./payment-modal.page.scss'],
})
export class PaymentModalPage implements OnInit {
  stripeForm: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private modalController: ModalController
  ) {
    this.stripeForm = this.formBuilder.group({
      number: ['', Validators.compose([Validators.required])],
      expMonth: ['', Validators.compose([Validators.required])],
      expYear: ['', Validators.compose([Validators.required])],
      cvc: ['', Validators.compose([Validators.required])],
      name: ['', Validators.compose([Validators.required])],
    });
  }

  ngOnInit() {}

  close() {
    this.modalController.dismiss();
  }
}
