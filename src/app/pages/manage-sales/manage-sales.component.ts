import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonServiceService } from "src/app/core/services/common-service.service";
import { SaleModel } from "src/app/models/sale.model";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { HttpErrorResponse } from '@angular/common/http';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ToastrManager } from 'ng6-toastr-notifications';
declare var jQuery: any;
import Swal from 'sweetalert2';
import * as moment from 'moment';

@Component({
  selector: 'app-manage-sales',
  templateUrl: './manage-sales.component.html',
  styleUrls: ['./manage-sales.component.css']
})
export class ManageSalesComponent implements OnInit {
  frmSale: FormGroup;
  sale: SaleModel;
  subscription: any;
  p =1;
  submitted = false;
  textSearch = '';
  sales: [];
  selectedFile = null;
@ViewChild('addProject', {static: false}) public addProject: ModalDirective;

constructor(private commonService: CommonServiceService, private formBuilder: FormBuilder, private toaster: ToastrManager) { }

  ngOnInit() {
    this.frmSale =  this.formBuilder.group({
      _id: [0],
      date: ['', Validators.required],
      actualAmount: [0, Validators.required],
      saleAmount: [0, Validators.required],
      profitAmount: [0, Validators.required]
    });
    this.getSales();
  }

    //POST package
    onSubmit(){
      this.submitted = true;
      if (this.frmSale.invalid) {
        this.toaster.warningToastr('Please enter mendatory fields.', 'Invalid!', {showCloseButton: true});
           return;
       }
       this.sale = this.frmSale.value;
       if(this.sale._id == null){
       this.sale.date = moment(this.frmSale.value.date).format('DD-MM-YYYY') ;
        this.subscription = this.commonService.saveSale(this.sale).subscribe((response: any) => {
        if (response.status) {
         this.toaster.successToastr('Data saved successfully. ', 'Success!',{showCloseButton: true});
         this.getSales();
         jQuery('#addSale').modal('hide');
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
      this.sale.date = moment(this.frmSale.value.date).format('DD-MM-YYYY') ;
      this.subscription = this.commonService.updateSale(this.sale._id, this.sale).subscribe((response: any) => {
        if (response.status) {
         this.toaster.successToastr('Sales updated successfully. ', 'Success!',{showCloseButton: true});
         this.getSales();
         jQuery('#addSale').modal('hide');
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
    get f() { return this.frmSale.controls; }


//Edit package
 editImport(data: SaleModel){
  this.frmSale.controls.date.setValue(this.dateConverter(data.date));
  this.frmSale.controls.actualAmount.setValue(data.actualAmount);
  this.frmSale.controls.saleAmount.setValue(data.saleAmount);
  this.frmSale.controls.profitAmount.setValue(data.profitAmount);
  this.frmSale.controls._id.setValue(data._id);
 }

 //GET sales
 getSales(){
  this.commonService.getSales().subscribe((response : any)=>{
    if (response.status) {
    this.sales = response.data;
    }else {
      this.toaster.errorToastr('No sale found!.', 'Oops!',{showCloseButton: true});
      }
    }, (error: HttpErrorResponse) => {
      this.toaster.errorToastr('No sale found!.', 'Oops!',{showCloseButton: true});
      return;
    });
}

//Delete package
deleteSale(id){
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

  this.commonService.deleteSale(id).subscribe((response : any)=>{
    if (response.status) {
      this.toaster.successToastr('Deleted successfully. ', 'Success!',{showCloseButton: true});
      this.getSales();
    }else {
      this.toaster.errorToastr('Error while deleting sale.', 'Oops!',{showCloseButton: true});
      }
    }, (error: HttpErrorResponse) => {
      this.toaster.errorToastr('Error while deleting sale.', 'Oops!',{showCloseButton: true});
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
  this.frmSale.reset();
  this.submitted = false;
}
}
