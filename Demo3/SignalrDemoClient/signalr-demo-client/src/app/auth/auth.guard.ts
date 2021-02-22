import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthService } from './auth.service';

//3Tutorial
@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {

  constructor(public authService: AuthService) {}

  canActivate(): boolean {
    if (!this.authService.isAuthenticated) {
      this.authService.router.navigateByUrl("auth");
      return false;
    }
    return true;
  }
}