import { Injectable, NgZone } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NavController } from '@ionic/angular';
import { GlobalService } from './global.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

 
 //public uri = 'https://p74.dev8.ivantechnology.in/privategroup/api';
 //public image_path = "https://p74.dev8.ivantechnology.in/privategroup/public/"
 
//  public uri = ' http://127.0.0.1:8000/api';
 public uri = 'https://p74.ivantechnology.in/privategroup/api';
// 

 public image_path = "https://p74.ivantechnology.in/privategroup/public/"

  constructor(
    public http: HttpClient,    
    private navCtrl: NavController,
    public zone: NgZone,
    private global: GlobalService,
  ) { }

  

  //Signup screen ================================
  signup(endPoint,paramFields) {
    //console.log("signup_param ===>", paramFields);
    return new Promise(resolve => {
      this.http.post(`${this.uri}/` + endPoint, paramFields).subscribe(data => {
        //console.log(data);
        resolve(data);
      }, err => {
        //console.log(err);
        resolve(err);
      });
    });
  }

  //Get occupations list ===========================
  getOccupationList(endPoint,{}) {
    return new Promise(resolve => {
      this.http.get(`${this.uri}/` + endPoint, {}).subscribe(data => {
        resolve(data);
      }, err => {
        resolve(err);
      });
    });
  }

  //Signin screen ================================
  sigin(endPoint,paramFields) {
    //console.log("signin_param ===>", paramFields);
    let httpOptions = {
      headers: new HttpHeaders({
        'Accept-Language':localStorage.getItem('default_language')
      })
    };
    return new Promise(resolve => {
      
      this.http.post(`${this.uri}/` + endPoint, paramFields,httpOptions).subscribe(data => {
        //console.log(data);
        resolve(data);
      }, err => {
        //console.log(err);
        resolve(err);
      });
    });
  }

  //Forgot Password =================================
  forgotPassword(endPoint,paramFields) {
    //console.log("signin_param ===>", paramFields);
    let httpOptions = {
      headers: new HttpHeaders({
        'Accept-Language':localStorage.getItem('default_language')
      })
    };
    return new Promise(resolve => {
      this.http.post(`${this.uri}/` + endPoint, paramFields,httpOptions).subscribe(data => {
        //console.log(data);
        resolve(data);
      }, err => {
        //console.log(err);
        resolve(err);
      });
    });
  }

  //Change Password
  changePassword(endPoint,paramFields) {
    let httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' +this.global.getToken(),
        'Accept-Language':localStorage.getItem('default_language')
      })
    };
    return new Promise(resolve => {
      this.http.post(`${this.uri}/` + endPoint, paramFields, httpOptions).subscribe(data => {
        //console.log(data);
        resolve(data);
      }, err => {
        //console.log(err);
        resolve(err);
      });
    });
  }

  //Get profile
  getprofile(endPoint) {
    //console.log(this.global.getToken())
    let httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' +this.global.getToken(),
        'Accept-Language':localStorage.getItem('default_language')
      })
    };
    return new Promise(resolve => {
      this.http.post(`${this.uri}/` + endPoint, {}, httpOptions).subscribe(data => {
        //console.log(data);
        resolve(data);
      }, err => {
        //console.log(err);
        resolve(err);
      });
    });
  }

  

  updateConsultationRate(endPoint,paramFields) {
    let httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' +this.global.getToken()
      })
    };
    //console.log("consultationrate_param ===>", paramFields);
    return new Promise(resolve => {
      this.http.post(`${this.uri}/` + endPoint, paramFields,httpOptions).subscribe(data => {
        //console.log(data);
        resolve(data);
      }, err => {
        //console.log(err);
        resolve(err);
      });
    });
  }

 
  getBookingHistory(endpoint){
    let httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' +this.global.getToken(),
        'Accept-Language':localStorage.getItem('default_language')
      })
    };
    return new Promise(resolve => {
      this.http.get(`${this.uri}/`+ endpoint, httpOptions).subscribe(data => {
        //console.log(data);
        resolve(data);
      }, err => {
        //console.log(err);
        resolve(err);
      });
    });
  }

  paymentHistory(endPoint){
    let httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' +this.global.getToken(),
        'Accept-Language':localStorage.getItem('default_language')
      })
    };
    return new Promise(resolve => {
      this.http.get(`${this.uri}/` + endPoint, httpOptions).subscribe(data => {
        //console.log(data);
        resolve(data);
      }, err => {
        //console.log(err);
        resolve(err);
      });
    });
  }
   
  getGrpList(endPoint) {
    //console.log(`${this.uri}/` + endPoint)
    let httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' +this.global.getToken(),
        'Accept-Language':localStorage.getItem('default_language')
      })
    };
    return new Promise(resolve => {
      this.http.post(`${this.uri}/` + endPoint, {}, httpOptions).subscribe(data => {
        //console.log(data);
        resolve(data);
      }, err => {
        //console.log(err);
        resolve(err);
      });
    });
  }

  getAdvisorDetails(endPoint){
    //console.log(`${this.uri}/` + endPoint)
    let httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' +this.global.getToken(),
        'Accept-Language':localStorage.getItem('default_language')
      })
    };
    return new Promise(resolve => {
      this.http.get(`${this.uri}/` + endPoint, httpOptions).subscribe(data => {
        //console.log(data);
        resolve(data);
      }, err => {
        //console.log(err);
        resolve(err);
      });
    });
  }

  getAccessToken(){
    //console.log(`${this.uri}/twillo/token_app` )
    let httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' +this.global.getToken(),
        'Accept-Language':localStorage.getItem('default_language')
      })
    };
    return new Promise(resolve => {
      this.http.get(`${this.uri}/twillo/token_app`, httpOptions).subscribe(data => {
        //console.log(data);
        resolve(data);
      }, err => {
        //console.log(err);
        resolve(err);
      });
    });
  }


  getGrpDeatils(endPoint) {
    //console.log(`${this.uri}/` + endPoint)
    let httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' +this.global.getToken(),
        'Accept-Language':localStorage.getItem('default_language')
      })
    };
    return new Promise(resolve => {
      this.http.get(`${this.uri}/` + endPoint, httpOptions).subscribe(data => {
        ////console.log(data);
        resolve(data);
      }, err => {
        ////console.log(err);
        resolve(err);
      });
    });
  }

  
  updateWhatsappNo(endPoint,param){
    //console.log(this.global.userdetails.token)
    let httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.global.getToken(),
        'Accept-Language':localStorage.getItem('default_language')
      })
    };
    return new Promise(resolve => {
      this.http.post(`${this.uri}/` + endPoint, param, httpOptions).subscribe(data => {
        //console.log(data);
        resolve(data);
      }, err => {
        //console.log(err);
        resolve(err);
      });
    });
  }

  getGroupPosts(endPoint,param){
    let httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.global.getToken(),
        'Accept-Language':localStorage.getItem('default_language')
      })
    };
    return new Promise(resolve => {
      this.http.post(`${this.uri}/` + endPoint, param, httpOptions).subscribe(data => {
        //console.log(data);
        resolve(data);
      }, err => {
        //console.log(err);
        resolve(err);
      });
    });
  }

  getMyPost(endPoint){
    let httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.global.getToken(),
        'Accept-Language':localStorage.getItem('default_language')
      })
    };
    return new Promise(resolve => {
      this.http.get(`${this.uri}/` + endPoint, httpOptions).subscribe(data => {
        //console.log(data);
        resolve(data);
      }, err => {
        //console.log(err);
        resolve(err);
      });
    });
  }

  updateDetails(endPoint,param){
    //console.log(this.global.getToken())
    let httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.global.getToken(),
        'Accept-Language':localStorage.getItem('default_language')
      })
    };
    return new Promise(resolve => {
      this.http.post(`${this.uri}/` + endPoint, param, httpOptions).subscribe(data => {
        //console.log(data);
        resolve(data);
      }, err => {
        //console.log(err);
        resolve(err);
      });
    });
  }

  uploadFile(formData) {
    //console.log(formData)
    let httpOptions = {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + this.global.getToken(),
        'Accept-Language':localStorage.getItem('default_language')
      }),
    };

    return new Promise((resolve) => {
      this.http
        .post(`${this.uri}/uploads`, formData, httpOptions)
        .subscribe(
          (data) => {
            //console.log(data);
            resolve(data);
          },
          (err) => {
            //console.log(err);
            resolve(err);
          }
        );
    });
  }


  chatAttachments(formData) {
    //console.log(formData)
    let httpOptions = {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + this.global.getToken(),
        'Accept-Language':localStorage.getItem('default_language')
      }),
    };

    return new Promise((resolve) => {
      this.http
        .post(`${this.uri}/chat_file_upload`, formData, httpOptions)
        .subscribe(
          (data) => {
            //console.log(data);
            resolve(data);
          },
          (err) => {
            //console.log(err);
            resolve(err);
          }
        );
    });
  }
  

  appointmentBook(formData){
    //console.log(formData)
    let httpOptions = {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + this.global.getToken(),
        'Accept-Language':localStorage.getItem('default_language')
      }),
    };

    return new Promise((resolve) => {
      this.http
        .post(`${this.uri}/advisor/book_appointment`, formData, httpOptions)
        .subscribe(
          (data) => {
            //console.log(data);
            resolve(data);
          },
          (err) => {
            //console.log(err);
            resolve(err);
          }
        );
    });
  }

  publishPost(formData){
    //console.log(formData)
    let httpOptions = {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + this.global.getToken(),
        'Accept-Language':localStorage.getItem('default_language')
      }),
    };

    return new Promise((resolve) => {
      this.http
        .post(`${this.uri}/create_post`, formData, httpOptions)
        .subscribe(
          (data) => {
            //console.log(data);
            resolve(data);
          },
          (err) => {
            //console.log(err);
            resolve(err);
          }
        );
    });
  }
  

  grpJoinRequest(endPoint, paramFields){
    let httpOptions = {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + this.global.getToken(),
        'Accept-Language':localStorage.getItem('default_language')
      }),
    };
    return new Promise(resolve => {
      this.http.post(`${this.uri}/` + endPoint, paramFields, httpOptions).subscribe(data => {
        //console.log(data);
        resolve(data);
      }, err => {
        //console.log(err);
        resolve(err);
      });
    });
  }
  
  getComments(endPoint,paramFields) {
    let httpOptions = {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + this.global.getToken(),
        'Accept-Language':localStorage.getItem('default_language')
      }),
    };
    return new Promise(resolve => {
      this.http.post(`${this.uri}/` + endPoint, paramFields, httpOptions).subscribe(data => {
        //console.log(data);
        resolve(data);
      }, err => {
        //console.log(err);
        resolve(err);
      });
    });
  }

  likeUnlike(endPoint,paramFields) {
    let httpOptions = {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + this.global.getToken(),
        'Accept-Language':localStorage.getItem('default_language')
      }),
    };
    return new Promise(resolve => {
      this.http.post(`${this.uri}/` + endPoint, paramFields, httpOptions).subscribe(data => {
        //console.log(data);
        resolve(data);
      }, err => {
        //console.log(err);
        resolve(err);
      });
    });
  }

  commentOnPost(endPoint,paramFields) {
    let httpOptions = {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + this.global.getToken(),
        'Accept-Language':localStorage.getItem('default_language')
      }),
    };
    return new Promise(resolve => {
      this.http.post(`${this.uri}/` + endPoint, paramFields, httpOptions).subscribe(data => {
        //console.log(data);
        resolve(data);
      }, err => {
        //console.log(err);
        resolve(err);
      });
    });
  }

  searchGroup(endPoint,paramFields) {
    let httpOptions = {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + this.global.getToken(),
        'Accept-Language':localStorage.getItem('default_language')
      }),
    };
    return new Promise(resolve => {
      this.http.post(`${this.uri}/` + endPoint, paramFields, httpOptions).subscribe(data => {
        //console.log(data);
        resolve(data);
      }, err => {
        //console.log(err);
        resolve(err);
      });
    });
  }

  cmsContent(endPoint,paramFields) {
    let httpOptions = {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + this.global.getToken(),
        'Accept-Language':localStorage.getItem('default_language')
      }),
    };
    return new Promise(resolve => {
      this.http.post(`${this.uri}/` + endPoint, paramFields, httpOptions).subscribe(data => {
        //console.log(data);
        resolve(data);
      }, err => {
        //console.log(err);
        resolve(err);
      });
    });
  }

  deletePost(paramFields){
    //console.log(paramFields)
    let httpOptions = {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + this.global.getToken(),
        'Accept-Language':localStorage.getItem('default_language')
      }),
    };
    return new Promise(resolve => {
      this.http.post(`${this.uri}/` + 'delete_post', paramFields, httpOptions).subscribe(data => {
        //console.log(data);
        resolve(data);
      }, err => {
        //console.log(err);
        resolve(err);
      });
    });
  }

  exitGroup(paramFields){
    //console.log(paramFields)
    let httpOptions = {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + this.global.getToken(),
        'Accept-Language':localStorage.getItem('default_language')
      }),
    };
    return new Promise(resolve => {
      this.http.post(`${this.uri}/` + 'exit_group', paramFields, httpOptions).subscribe(data => {
        //console.log(data);
        resolve(data);
      }, err => {
        //console.log(err);
        resolve(err);
      });
    });
  }

  //Available slots for booking =====================================
  getSlots() {
    let httpOptions = {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + this.global.getToken(),
        'Accept-Language':localStorage.getItem('default_language')
      }),
    };
    return new Promise(resolve => {
      this.http.get(`${this.uri}/` + 'advisor/slots', httpOptions).subscribe(data => {
        resolve(data);
      }, err => {
        resolve(err);
      });
    });
  }

  //Get avisor leave date for booking =====================================
  getleaves() {
    let httpOptions = {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + this.global.getToken(),
        'Accept-Language':localStorage.getItem('default_language')
      }),
    };
    return new Promise(resolve => {
      this.http.get(`${this.uri}/` + 'advisor/leave_list', httpOptions).subscribe(data => {
        resolve(data);
      }, err => {
        resolve(err);
      });
    });
  }

  //Update time slots (Advisor side) =======================================
  updateTimeSlot(paramFields){
    //console.log(paramFields)
    let httpOptions = {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + this.global.getToken(),
        'Accept-Language':localStorage.getItem('default_language')
      }),
    };
    return new Promise(resolve => {
      this.http.post(`${this.uri}/` + 'advisor/availability', paramFields, httpOptions).subscribe(data => {
        //console.log(data);
        resolve(data);
      }, err => {
        //console.log(err);
        resolve(err);
      });
    });
  }

  //Set leave date (Advisor side) =======================================
  setLeavedate(paramFields){
    //console.log(paramFields)
    let httpOptions = {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + this.global.getToken(),
        'Accept-Language':localStorage.getItem('default_language')
      }),
    };
    return new Promise(resolve => {
      this.http.post(`${this.uri}/` + 'advisor/add_remove_leaves', paramFields, httpOptions).subscribe(data => {
        //console.log(data);
        resolve(data);
      }, err => {
        //console.log(err);
        resolve(err);
      });
    });
  }

//logout ================================
logout(){
  this.global.userdetails = "";
  this.global.userdetails.token = "";
  localStorage.removeItem('token');
  localStorage.removeItem('privateGroup_Udata_local');
}


contact_us(endPointName,paramData) {
  //console.log(paramData);
  //console.log(`${this.uri}/` + endPointName)
  return new Promise(resolve => {
    this.http.post(`${this.uri}/` + endPointName,paramData, {}).subscribe(data => {
      //console.log(data);
      resolve(data);
    }, err => {
      //console.log(err);
      resolve(err);
    });
  });
}

}
