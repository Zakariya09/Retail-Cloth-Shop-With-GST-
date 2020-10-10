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
  grandTotal = 0;
  today;
  custName;
  taxableAmountSum = 0;
  sgstSum = 0;
  cgstSum = 0;
  gst;
  p =1;
  invoiceArray = [];
  invoice = {
    customerName: '',
    productName: '',
    quantity:0,
    receiptDate:'',
    rate: 0,
    taxableAmount:0,
    gst: 0,
    cgst:0,
    sgst:0,
    igst: 0,
    total:0
  }
  submitted = false;
  textSearch = '';
  credits: [];
  products: [];

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
      this.getProducts();
      this.getDate();
    }
    getDate(){
      this.today = new Date();
      this.frmReicipt.get('receiptDate').setValue(this.today);
    }

    claculateGST = function(){
      this.frmReicipt.get('tax').value =  ( this.frmReicipt.get('gst').value / 2) ;
      console.log(this.frmReicipt.get('tax').value);
      if(!isNaN(this.frmReicipt.get('tax').value)){
        this.frmReicipt.get('cgst').setValue(this.frmReicipt.get('tax').value);
        this.frmReicipt.get('sgst').setValue(this.frmReicipt.get('tax').value);
      }
    }

    calc(){
      if(this.frmReicipt.get('quantity').value == '' || this.frmReicipt.get('quantity').value == undefined || this.frmReicipt.get('quantity').value  <= 0){
        this.toaster.warningToastr('Quantity should be more than zero!', 'Invalid!', {showCloseButton: true});
        return;
      }
      if(this.frmReicipt.get('rate').value == '' || this.frmReicipt.get('rate').value == undefined || this.frmReicipt.get('rate').value  <= 0){
        this.toaster.warningToastr('Rate should be more than zero!', 'Invalid!', {showCloseButton: true});
        return;
      }
      this.frmReicipt.get('receiptDate').setValue(this.today);
      this.invoice.customerName = this.frmReicipt.get('customerName').value;
      this.custName = this.frmReicipt.get('customerName').value;
      this.invoice.quantity = this.frmReicipt.get('quantity').value;
      this.invoice.receiptDate = this.frmReicipt.get('receiptDate').value;
      this.invoice.rate = this.frmReicipt.get('rate').value;
      this.invoice.customerName = this.frmReicipt.get('customerName').value;
      this.invoice.productName = this.frmReicipt.get('productName').value;
      this.invoice.taxableAmount =  this.invoice.rate  * this.invoice.quantity;
      this.taxableAmountSum += this.invoice.taxableAmount;
      this.invoice.gst = this.frmReicipt.get('gst').value;
      if(this.invoice.gst == undefined || this.invoice.gst == null){
        this.invoice.cgst = 0;
        this.invoice.sgst = 0;
        this.invoice.gst = 0;
      }
      console.log(this.invoice.taxableAmount);
      let total = this.invoice.taxableAmount;
      let totalTaxAmount = (total * this.invoice.gst) / 100;
      this.invoice.cgst = totalTaxAmount / 2;
      this.invoice.sgst = totalTaxAmount / 2;
      this.cgstSum +=  this.invoice.cgst;
      this.sgstSum +=  this.invoice.cgst;
      if(isNaN(this.cgstSum)){
        this.cgstSum = 0;
        this.sgstSum = 0;
      }
      this.invoice.total = this.invoice.taxableAmount + this.invoice.cgst + this.invoice.sgst;
      this.invoice.total = parseInt(this.invoice.total.toFixed(2));
      this.grandTotal += this.invoice.total;
      this.invoiceArray.push(this.invoice);
      this. invoice = {
        customerName: '',
        productName: '',
        quantity:0,
        receiptDate:'',
        rate: 0,
        taxableAmount:0,
        gst: this.invoice.gst,
        cgst:0,
        sgst:0,
        igst: 0,
        total:0
      }
      console.log(this.invoiceArray)
      this.frmReicipt.reset();
      this.submitted = false;
      this.frmReicipt.get('receiptDate').setValue(this.today);
      this.frmReicipt.get('customerName').setValue(this.custName);
      this.frmReicipt.get('gst').setValue(this.invoice.gst);
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
            // this.getCredits();
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
            // this.getCredits();
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


    //GET project
    getProducts(){
      this.commonService.getProducts().subscribe((response : any)=>{
        if (response.status) {
          this.products = response.products;
        }else {
          this.toaster.errorToastr('No product found!.', 'Oops!',{showCloseButton: true});
        }
      }, (error: HttpErrorResponse) => {
        this.toaster.errorToastr('No product found!.', 'Oops!',{showCloseButton: true});
        return;
      });
    }

    //Edit invoiceRow
    editinvoiceRow(index, data){
      console.log(data);
      this.grandTotal -= data.total;
      this.invoiceArray.splice(index,1);
      if(!this.invoiceArray.length){
        this.grandTotal = 0;
      }
      this.frmReicipt.get('customerName').setValue(data.customerName);
      this.frmReicipt.get('productName').setValue(data.productName);
      this.frmReicipt.get('receiptDate').setValue(data.receiptDate);
      this.frmReicipt.get('rate').setValue(data.rate);
      this.frmReicipt.get('quantity').setValue(data.quantity);
      this.frmReicipt.get('gst').setValue(data.gst);
      this.frmReicipt.get('cgst').setValue(data.cgst);
      this.frmReicipt.get('sgst').setValue(data.sgst);
      this.frmReicipt.get('igst').setValue(data.igst);
      this.frmReicipt.get('igst').setValue(data.igst);

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
              // this.getCredits();
            }else {
              this.toaster.errorToastr('Error while deleting credit.', 'Oops!',{showCloseButton: true});
            }
          }, (error: HttpErrorResponse) => {
            this.toaster.errorToastr('Error while deleting credit.', 'Oops!',{showCloseButton: true});
            return;
          });
        }});
      }

      //Package Date Conversion
      dateConverter(date){
        var dateArray = date.split('-');
        var dateStr = dateArray[1] + '/' + dateArray[0] + '/' + dateArray[2];
        var newDate = new Date( dateStr);
        return newDate;
      }

      removeRow(index, data){
        this.invoiceArray.splice(index,1);
        this.grandTotal = this.grandTotal - data.total;
      }

      // clear form value
      clearForm() {
        this.frmCredit.reset();
        this.submitted = false;
      }
    }
