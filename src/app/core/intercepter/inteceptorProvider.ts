import {HTTP_INTERCEPTORS} from '@angular/common/http';
import { AuthInterceptorService } from "src/app/core/intercepter/auth-interceptor.service";
import {LoaderInterceptorService  } from "src/app/core/intercepter/loader-interceptor.service";


export const InterceptorProvider = [
  {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptorService,
    multi: true
  },
  {
    provide: HTTP_INTERCEPTORS,
    useClass: LoaderInterceptorService,
    multi: true
  },
];
