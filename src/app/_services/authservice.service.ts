import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, VERSION } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiserviceService } from './apiservice.service';

//import { USER } from '../_classes/User';
//import { ApidataService } from './apidata.service';

export interface USER {
  EMAIL:string,
  CELLNO: string,
  TOKEN:string,
  VENDOR: string,
  VENDORS: string,
  NAME:string,
  USERNAME:string,
}

@Injectable({
  providedIn: 'root'
})
export class AuthserviceService {
  public token = '123456';
  private blankuser:USER = this.getBlankuser();
    public rfqtoken: string;
  loggedin = false;
  mapurl = '';
  currentuser: USER = this.getBlankuser();
  waiting = false;
  loading = false;
  public currentUserBS = new BehaviorSubject<USER>(this.blankuser);
  public currentUser$ = this.currentUserBS.asObservable();
   public vendorsBS = new BehaviorSubject([])
  public loggedinBS = new BehaviorSubject(false);
  doc = this.router.url;
  devprod = '';
  constructor(private route: ActivatedRoute, private router: Router, public apiserv: ApiserviceService,
    private http: HttpClient) {
      this.devprod = (this.doc.toUpperCase().includes('DEV') || this.doc.toUpperCase().includes('LOCAL')) ? 'DEV' : 'PROD';
      // Is this a new link?
      this.rfqtoken = this.findGetParameter('t') || '';
    let cu = '';
 
    // Check if new link from SAP - ignore current tokens if user defined
    // Prevent user typing in token in localstorage or URL by checking validity on SAP
    if (this.rfqtoken && this.rfqtoken.length > 5){
    this.validateToken(this.rfqtoken);
    } else {
     this.validateLSToken();
    }
    this.postJSGEN({DATA:"VENDORS"},'MASTERDATA','DIESEL').subscribe( reply=>
      {
      if (reply.RESULT.length > 2) {
       this.vendorsBS.next(JSON.parse(reply.RESULT))
      }
      }
    )
  this.currentUser$.subscribe(reply=>{
    if (this.currentUserBS.value.VENDOR.length > 3){
      let tokenout =  this.currentUserBS.value.TOKEN;
    this.mapurl = 'https://io.bidvestfm.co.za/bidvestfm_api_auth/dieselmap/index.html?q=V' + this.currentUserBS.value.VENDOR + '&t=' + tokenout;
     }
     this.currentuser = { ...this.currentUserBS.value}
  })
    
  }

