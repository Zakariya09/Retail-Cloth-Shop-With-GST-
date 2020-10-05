import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonServiceService } from "src/app/core/services/common-service.service";
import { CreditModel } from "src/app/models/credit.model";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { HttpErrorResponse } from '@angular/common/http';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ToastrManager } from 'ng6-toastr-notifications';
declare var jQuery: any;
import Swal from 'sweetalert2';
import * as moment from 'moment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-receipt',
  templateUrl: './add-receipt.component.html',
  styleUrls: ['./add-receipt.component.css']
})
export class AddReceiptComponent implements OnInit {
  frmCredit: FormGroup;
  frmReicipt: FormGroup;
  credit: CreditModel;
  subscription: any;
  gst;
  p =1;
  submitted = false;
  textSearch = '';
  credits: [];

  selectedFile = null;
@ViewChild('addProject', {static: false}) public addProject: ModalDirective;
constructor(private commonService: CommonServiceService,
   private formBuilder: FormBuilder,
    private toaster: ToastrManager,
    private router: Router
    ) { }

  ngOnInit() {
    this.frmCredit =  this.formBuilder.group({
      _id: [0],
      date: [, Validators.required],
      name: [, Validators.required],
      creditAmount: [0, Validators.required],
      paidAmount: [0, Validators.required],
      remainingAmount: [0, Validators.required]
    });

    this.frmReicipt = this.formBuilder.group({
      customerName: ["", Validators.required],
      receiptDate: ["", Validators.required],
      gst:[0],
      cgst:[0],
      sgst:[0],
      igst:[0],
      tax:[0],
      productName:[null],
      quantity:[""],
      rate:[""]
    });
  this.getCredits();
  }

  claculateGST = function(){
    this.frmReicipt.get('tax').value =  ( this.frmReicipt.get('gst').value / 2) ;
    console.log(this.frmReicipt.get('tax').value);
    if(!isNaN(this.frmReicipt.get('tax').value)){
    this.frmReicipt.get('cgst').setValue(this.frmReicipt.get('tax').value);
    this.frmReicipt.get('sgst').setValue(this.frmReicipt.get('tax').value);
  }
}

  backToReceipt(){
   this.router.navigate(['default/receipt']);
  }

   //POST package
   onSubmit(){
    this.submitted = true;
    if (this.frmCredit.invalid) {
      this.toaster.warningToastr('Please enter mendatory fields.', 'Invalid!', {showCloseButton: true});
         return;
     }
     this.credit = this.frmCredit.value;
     if(this.credit._id == null){
     this.credit.date = moment(this.frmCredit.value.date).format('DD-MM-YYYY') ;
      this.subscription = this.commonService.saveCredit(this.credit).subscribe((response: any) => {
      if (response.status) {
       this.toaster.successToastr('Data saved successfully. ', 'Success!',{showCloseButton: true});
       this.getCredits();
       jQuery('#addCredit').modal('hide');
      //  this.getpackage();
      } else {
      this.toaster.errorToastr('Error while saving credit.', 'Oops!',{showCloseButton: true});

      }
    }, (error: HttpErrorResponse) => {
      this.toaster.errorToastr('Error while saving credit.', 'Oops!',{showCloseButton: true});
      return;
    });
  }
  else{
    this.credit.date = moment(this.frmCredit.value.date).format('DD-MM-YYYY') ;
    this.subscription = this.commonService.updateCredit(this.credit._id, this.credit).subscribe((response: any) => {
      if (response.status) {
       this.toaster.successToastr('Sales updated successfully. ', 'Success!',{showCloseButton: true});
       this.getCredits();
       jQuery('#addCredit').modal('hide');
      //  this.getpackage();
      } else {
      this.toaster.errorToastr('Error while saving credit.', 'Oops!',{showCloseButton: true});

      }
    }, (error: HttpErrorResponse) => {
      this.toaster.errorToastr('Error while saving credit.', 'Oops!',{showCloseButton: true});
      return;
    });
  }
  }
  get f() { return this.frmCredit.controls; }


  //GET credits
 getCredits(){
  this.commonService.getCredits().subscribe((response : any)=>{
    if (response.status) {
    this.credits = response.data;
    }else {
      this.toaster.errorToastr('No credit found!.', 'Oops!',{showCloseButton: true});
      }
    }, (error: HttpErrorResponse) => {
      this.toaster.errorToastr('No credit found!.', 'Oops!',{showCloseButton: true});
      return;
    });
}
//Edit package
editCredit(data: CreditModel){
  this.frmCredit.controls.date.setValue(this.dateConverter(data.date));
  this.frmCredit.controls.name.setValue(data.name);
  this.frmCredit.controls.creditAmount.setValue(data.creditAmount);
  this.frmCredit.controls.paidAmount.setValue(data.paidAmount);
  this.frmCredit.controls.remainingAmount.setValue(data.remainingAmount);
  this.frmCredit.controls._id.setValue(data._id);
 }

 //Delete package
deleteCredit(id){
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

  this.commonService.deleteCredit(id).subscribe((response : any)=>{
    if (response.status) {
      this.toaster.successToastr('Deleted successfully. ', 'Success!',{showCloseButton: true});
      this.getCredits();
    }else {
      this.toaster.errorToastr('Error while deleting credit.', 'Oops!',{showCloseButton: true});
      }
    }, (error: HttpErrorResponse) => {
      this.toaster.errorToastr('Error while deleting credit.', 'Oops!',{showCloseButton: true});
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
  this.frmCredit.reset();
  this.submitted = false;
}
}
