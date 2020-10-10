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
  frmReiceipt: FormGroup;
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

      this.frmReiceipt = this.formBuilder.group({
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
      this.frmReiceipt.get('receiptDate').setValue(this.today);
    }

    claculateGST = function(){
      this.frmReiceipt.get('tax').value =  ( this.frmReiceipt.get('gst').value / 2) ;
      console.log(this.frmReiceipt.get('tax').value);
      if(!isNaN(this.frmReiceipt.get('tax').value)){
        this.frmReiceipt.get('cgst').setValue(this.frmReiceipt.get('tax').value);
        this.frmReiceipt.get('sgst').setValue(this.frmReiceipt.get('tax').value);
      }
    }

    calc(){
      if(this.frmReiceipt.get('productName').value == '' || this.frmReiceipt.get('productName').value == undefined || this.frmReiceipt.get('productName').value  <= 0){
        this.toaster.warningToastr('Please select product!', 'Invalid!', {showCloseButton: true});
        return;
      }
      if(this.frmReiceipt.get('quantity').value == '' || this.frmReiceipt.get('quantity').value == undefined || this.frmReiceipt.get('quantity').value  <= 0){
        this.toaster.warningToastr('Quantity should be more than zero!', 'Invalid!', {showCloseButton: true});
        return;
      }
      if(this.frmReiceipt.get('rate').value == '' || this.frmReiceipt.get('rate').value == undefined || this.frmReiceipt.get('rate').value  <= 0){
        this.toaster.warningToastr('Rate should be more than zero!', 'Invalid!', {showCloseButton: true});
        return;
      }
      this.frmReiceipt.get('receiptDate').setValue(this.today);
      this.invoice.customerName = this.frmReiceipt.get('customerName').value;
      this.custName = this.frmReiceipt.get('customerName').value;
      this.invoice.quantity = this.frmReiceipt.get('quantity').value;
      this.invoice.receiptDate = this.frmReiceipt.get('receiptDate').value;
      this.invoice.rate = this.frmReiceipt.get('rate').value;
      this.invoice.customerName = this.frmReiceipt.get('customerName').value;
      this.invoice.productName = this.frmReiceipt.get('productName').value;
      this.invoice.taxableAmount =  this.invoice.rate  * this.invoice.quantity;
      this.taxableAmountSum += this.invoice.taxableAmount;
      this.invoice.gst = this.frmReiceipt.get('gst').value;
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
      this.frmReiceipt.reset();
      this.submitted = false;
      this.frmReiceipt.get('receiptDate').setValue(this.today);
      this.frmReiceipt.get('customerName').setValue(this.custName);
      this.frmReiceipt.get('gst').setValue(this.invoice.gst);
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
      this.frmReiceipt.get('customerName').setValue(data.customerName);
      this.frmReiceipt.get('productName').setValue(data.productName);
      this.frmReiceipt.get('receiptDate').setValue(data.receiptDate);
      this.frmReiceipt.get('rate').setValue(data.rate);
      this.frmReiceipt.get('quantity').setValue(data.quantity);
      this.frmReiceipt.get('gst').setValue(data.gst);
      this.frmReiceipt.get('cgst').setValue(data.cgst);
      this.frmReiceipt.get('sgst').setValue(data.sgst);
      this.frmReiceipt.get('igst').setValue(data.igst);
      this.frmReiceipt.get('igst').setValue(data.igst);

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
