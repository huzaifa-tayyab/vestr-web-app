import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class UnAuthguardGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router){}
  canActivate() {
    if (!localStorage.getItem('vest_login')) {
        return true;
    }
    if(localStorage.getItem('vest_login')){
        this.router.navigate(['/app']);
    }
    return false;
  }
}
