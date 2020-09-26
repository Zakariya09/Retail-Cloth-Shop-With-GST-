import { Component, OnInit, ViewChild} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap/modal';
declare var jQuery: any;
@Component({
  selector: 'app-manage-customer',
  templateUrl: './manage-customer.component.html',
  styleUrls: ['./manage-customer.component.css']
})
export class ManageCustomerComponent implements OnInit {
  @ViewChild('addCustomer', {static: false}) public addCustomer: ModalDirective;
  jQuery: any;
  submitted = false;
  public textSearch: string;
  frmCustomer: FormGroup;
  frmPayment: FormGroup;
  public isVisible = false;
  myDateValue: Date;
  p: 1;
  pageSize: 10;
  public items = [{name:'zakariya', mobileNumber: 90909090909, project: 'Xpert Whole Sale', installationDate: '12-12-12', expiryDate: '12-12-2020', macAddress: 'JGHJGJGJGJGJG'},
                  {name:'Bala', mobileNumber: 89898989898, project: 'Xpert Trading', installationDate: '03-12-12', expiryDate: '12-12-2020', macAddress: 'JGHJGJGJGJGJG'},
                ];
  public val = null;
  constructor(private formBuilder: FormBuilder) {}
    ngOnInit() {
    this.myDateValue = new Date();
    this.frmCustomer = this.formBuilder.group({
      name: ['', Validators.required],
      mobileNumber: ['', Validators.required],
      emailID: ['', Validators.required],
      DOB: ['', Validators.required],
      installationDate: [''],
      serviceEngineer: [, Validators.required],
      projectName: [, Validators.required],
      macAddress: [''],
      key: [''],
      expiryDate: [''],
      address: [],
      remark: []
    });
    this.frmPayment = this.formBuilder.group({
      paymentDate: ['', Validators.required],
      amount: [0, Validators.required],
      remark: ['']
    });
  }
   // convenience getter for easy access to form fields
   get f() { return this.frmCustomer.controls; }

   onSubmit(): void {

     this.submitted = true;
     // stop here if form is invalid
     if (this.frmCustomer.invalid) {
       return;
   }
   jQuery('#addCustomer').modal('hide');
  }
addNewPayment(): void {
   this.isVisible = true;
}
clearAddPaymentForm() {
  this.isVisible = false;
}
}
