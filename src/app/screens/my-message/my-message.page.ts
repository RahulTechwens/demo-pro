import { Component, OnInit } from '@angular/core';
import { GlobalService } from 'src/app/global.service';
import { getDatabase, ref, onValue, set, push, update } from "firebase/database";

@Component({
  selector: 'app-my-message',
  templateUrl: './my-message.page.html',
  styleUrls: ['./my-message.page.scss'],
})
export class MyMessagePage implements OnInit {
  cur_user:any;
  constructor(public global: GlobalService,) {
    console.log(this.global.userdetails)
    this.cur_user = this.global?.userdetails?.firebase_id?.fire_id;
    this.getChatUserDetails()
   }

  ngOnInit() {
  }

  getChatUserDetails() { 
    const starCountRef = ref(getDatabase(), 'chat_user/' + this.cur_user + '/');
    onValue(starCountRef, (snapshot) => {
      if (snapshot.val()) {
        console.log(snapshot.val());
        let chatUser = snapshot.val();
        for(let key in chatUser){
         // this.char.push()
        }
        console.log(chatUser)
      } 
    })
  }

}
