import { Component, createPlatform, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogModule} from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { AuthserviceService } from '../../_services/authservice.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule,MatProgressSpinnerModule,MatDialogModule, MatFormFieldModule, FormsModule, ReactiveFormsModule, MatInputModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})


export class LoginComponent implements OnInit {
longtext = '';
register = false;
// awaiting = false;
// loading  = false;
emailregex: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
otpgroup :FormGroup  = this.formBuilder.group({
  email: [null, [ Validators.pattern(this.emailregex)]],
  sms: [null, [ Validators.pattern(/^\d+$/)]]
})
otpgroupin :FormGroup =   this.formBuilder.group({
  otp: [null]
});
  constructor(
  //  public dialog: MatDialog, 
    public authserv: AuthserviceService,private formBuilder: FormBuilder ) { }

  ngOnInit(): void {
    this.createForm();
  }
  createForm() {
    
  }
getOTP(){
let tf = this.otpgroup.value;
this.authserv.getOTP(tf.email, tf.sms) ;
}
confirmOTP() {
  let tf = this.otpgroup.value;
  this.authserv.confirmOTP(tf.email, tf.sms,this.otpgroupin.value.otp)
}
}
