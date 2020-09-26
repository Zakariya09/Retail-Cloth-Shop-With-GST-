import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonServiceService  } from "src/app/core/services/common-service.service";
import { ToastrManager } from 'ng6-toastr-notifications';
import { AuthService } from "src/app/auth/auth.service";
declare var $:any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  submitted: boolean;
  subscription: any;
  frmLogin: FormGroup;
  userData = {};
  login = {};

  constructor(private router: Router, private formBuilder: FormBuilder, private commonService: CommonServiceService, private toastr: ToastrManager, private auth: AuthService) { }
  ngOnInit() {
    this.frmLogin = this.formBuilder.group({
      userName: ['', Validators.required],
      password: ['', Validators.required],
    });
  }
onSubmit(){
  this.submitted = true;
    this.login = this.frmLogin.value;
    if (this.frmLogin.invalid) {
      this.toastr.warningToastr('Please enter username & password fields.', 'Invalid!', {showCloseButton: true});
      return;
    }
    this.subscription = this.auth.validate(this.login).subscribe((response: any) =>{
      if (response.status) {
    this.userData = response;
    localStorage.setItem('user', JSON.stringify( this.userData ));
    this.toastr.successToastr('Login', 'Success!', {showCloseButton: true});
    this.router.navigate(['/default/dashboard']);
      }else {
        this.toastr.errorToastr('Invalid username or password!', 'Oops!', {showCloseButton: true});
        return
        }
      }, (error: HttpErrorResponse) => {
             this.toastr.errorToastr('Invalid username or password!', 'Oops!', {showCloseButton: true});
        return;
      });
}
get f() { return this.frmLogin.controls; }

}
