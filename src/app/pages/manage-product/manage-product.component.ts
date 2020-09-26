import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonServiceService } from "src/app/core/services/common-service.service";
import { ProductModel } from "src/app/models/product.model";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { HttpErrorResponse } from '@angular/common/http';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ToastrManager } from 'ng6-toastr-notifications';
declare var jQuery: any;
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage-product',
  templateUrl: './manage-product.component.html',
  styleUrls: ['./manage-product.component.css']
})
export class ManageProductComponent implements OnInit {
frmProduct: FormGroup;
dir = 'http://localhost:3000/';
product: ProductModel;
subscription: any;
p =1;
submitted = false;
textSearch = '';
products: [];
selectedFile = null;
@ViewChild('addProduct', {static: false}) public addProduct: ModalDirective;

  constructor(private commonService: CommonServiceService, private formBuilder: FormBuilder, private toaster: ToastrManager) { }

  ngOnInit() {
    this.frmProduct =  this.formBuilder.group({
      _id: [0],
      name: [, Validators.required],
      price: [, Validators.required],
      productImage: [, Validators.required]
    })
    this.getProducts();
  }

 // save project data
   onSubmit() {
    const payload = new FormData();
    payload.append('name', this.frmProduct.get('name').value);
    payload.append('price', this.frmProduct.get('price').value);
    payload.append('productImage', this.selectedFile, this.selectedFile.name);

    this.submitted = true;

    // stop here if form is invalid
    if (this.frmProduct.invalid) {
   this.toaster.warningToastr('Please enter mendatory fields.', 'Invalid!', {showCloseButton: true});
      return;
  }
  this.subscription = this.commonService.saveProduct(payload).subscribe((response: any) => {
      if (response.status) {
        this.toaster.successToastr('Product saved successfully. ', 'Success!',{showCloseButton: true});
       jQuery('#addProduct').modal('hide');
       this.getProducts();
      } else {
        this.toaster.errorToastr(response.message, 'Oops!',{showCloseButton: true});
      }
    }, (error: HttpErrorResponse) => {
      this.toaster.errorToastr('Error while saving product!', 'Oops!',{showCloseButton: true});
      return;
    });
 }
 get f() { return this.frmProduct.controls; }
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

 editProduct(data: ProductModel){
  //  data.productImage = data.productImage.slice(7);
  this.frmProduct.controls.name.setValue(data.name);
  this.frmProduct.controls.price.setValue(data.price);
  this.frmProduct.controls.productImage.patchValue(data.productImage);
  this.frmProduct.controls._id.setValue(data._id);
 }

 //Delete Product
 deleteProduct(id){
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
  this.commonService.deleteProduct(id).subscribe((response : any)=>{
    if (response.status) {
      this.toaster.successToastr('Deleted successfully. ', 'Success!',{showCloseButton: true});
      this.getProducts();

    }else {
      this.toaster.errorToastr('Error while deleting import.', 'Oops!',{showCloseButton: true});
      }
    }, (error: HttpErrorResponse) => {
      this.toaster.errorToastr('Error while deleting import.', 'Oops!',{showCloseButton: true});
      return;
    });
  }});

  }
//Image assignment
 onFileSelected(event) {
  this.selectedFile = event.target.files[0];
}
 // clear form value
 clearForm() {
  this.frmProduct.reset();
  this.submitted = false;
}

}
