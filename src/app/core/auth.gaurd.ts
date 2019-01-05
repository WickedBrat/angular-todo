import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';

import { AuthService } from './auth.service';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(
    private router: Router,
    private authenticationService: AuthService
  ) {}

  canActivate(): boolean {
    if (this.authenticationService.isAuthenticated()) {
      return true;
    }

    console.log('Not authenticated, redirecting...');
    this.router.navigate(['/login'], { replaceUrl: true });
    return false;
  }
}
