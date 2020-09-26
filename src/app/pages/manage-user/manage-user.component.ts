import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonServiceService } from "src/app/core/services/common-service.service";
import { UserModel } from "src/app/models/user.model";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { HttpErrorResponse } from '@angular/common/http';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ToastrManager } from 'ng6-toastr-notifications';
declare var jQuery: any;
import Swal from 'sweetalert2';
import * as moment from 'moment';

@Component({
  selector: 'app-manage-user',
  templateUrl: './manage-user.component.html',
  styleUrls: ['./manage-user.component.css']
})
export class ManageUserComponent implements OnInit {
  frmUser: FormGroup;
  user: UserModel;
  subscription: any;
  p =1;
  submitted = false;
  textSearch = '';
  users: [];
  selectedFile = null;
@ViewChild('addUser', {static: false}) public addUser: ModalDirective;

constructor(private commonService: CommonServiceService, private formBuilder: FormBuilder, private toaster: ToastrManager) { }


  ngOnInit() {
    this.frmUser =  this.formBuilder.group({
      _id: [0],
      userName: ['', Validators.required],
      password: ['', Validators.required],
    });
    this.getUsers();
  }

   //POST package
   onSubmit(){
    this.submitted = true;
    if (this.frmUser.invalid) {
      this.toaster.warningToastr('Please enter mendatory fields.', 'Invalid!', {showCloseButton: true});
         return;
     }
     this.user = this.frmUser.value;
     if(this.user._id == null){
      this.subscription = this.commonService.saveUser(this.user).subscribe((response: any) => {
      if (response.status) {
       this.toaster.successToastr('User saved successfully. ', 'Success!',{showCloseButton: true});
       this.getUsers();
       jQuery('#addUser').modal('hide');
      //  this.getpackage();
      } else {
      this.toaster.errorToastr('Error while saving sale.', 'Oops!',{showCloseButton: true});

      }
    }, (error: HttpErrorResponse) => {
      this.toaster.errorToastr('Error while saving sale.', 'Oops!',{showCloseButton: true});
      return;
    });
  }
  else{
    this.subscription = this.commonService.updateUser(this.user._id, this.user).subscribe((response: any) => {
      if (response.status) {
       this.toaster.successToastr('Sales updated successfully. ', 'Success!',{showCloseButton: true});
       this.getUsers();
       jQuery('#addUser').modal('hide');
      //  this.getpackage();
      } else {
      this.toaster.errorToastr('Error while saving sale.', 'Oops!',{showCloseButton: true});

      }
    }, (error: HttpErrorResponse) => {
      this.toaster.errorToastr('Error while saving sale.', 'Oops!',{showCloseButton: true});
      return;
    });
  }
  }
  get f() { return this.frmUser.controls; }


//Edit package
editUser(data: UserModel){
  this.frmUser.controls.userName.setValue(data.userName);
  this.frmUser.controls.password.setValue(data.password);
  this.frmUser.controls._id.setValue(data._id);
 }

 //Delete package
deleteUser(id){
  Swal.fire({
    title: 'Are you sure?',
    text: 'You will not be able to recover this record!',
    icon: 'warning',
    showCancelButton: true,
    cancelButtonColor: '#d33',
    confirmButtonText: 'Delete',
    cancelButtonText: 'Cancel'
  })
  .then((result) => {
    if (result.value) {

  this.commonService.deleteUser(id).subscribe((response : any)=>{
    if (response.status) {
      this.toaster.successToastr('Deleted successfully. ', 'Success!',{showCloseButton: true});
      this.getUsers();
    }else {
      this.toaster.errorToastr('Error while deleting sale.', 'Oops!',{showCloseButton: true});
      }
    }, (error: HttpErrorResponse) => {
      this.toaster.errorToastr('Error while deleting sale.', 'Oops!',{showCloseButton: true});
      return;
    });
  }});
}
   //GET users
 getUsers(){
  this.commonService.getUsers().subscribe((response : any)=>{
    if (response.status) {
    this.users = response.data;
    }else {
      this.toaster.errorToastr('No user found!.', 'Oops!',{showCloseButton: true});
      }
    }, (error: HttpErrorResponse) => {
      this.toaster.errorToastr('No user found!.', 'Oops!',{showCloseButton: true});
      return;
    });
}

 // clear form value
 clearForm() {
  this.frmUser.reset();
  this.submitted = false;
}
}
