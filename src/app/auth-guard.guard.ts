import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { GlobalService } from './global.service';
@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate {
  constructor(private router: Router, private global: GlobalService, public navCtrl: NavController,) { }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Observable<boolean> | Promise<boolean> {
    return new Promise((resolve, reject) => {
      let intro_read = localStorage.getItem('intro_read');
      //console.log(intro_read)
      let token = localStorage.getItem('token');
      //console.log(token)
      let localdata = localStorage.getItem('privateGroup_Udata_local');
      let uData = JSON.parse(localdata);
      //console.log(uData)
      if (intro_read != null && token != null && uData != null) {
        this.global.userdetails = uData;
        //console.log(this.global.userdetails)
        resolve(true);
      } else if ((intro_read == null || intro_read == undefined) && token == null && uData == null) {
        //console.log('Fresh user');
        this.navCtrl.navigateRoot(['./welcome']);
        resolve(false);
      } else {
        //console.log('User is not logged in');
        this.navCtrl.navigateRoot(['./login']);
        resolve(false);
      }

    });
  }
}