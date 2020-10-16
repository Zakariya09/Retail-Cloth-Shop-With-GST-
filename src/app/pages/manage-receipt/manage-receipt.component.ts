import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonServiceService } from "src/app/core/services/common-service.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { HttpErrorResponse } from '@angular/common/http';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ToastrManager } from 'ng6-toastr-notifications';
declare var jQuery: any;
import Swal from 'sweetalert2';
import * as moment from 'moment';
import { Router } from '@angular/router';


@Component({
  selector: 'app-manage-receipt',
  templateUrl: './manage-receipt.component.html',
  styleUrls: ['./manage-receipt.component.css']
})
export class ManageReceiptComponent implements OnInit {
  frmreceipt: FormGroup;
  subscription: any;
  p =1;
  receiptData = {
    name:'',
    taxableAmount:0,
    totalInWords: '',
    mobileNumber:'',
    igst:0,
    cgst:0,
    sgst: 0,
    receiptDate:'',
    grandTotal:0,
    products: []
  };
  submitted = false;
  textSearch = '';
  receipts: [];
  selectedFile = null;
@ViewChild('addProject', {static: false}) public addProject: ModalDirective;
constructor(private commonService: CommonServiceService,
   private formBuilder: FormBuilder,
    private toaster: ToastrManager,
    private router: Router
    ) { }

  ngOnInit() {
    this.frmreceipt =  this.formBuilder.group({
      _id: [0],
      date: [, Validators.required],
      name: [, Validators.required],
      receiptAmount: [0, Validators.required],
      paidAmount: [0, Validators.required],
      remainingAmount: [0, Validators.required]
    });
  this.getReceipt();
  }

  addReceipt(){
   this.router.navigate(['default/addReceipt']);
   localStorage.clear();
  }


  get f() { return this.frmreceipt.controls; }


  //GET receipts
 getReceipt(){
  this.commonService.getReceipt().subscribe((response : any)=>{
    if (response.status) {
    this.receipts = response.data;
    }else {
      this.toaster.errorToastr('No receipt found!.', 'Oops!',{showCloseButton: true});
      }
    }, (error: HttpErrorResponse) => {
      this.toaster.errorToastr('No receipt found!.', 'Oops!',{showCloseButton: true});
      return;
    });
}
//Edit package
editReceipt(data){
  localStorage.setItem('receipt', JSON.stringify(data));
  this.router.navigate(['/default/addReceipt']);
 }

 //Delete package
 deleteReceipt(id){
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

  this.commonService.deleteReceipt(id).subscribe((response : any)=>{
    if (response.status) {
      this.toaster.successToastr('Deleted successfully. ', 'Success!',{showCloseButton: true});
      this.getReceipt();
    }else {
      this.toaster.errorToastr('Error while deleting receipt.', 'Oops!',{showCloseButton: true});
      }
    }, (error: HttpErrorResponse) => {
      this.toaster.errorToastr('Error while deleting receipt.', 'Oops!',{showCloseButton: true});
      return;
    });
  }});
 }

 viewRecipt(data){
  this.receiptData = data;
  this.receiptData.totalInWords = this.number2text(data.grandTotal);

  jQuery('#viewReceipt').modal('show');
 }

//package Date Conversion
dateConverter(date){
  var dateArray = date.split('-');
  var dateStr = dateArray[1] + '/' + dateArray[0] + '/' + dateArray[2];
  var newDate = new Date( dateStr);
  return newDate;
}

PrintPanel(div) {
  var divToPrint = document.getElementById(div);
  var htmlToPrint = '' +
  '<style type="text/css">' +
  'table th,td {' +
  'border:1px solid #000;' +
  'padding:0.3em;' +
  'text-align:center;' +
  '};' +
  '</style>';
  htmlToPrint += divToPrint.outerHTML;
  let newWin = window.open(`/default/receipt`);
  newWin.document.write(htmlToPrint);
  newWin.print();
  newWin.close();
}

   //Convert Number to To Text
   number2text(value) {
    var fraction = Math.round(this.frac(value)*100);
    var f_text  = "";

    if(fraction > 0) {
      f_text = "And "+ this.convert_number(fraction)+" Paise";
    }

    return this.convert_number(value)+" Rupee "+f_text+" Only";
  }

  frac(f) {
    return f % 1;
  }

  convert_number(number)
  {
    if ((number < 0) || (number > 999999999))
    {
      return "NUMBER OUT OF RANGE!";
    }
    var Gn = Math.floor(number / 10000000);  /* Crore */
    number -= Gn * 10000000;
    var kn = Math.floor(number / 100000);     /* lakhs */
    number -= kn * 100000;
    var Hn = Math.floor(number / 1000);      /* thousand */
    number -= Hn * 1000;
    var Dn = Math.floor(number / 100);       /* Tens (deca) */
    number = number % 100;               /* Ones */
    var tn= Math.floor(number / 10);
    var one=Math.floor(number % 10);
    var res = "";

    if (Gn>0)
    {
      res += (this.convert_number(Gn) + " Crore");
    }
    if (kn>0)
    {
      res += (((res=="") ? "" : " ") +
      this.convert_number(kn) + " Lakh");
    }
    if (Hn>0)
    {
      res += (((res=="") ? "" : " ") +
      this.convert_number(Hn) + " Thousand");
    }

    if (Dn)
    {
      res += (((res=="") ? "" : " ") +
      this.convert_number(Dn) + " Hundred");
    }


    var ones = Array("", "One", "Two", "Three", "Four", "Five", "Six","Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen","Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen","Nineteen");
    var tens = Array("", "", "Twenty", "Thirty", "Fourty", "Fifty", "Sixty","Seventy", "Eighty", "Ninety");

    if (tn>0 || one>0)
    {
      if (!(res==""))
      {
        res += " And ";
      }
      if (tn < 2)
      {
        res += ones[tn * 10 + one];
      }
      else
      {

        res += tens[tn];
        if (one>0)
        {
          res += ("-" + ones[one]);
        }
      }
    }

    if (res=="")
    {
      res = "zero";
    }
    return res;
  }


// clear form value
clearForm() {
  this.frmreceipt.reset();
  this.submitted = false;
}
}
