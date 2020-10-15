import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ProductModel } from "src/app/models/product.model";

@Injectable({
  providedIn: 'root'
})
export class CommonServiceService {
  constructor(private http: HttpClient) { }
  private baseUrl = 'http://localhost:3000/';

  //Login Sevice
  login(loginData) {
    console.log('inside login serice');
    return this.http.post( this.baseUrl + 'user/login', loginData);
  }

  //POST Product
  saveProduct(product) {
    return this.http.post(this.baseUrl + 'products/', product);
  }

  //POST Product
  saveReceipt(receipt) {
    return this.http.post(this.baseUrl + 'receipt/', receipt);
  }

  //GET Rceipt
  getReceipt() {
    return this.http.get( this.baseUrl + 'receipt');
  }

  //Delete Receipt
  deleteReceipt(id) {
    return this.http.delete( this.baseUrl + 'receipt/' + id);
  }



  getProducts() {
    return this.http.get( this.baseUrl + 'products');
  }
  //Delete Product
  deleteProduct(id) {
    return this.http.delete( this.baseUrl + 'products/' + id);
  }




  getImports() {
    return this.http.get( this.baseUrl + 'import');
  }

  //POST Import
  saveImport(product) {
    return this.http.post(this.baseUrl + 'import/', product);
  }

  //Delete Product
  deleteImport(id) {
    return this.http.delete( this.baseUrl + 'import/' + id);
  }

  //Update Product
  updateImport(id, data) {
    return this.http.put( this.baseUrl + 'import/' + id, data);
  }

  //GET Sales
  getSales() {
    return this.http.get( this.baseUrl + 'sale');
  }

  //POST Sale
  saveSale(product) {
    return this.http.post(this.baseUrl + 'sale/', product);
  }
  //Update Product
  updateSale(id, data) {
    return this.http.put( this.baseUrl + 'sale/' + id, data);
  }
  //Delete Product
  deleteSale(id) {
    return this.http.delete( this.baseUrl + 'sale/' + id);
  }

  //GET Sales
  getCredits() {
    return this.http.get( this.baseUrl + 'credit');
  }
  //POST Sale
  saveCredit(product) {
    return this.http.post(this.baseUrl + 'credit/', product);
  }
  //Update Product
  updateCredit(id, data) {
    return this.http.put( this.baseUrl + 'credit/' + id, data);
  }
  //Delete Product
  deleteCredit(id) {
    return this.http.delete( this.baseUrl + 'credit/' + id);
  }

  //GET Users
  getUsers() {
    return this.http.get( this.baseUrl + 'user');
  }

  //POST User
  saveUser(user) {
    return this.http.post(this.baseUrl + 'user/signup', user);
  }

  //Update User
  updateUser(id, data) {
    return this.http.put( this.baseUrl + 'user/' + id, data);
  }

  //Delete User
  deleteUser(id) {
    return this.http.delete( this.baseUrl + 'user/' + id);
  }
}
