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
  frmReceipt: FormGroup;
  credit: CreditModel;
  receipt = {
    _id:'',
    name: '',
    mobileNumber:'',
    receiptDate:'',
    taxableAmount:0,
    cgst: 0,
    sgst: 0,
    grandTotal:0,
    products: []
  };
  subscription: any;
  grandTotal = 0;
  mobileNumber;
  today;
  custName;
  rcDate;
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
      this.frmReceipt = this.formBuilder.group({
        customerName: ["", Validators.required],
        receiptDate: ["", Validators.required],
        mobileNumber: [""],
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

    //Set Current Day Date to the receipt date
    getDate(){
      this.today = new Date();
      this.frmReceipt.get('receiptDate').setValue(this.today);
    }

    //GST SUM calculation Start
    claculateGST = function(){
      this.frmReceipt.get('tax').value =  ( this.frmReceipt.get('gst').value / 2) ;
      console.log(this.frmReceipt.get('tax').value);
      if(!isNaN(this.frmReceipt.get('tax').value)){
        this.frmReceipt.get('cgst').setValue(this.frmReceipt.get('tax').value);
        this.frmReceipt.get('sgst').setValue(this.frmReceipt.get('tax').value);
      }
    }

    //GST calculation Start
    calc(){
      if(this.frmReceipt.get('productName').value == '' || this.frmReceipt.get('productName').value == undefined || this.frmReceipt.get('productName').value  <= 0){
        this.toaster.warningToastr('Please select product!', 'Invalid!', {showCloseButton: true});
        return;
      }
      if(this.frmReceipt.get('quantity').value == '' || this.frmReceipt.get('quantity').value == undefined || this.frmReceipt.get('quantity').value  <= 0){
        this.toaster.warningToastr('Quantity should be more than zero!', 'Invalid!', {showCloseButton: true});
        return;
      }
      if(this.frmReceipt.get('rate').value == '' || this.frmReceipt.get('rate').value == undefined || this.frmReceipt.get('rate').value  <= 0){
        this.toaster.warningToastr('Rate should be more than zero!', 'Invalid!', {showCloseButton: true});
        return;
      }
      this.frmReceipt.get('receiptDate').setValue(this.today);
      this.mobileNumber = this.frmReceipt.get('mobileNumber').value;
      this.invoice.customerName = this.frmReceipt.get('customerName').value;
      this.custName = this.frmReceipt.get('customerName').value;
      this.rcDate = this.frmReceipt.get('receiptDate').value;
      this.invoice.quantity = this.frmReceipt.get('quantity').value;
      this.invoice.receiptDate = this.frmReceipt.get('receiptDate').value;
      this.invoice.rate = this.frmReceipt.get('rate').value;
      this.invoice.customerName = this.frmReceipt.get('customerName').value;
      this.invoice.productName = this.frmReceipt.get('productName').value;
      this.invoice.taxableAmount =  this.invoice.rate  * this.invoice.quantity;
      this.taxableAmountSum += this.invoice.taxableAmount;
      this.invoice.gst = this.frmReceipt.get('gst').value;
      if(this.invoice.gst == undefined || this.invoice.gst == null){
        this.invoice.cgst = 0;
        this.invoice.sgst = 0;
        this.invoice.gst = 0;
      }
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
      this.frmReceipt.reset();
      this.submitted = false;
      this.frmReceipt.get('receiptDate').setValue(this.today);
      this.frmReceipt.get('customerName').setValue(this.custName);
      this.frmReceipt.get('mobileNumber').setValue(this.mobileNumber);
      this.frmReceipt.get('gst').setValue(this.invoice.gst);
    }

    backToReceipt(){
      this.router.navigate(['default/receipt']);
    }

    //POST package
    onSubmit(){
      this.receipt.name = this.custName;
      this.receipt.receiptDate = this.rcDate ;
      this.receipt.taxableAmount = this.taxableAmountSum;
      this.receipt.cgst = this.cgstSum;
      this.receipt.sgst = this.sgstSum;
      this.receipt.grandTotal = this.grandTotal;
      this.receipt.products = this.invoiceArray;
      this.receipt.mobileNumber = this.mobileNumber

      console.log(this.receipt);

      this.submitted = true;
      if (this.frmReceipt.invalid) {
        this.toaster.warningToastr('Please enter mendatory fields.', 'Invalid!', {showCloseButton: true});
        return;
      }
      if(this.receipt._id == ''){
        console.log('inside save');
        this.receipt.receiptDate = moment(this.frmReceipt.value.date).format('DD-MM-YYYY') ;
        this.subscription = this.commonService.saveReceipt(this.receipt).subscribe((response: any) => {
          if (response.status) {
            this.toaster.successToastr('Receipt saved successfully. ', 'Success!',{showCloseButton: true});
            this.receipt = {
              _id:'',
              name: '',
              mobileNumber:'',
              receiptDate:'',
              taxableAmount:0,
              cgst: 0,
              sgst: 0,
              grandTotal:0,
              products: []
            };
            this.taxableAmountSum =0;
            this.cgstSum = 0;
            this.sgstSum = 0;
            this.grandTotal = 0
            this.invoiceArray=[];
            this.frmReceipt.reset();
            this.submitted =false;
            // this.getCredits();
            // jQuery('#addCredit').modal('hide');
            //  this.getpackage();
          } else {
            this.toaster.errorToastr('Error while saving receipt.', 'Oops!',{showCloseButton: true});

          }
        }, (error: HttpErrorResponse) => {
          this.toaster.errorToastr('Error while saving credit.', 'Oops!',{showCloseButton: true});
          return;
        });
      }
      else{
        console.log('inside update');
        this.receipt.receiptDate = moment(this.frmReceipt.value.date).format('DD-MM-YYYY') ;
        this.subscription = this.commonService.updateCredit(this.receipt._id, this.receipt).subscribe((response: any) => {
          if (response.status) {
            this.toaster.successToastr('Sales updated successfully. ', 'Success!',{showCloseButton: true});
            // this.getCredits();
            this.receipt = {
              _id:'',
              name: '',
              mobileNumber:'',
              receiptDate:'',
              taxableAmount:0,
              cgst: 0,
              sgst: 0,
              grandTotal:0,
              products: []
            };
            this.frmReceipt.reset();
            this.submitted =false
            this.invoiceArray=[];
          } else {
            this.toaster.errorToastr('Error while saving receipt.', 'Oops!',{showCloseButton: true});
          }
        }, (error: HttpErrorResponse) => {
          this.toaster.errorToastr('Error while saving receipt.', 'Oops!',{showCloseButton: true});
          return;
        });
      }
    }
    get f() { return this.frmReceipt.controls; }


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
      this.frmReceipt.get('customerName').setValue(data.customerName);
      this.frmReceipt.get('productName').setValue(data.productName);
      this.frmReceipt.get('receiptDate').setValue(data.receiptDate);
      this.frmReceipt.get('rate').setValue(data.rate);
      this.frmReceipt.get('quantity').setValue(data.quantity);
      this.frmReceipt.get('gst').setValue(data.gst);
      this.frmReceipt.get('cgst').setValue(data.cgst);
      this.frmReceipt.get('sgst').setValue(data.sgst);
      this.frmReceipt.get('igst').setValue(data.igst);
      this.frmReceipt.get('igst').setValue(data.igst);

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
        console.log(data);
        this.invoiceArray.splice(index,1);
        this.grandTotal = this.grandTotal - data.total;
        this.taxableAmountSum = this.taxableAmountSum - data.taxableAmount;
        this.cgstSum = this.cgstSum - data.cgst;
        this.sgstSum = this.sgstSum - data.sgst;
      }

      // clear form value
      clearForm() {
        this.frmReceipt.reset();
        this.submitted = false;
      }
    }
