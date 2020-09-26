import { Component, OnInit, ViewChild} from '@angular/core';
import {Validators , FormGroup, FormBuilder} from '@angular/forms';
import {  CommonServiceService} from 'src/app/core/services/common-service.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
declare var jQuery: any;
@Component({
  selector: 'app-manage-project',
  templateUrl: './manage-project.component.html',
  styleUrls: ['./manage-project.component.css']
})
export class ManageProjectComponent implements OnInit {
  @ViewChild('addProject', {static: false}) public addProject: ModalDirective;
  projects = [{name: 'Xpert Pharma', description: 'none'}, {name: 'Xpert Retail', description: 'none'}, {name: 'Xpert Admin', description: 'none'}]
  submitted = false;
  public textSearch: string;
  frmProject: FormGroup;
  p: 1;
  pageSize: 10;
  public val = null;
  constructor(private formbuilder: FormBuilder, commonService: CommonServiceService) { }
  ngOnInit() {
    this.frmProject = this.formbuilder.group({
      name: [, Validators.required],
      description: ['']
    });
    this.frmProject.get('description').valueChanges.subscribe((item: string ) => {
      console.log(item);
    });
  }

  onSubmit(){
    this.submitted = true;
  console.log('inside submit');
    // stop here if form is invalid
    if (this.frmProject.invalid) {
      return;
  }
  jQuery('#addProject').modal('hide');
 }
 // convenience getter for easy access to form fields
 get f() { return this.frmProject.controls; }
}