  logOut(){
    localStorage.removeItem('BFMDUser');
    this.currentUserBS.next(this.getBlankuser())
    this.currentuser = this.getBlankuser();
    this.loggedin = false;
    this.loggedinBS.next(false);
    this.loading = false;
    this.waiting = false;
    this.router.navigate(['login']) 
  }
  getOTP(email = '', sms = '') {
   // this.blankuser.SAPUSER = email;
    this.blankuser.CELLNO = sms;
    let lclobj = { EMAIL: email, CELLNO: sms, APIKEY: 'DIESELPORTAL' }
    this.loading = true;
    this.postGEN(lclobj, 'SENDRFCOTP', 'USER').subscribe(tokenin => {
      this.waiting = true;
      this.loading = false;
      let token = tokenin.RESULT ;
      if (token.VERIFIED_BY_USER_GUID == 'ERROR') {
        this.blankuser.TOKEN = '';
        this.apiserv.messagesBS.next(token.VERIFIED_BY_USER_GUID + ' - ' + token.PASSWORD);
        this.currentUserBS.next(this.blankuser);
        this.loggedin = false;
        this.loggedinBS.next(false);
      }
      this.currentuser.EMAIL =  token.EMAIL
     this.currentuser.TOKEN = token.VERIFIED_BY_USER_GUID; 
     this.currentuser.CELLNO = token.CELL;
     this.currentuser.NAME = token.NAME;
     this.currentuser.VENDOR = token.VENDOR;
      // token.RESULT[0].TOKEN = '---'
      // token.RESULT[0].PAR = 'WAITING'
      // this.currentUserBS.next(token.RESULT[0]);
    })
  }
  login() {
    localStorage.setItem('BFMDUser',JSON.stringify(this.currentUserBS.value));
    this.loggedin = true;
    this.loggedinBS.next(true);
   
      this.router.navigate(['home']) 
    
  }
  confirmOTP(email = '', sms = '', otpin = '') {
    this.waiting = true;
    this.loading = true;
    let lclobj = { EMAIL: this.currentuser.EMAIL, CELLNO: this.currentuser.CELLNO, OTP: otpin, APIKEY: 'DIESELPORTAL', TOKEN: this.currentuser.TOKEN }
    this.postGEN(lclobj, 'VALIDRFCOTP', 'USER').subscribe(tokenin => {
      let token = tokenin.RESULT;
      if (token.VERIFIED_BY_USER_GUID == 'ERROR') {
        this.blankuser.TOKEN = '';
        this.apiserv.messagesBS.next(token.VERIFIED_BY_USER_GUID + ' - ' + token.PASSWORD);
        this.currentUserBS.next(this.blankuser);
        this.loggedin = false;
        this.loggedinBS.next(false);
        this.loading = false;
        this.waiting = false;  
        this.router.navigate(['login']) ;
       } else {
     this.blankuser.EMAIL =  token.EMAIL
      this.blankuser.TOKEN = token.VERIFIED_BY_USER_GUID; 
      this.blankuser.CELLNO = token.CELL;
      this.blankuser.NAME = token.NAME;
      this.blankuser.USERNAME = token.USERNAME;
      this.blankuser.VENDOR =  token.VENDORS.includes(':')? '' : token.VENDOR;
      this.blankuser.VENDORS = token.VENDORS;
      this.currentUserBS.next(JSON.parse(JSON.stringify(this.blankuser)));
      this.loading = false;
      this.waiting = false;  
      this.login();
  
    //   window.location.reload();
    //   }}
    }
  })
  }
  findGetParameter(parameterName: string) {
    let result = '';
    let tmp = ['',''];
    tmp = this.router.url.split('?');
    if (tmp && tmp.length > 1) {
      let tempparams = tmp[1].split('&');

      tempparams.forEach((item) => {
        tmp = item.split('=');
        if (tmp[0] === parameterName) {
          result = decodeURIComponent(tmp[1]);
        }
      });
    }
    return result;
  }
  public get currentUserValue(): USER {
    return this.currentUserBS.value;
  }
 validateToken(token: string){
this.postJSGEN({LINK:token},'CONFIRM_LINK','DIESEL').subscribe(reply=>{
  if ( reply.RESULT.indexOf('Error') > 2) {
    this.validateLSToken();
  } 
  else {
    this.currentUserBS.next(JSON.parse(reply.RESULT));
    this.login();
  }
})

}
validateLSToken(){
 let cu = localStorage.getItem('BFMDUser') || '';
 if (cu && JSON.parse(cu).TOKEN.length > 5){
  this.postJSGEN({TOKEN:JSON.parse(cu).TOKEN},'VALIDATETOKEN','DIESEL').subscribe( reply=>{
    if ( reply.RESULT.indexOf('Error') > 2) {
      this.logOut()
    } else {
      this.currentUserBS.next(JSON.parse(cu));
      this.loggedin = true;
    }
  }) ;
 } else{
  this.logOut()
 }



}
/*******postJSGen** Return non-array***************************************************** */
postJSGEN(lclobj: any, methodname: string, classname: string = "DIESEL") {
  let BASE_POST = this.devprod == 'PROD'? 'https://io.bidvestfm.co.za/BIDVESTFM_API_GEN_PROD/genpost'
  :'https://io.bidvestfm.co.za/BIDVESTFM_API_GEN/genpost';


  const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      token: 'BK175mqMN0',
    })
  };
  const call2 = {
    context: {
      CLASS: classname,
      TOKEN: 'BK175mqMN0',
      METHOD: methodname
    },
    data: lclobj

  };
  let url = 'https://io.bidvestfm.co.za/BIDVESTFM_API_ZRFC3/request?sys=' + (( this.devprod == 'PROD')? 'prod' : 'dev');
  let mypost = this.http.post(url,
    call2, httpOptions);
  
  return  mypost.pipe(
      map(data => {
        this.loading = false;
   
          let represult = (data && data['d' as keyof typeof data] && data['d' as keyof typeof data]['exResult'  as keyof typeof data]) ? 
          JSON.parse(JSON.parse(data['d' as keyof typeof data]['exResult'  as keyof typeof data].toString().replace(/[^\x00-\x7F]/g,""))) : data
            return represult
           
      }) )
    
  // const httpOptions = {
  //   headers: new HttpHeaders({
  //     'Content-Type': 'application/json',
  //     Authorization: 'Basic dXNlcm5hbWU6cGFzc3dvcmQ='
  //   })
  // };
  // const uploadvar = {
  //   callType: 'post',
  //   chContext: {
  //     CLASS: classname,
  //     METHOD: methodname,
  //     TOKEN: "BK175mqMN0"
  //   },
  //   chData: lclobj
  // };
  // return this.http
  //   .post<any>(BASE_POST, uploadvar, httpOptions).pipe(
  //     map(data => {
  //       return (data && data.d && data.d.exResult) ? JSON.parse(JSON.parse(data.d.exResult)) : data
  //     })
  //   )

}
  /*******postGen******************************************************* */
  postGEN(lclobj: any, methodname: string, classname: string = "PSTRACKER") {
    const BASE_POST = this.devprod == 'PROD' ? 'https://io.bidvestfm.co.za/BIDVESTFM_API_GEN_PROD/genpost'
    : 'https://io.bidvestfm.co.za/BIDVESTFM_API_GEN/genpost';
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Basic dXNlcm5hbWU6cGFzc3dvcmQ='
      })
    };
    const uploadvar = {
      callType: 'post',
      chContext: {
        CLASS: classname,
        METHOD: methodname,
        TOKEN: "BK175mqMN0"
      },
      chData: lclobj
    };
    return this.http
      .post<any>(BASE_POST, uploadvar, httpOptions).pipe(
        map(data => {
          return (data && data.d && data.d.exResult) ? JSON.parse(JSON.parse(data.d.exResult)) : data
        })
      )

  }

getBlankuser() {
    return {
    EMAIL: '',
    CELLNO: '',
    VENDOR: '',
    NAME: '',
    TOKEN: '',
    USERNAME:'',
    VENDORS: '',
  }}

}