import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { AuthService } from './auth/auth.service';
import { AuthGuard } from './auth/auth.guard';
import {NgxPrintModule} from 'ngx-print';
import { ReactiveFormsModule, FormsModule} from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ng6-toastr-notifications';
import { LoaderInterceptorService } from "src/app/core/intercepter/loader-interceptor.service";
import { AuthInterceptorService } from "src/app/core/intercepter/auth-interceptor.service";
import { BlockUIHttpModule } from 'ng-block-ui/http';
import { BlockUIModule } from 'ng-block-ui';
import { InterceptorProvider } from "src/app/core/intercepter/inteceptorProvider";

@NgModule({
  declarations: [
    LoginComponent,
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgxPrintModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    BlockUIModule.forRoot(
      {
        message: 'Please wait...',
        // template: '<img src="./assets/img/logo.png" />'
      }
    ),
    BlockUIHttpModule.forRoot(), // Import Block UI Http Module
  ],
  providers: [AuthService,
     AuthGuard,
     {
      provide: HTTP_INTERCEPTORS,
      useClass: LoaderInterceptorService,
      multi: true
    },
    //  InterceptorProvider

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
