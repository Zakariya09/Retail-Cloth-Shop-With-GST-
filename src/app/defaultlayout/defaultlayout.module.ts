import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DefaultlayoutComponent } from './defaultlayout.component';
import { Routes, RouterModule } from '@angular/router';
import { HeaderComponent } from 'src/app/common/header/header.component';
import { SidebarComponent } from 'src/app/common/sidebar/sidebar.component';
import { FooterComponent } from 'src/app/common/footer/footer.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { ManageProductComponent } from "src/app/pages/manage-product/manage-product.component";
import { ManageImportComponent } from "src/app/pages/manage-import/manage-import.component";
import { ManageSalesComponent } from "src/app/pages/manage-sales/manage-sales.component";
import { ManageCreditsComponent } from "src/app/pages/manage-credits/manage-credits.component";
import { DashboardComponent } from 'src/app/pages/dashboard/dashboard.component';
import { ChangePasswordComponent } from 'src/app/pages/change-password/change-password.component';
import { ManageUserComponent } from "src/app/pages/manage-user/manage-user.component";
import { NgSelectizeModule } from 'ng-selectize';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import {NgxPaginationModule} from 'ngx-pagination';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { AuthGuard } from "src/app/auth/auth.guard";
import { AuthService } from "src/app/auth/auth.service";
import { ManageReceiptComponent } from '../pages/manage-receipt/manage-receipt.component';
import { AddReceiptComponent } from '../pages/add-receipt/add-receipt.component';
import { NgSelectModule } from '@ng-select/ng-select';

const routes: Routes = [
  // { path: '', redirectTo: '/layout', pathMatch: 'full', data: { title: 'Layout' } },
  {
      path: '', component: DefaultlayoutComponent,
      children:
          [
              { path: '', redirectTo: 'default/dashboard', pathMatch: 'full' },
              { path: 'default/dashboard', component:DashboardComponent },
                {
                  path:'default/dashboard',
                  component:DashboardComponent,
                  data:{
                    title:'Dashboard'
                  }
                },
                {
                  path:'default/receipt',
                  component: ManageReceiptComponent,
                  data:{
                    title:'Manage Receipt'
                  }
                },
                {
                  path:'default/product',
                  component:ManageProductComponent,
                  data:{
                    title:'Manage Product'
                  }
                },
                {
                  path:'default/user',
                  component:ManageUserComponent,
                  data:{
                    title:'Manage User'
                  }
                },
                {
                  path:'default/import',
                  component:ManageImportComponent,
                  data:{
                    title:'Manage Import'
                  }
                },
                {
                  path:'default/sales',
                  component:ManageSalesComponent,
                  data:{
                    title:'Manage Sales'
                  }
                },
                {
                  path:'default/credits',
                  component:ManageCreditsComponent,
                  data:{
                    title:'Manage Credits'
                  }
                },
                {
                  path:'default/addReceipt',
                  component:AddReceiptComponent,
                  data:{
                    title:'Add Receipt'
                  }
                },
                {
                  path:'default/change-password',
                  component: ChangePasswordComponent,
                  data:{
                    title:'Change Password'
                  }
                }
          ]
  },
]

@NgModule({
  declarations: [
    HeaderComponent,
    DashboardComponent,
    SidebarComponent,
    FooterComponent,
    DefaultlayoutComponent,
    ChangePasswordComponent,
    ManageProductComponent,
    ManageImportComponent,
    ManageSalesComponent,
    ManageCreditsComponent,
    ManageUserComponent,
    ManageReceiptComponent,
    AddReceiptComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    NgSelectizeModule,
    BsDatepickerModule.forRoot(),
    NgxPaginationModule,
    Ng2SearchPipeModule,
    NgSelectModule
  ],
  exports: [RouterModule],
  bootstrap: [DefaultlayoutComponent],
  providers: [  { provide: AuthGuard, useClass: AuthService }]
})
export class DefaultlayoutModule { }
