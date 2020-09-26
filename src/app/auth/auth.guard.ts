import { Injectable } from '@angular/core';
import {CanActivate, Router} from '@angular/router';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(public router: Router) {}
  canActivate(): boolean {
    if (JSON.parse(localStorage.getItem('user')) == null ) {
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }
}
