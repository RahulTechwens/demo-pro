import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/api.service';
import { GlobalService } from 'src/app/global.service';
import { Clipboard } from '@awesome-cordova-plugins/clipboard/ngx';
@Component({
  selector: 'app-transaction-history',
  templateUrl: './transaction-history.page.html',
  styleUrls: ['./transaction-history.page.scss'],
})
export class TransactionHistoryPage implements OnInit {
  payHistory: any;
  skeliton_loader: boolean = true;
  constructor(
    public global: GlobalService,
    private api: ApiService,
    private clipboard: Clipboard
  ){}

  ngOnInit() { }
  
  ionViewWillEnter() {
    this.loadpaymentHistory(null);
  }

  loadpaymentHistory(event) {
    this.api.paymentHistory(this.global.user_role == 'Advisory'?'advisor/earnings':'my_transaction').then((res: any) => {
      console.log(res)
      if (res.status == 200) {
        event != null ? event.target.complete() : this.skeliton_loader = false
        this.payHistory = res?.data;
        //console.log(res);
      } else {
        this.payHistory = "";
        event != null ? event.target.complete() : this.skeliton_loader = false
      }
    }).catch((err: any) => {
      this.global.loadingClose();
      this.global.getTranslateLabel('others.server_error');
      event != null ? event.target.complete() : this.skeliton_loader = false
    })
  }

  doRefresh(event){
  this.loadpaymentHistory(event)
  }

  copyTransactionId(txnId) {
    this.clipboard.copy(txnId).then((res) => {
      this.global.getTranslateLabel('others.txn_copied');
    });
  }

  downloadInvoice(invoice){
    console.log(this.global.base_ul)
    console.log(invoice.link)
    window.open(this.global.base_ul + invoice.link);

  }

  convertDecimalPoint(amount){
    return parseFloat(amount).toFixed(2)
  }

}


