import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import {AuthGuard} from './auth-guard.guard'
import { Camera, CameraOptions } from '@awesome-cordova-plugins/camera/ngx';
// translator service imports

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Clipboard } from '@awesome-cordova-plugins/clipboard/ngx';
import { ScreenOrientation } from '@awesome-cordova-plugins/screen-orientation/ngx';

import { PhotoViewer } from '@awesome-cordova-plugins/photo-viewer/ngx';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyAAv6IEJ_YntyBTd8DYBLhbZRfhcimcx_g",
  authDomain: "private-group-338912.firebaseapp.com",
  databaseURL: "https://private-group-338912-default-rtdb.firebaseio.com",
  projectId: "private-group-338912",
  storageBucket: "private-group-338912.appspot.com",
  messagingSenderId: "1009228916260",
  appId: "1:1009228916260:web:12810c878399e777b1dab1",
  measurementId: "G-T84SXSVN5S"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
  
@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    
    TranslateModule.forRoot({
      loader: {   
        provide: TranslateLoader,  
        useFactory: (createTranslateLoader),   
        deps: [HttpClient]  
      }  
    })  
  ],
  providers: [AuthGuard,Clipboard,ScreenOrientation,Camera,PhotoViewer,{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule { }
