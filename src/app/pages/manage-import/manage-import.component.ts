import { CommonServiceService } from "src/app/core/services/common-service.service";
import { ImportModel } from "src/app/models/import.model";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { HttpErrorResponse } from '@angular/common/http';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrManager } from 'ng6-toastr-notifications';
import * as moment from 'moment';
import Swal from 'sweetalert2';

declare var jQuery: any;

@Component({
  selector: 'app-manage-import',
  templateUrl: './manage-import.component.html',
  styleUrls: ['./manage-import.component.css']
})
export class ManageImportComponent implements OnInit {
  frmImport: FormGroup;
  subscription: any;
  p =1;
  submitted = false;
  textSearch = '';
  userData = JSON.parse(localStorage.getItem('user'));
  imports;
  import:ImportModel;
  @ViewChild('addImport', {static: false}) public addImport: ModalDirective;

  constructor(private commonService: CommonServiceService, private formBuilder: FormBuilder, private toaster: ToastrManager) { }

  ngOnInit() {
    this.frmImport =  this.formBuilder.group({
      _id: [0],
      date: ['',Validators.required],
      amount: [, Validators.required],
      description: []
    });
    this.getImports();
  }
   //POST package
   onSubmit(){
    this.submitted = true;
    if (this.frmImport.invalid) {
      this.toaster.warningToastr('Please enter mendatory fields.', 'Invalid!', {showCloseButton: true});
         return;
     }
     this.import = this.frmImport.value;

     if(this.import._id == null){
     this.import.date = moment(this.frmImport.value.date).format('DD-MM-YYYY') ;
      this.subscription = this.commonService.saveImport(this.import).subscribe((response: any) => {
      if (response.status) {
       this.toaster.successToastr('data saved successfully. ', 'Success!',{showCloseButton: true});
       this.getImports();
       jQuery('#addImport').modal('hide');
      //  this.getpackage();
      } else {
      this.toaster.errorToastr('Error while saving package.', 'Oops!',{showCloseButton: true});

      }
    }, (error: HttpErrorResponse) => {
      this.toaster.errorToastr('Error while saving package.', 'Oops!',{showCloseButton: true});
      return;
    });
  }
  else{
    console.log(this.import);
    this.import.date = moment(this.frmImport.value.date).format('DD-MM-YYYY') ;
    this.subscription = this.commonService.updateImport(this.import._id, this.import).subscribe((response: any) => {
      if (response.status) {
       this.toaster.successToastr('Package updated successfully. ', 'Success!',{showCloseButton: true});
       this.getImports();
       jQuery('#addImport').modal('hide');
      //  this.getpackage();
      } else {
      this.toaster.errorToastr('Error while saving package.', 'Oops!',{showCloseButton: true});

      }
    }, (error: HttpErrorResponse) => {
      this.toaster.errorToastr('Error while saving package.', 'Oops!',{showCloseButton: true});
      return;
    });
  }
  }
  get f() { return this.frmImport.controls; }

 //GET package
 getImports(){
  this.commonService.getImports().subscribe((response : any)=>{
    if (response.status) {
    this.imports = response.data;
    }else {
      this.toaster.errorToastr('No data found!.', 'Oops!',{showCloseButton: true});
      }
    }, (error: HttpErrorResponse) => {
      this.toaster.errorToastr('No data found!.', 'Oops!',{showCloseButton: true});
      return;
    });
}
//Edit package
 editImport(data: ImportModel){
  this.frmImport.controls.date.setValue(this.dateConverter(data.date));
  this.frmImport.controls.amount.setValue(data.amount);
  this.frmImport.controls.description.setValue(data.description);
  this.frmImport.controls._id.setValue(data._id);
 }

 //Delete package
 deleteImport(id){
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

  this.commonService.deleteImport(id).subscribe((response : any)=>{
    if (response.status) {
      this.toaster.successToastr('Deleted successfully. ', 'Success!',{showCloseButton: true});
      this.getImports();
    }else {
      this.toaster.errorToastr('Error while deleting import.', 'Oops!',{showCloseButton: true});
      }
    }, (error: HttpErrorResponse) => {
      this.toaster.errorToastr('Error while deleting import.', 'Oops!',{showCloseButton: true});
      return;
    });
  }});
}

//package Date Conversion
dateConverter(date){
  var dateArray = date.split('-');
  var dateStr = dateArray[1] + '/' + dateArray[0] + '/' + dateArray[2];
  var newDate = new Date( dateStr);
  return newDate;
}

 // clear form value
 clearForm() {
  this.frmImport.reset();
  this.submitted = false;
}
}
