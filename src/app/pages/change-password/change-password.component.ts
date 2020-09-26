import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  submitted = false;
  public val = null;

frmChangePassword: FormGroup;
  constructor( private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.frmChangePassword = this.formBuilder.group({
      currentPassword: [ , Validators.required],
      newPassWord: [, Validators.required],
      confirmPassWord: [, Validators.required],
    });
  }
  // convenience getter for easy access to form fields
  get f() { return this.frmChangePassword.controls; }

  onSubmit(): void {
    this.submitted = true;
    // stop here if form is invalid
    if (this.frmChangePassword.invalid) {
      return;
  }
  }
}
