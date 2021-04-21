// import { Injectable } from '@angular/core';
// import { CanLoad, Route, UrlSegment, Router } from '@angular/router';
// import { Observable } from 'rxjs';
// import { AuthService } from '../_services/auth.service';

// @Injectable({providedIn: 'root'})
// export class AuthGuard implements CanLoad {
//   constructor(private authService: AuthService, private router: Router) { }

//   returnUrl = location.pathname;
//   canLoad(
//     route: Route,
//     segments: UrlSegment[]) {
//     const currentUser = this.authService.currentUserValue;
//     if (currentUser) {
//       // authorised so return true
//       return true;
//     }

//     // not logged in so redirect to login page with the return url
//     this.router.navigate(['/auth'], { queryParams: { returnUrl: this.returnUrl } });
//     return false;
//   }
// }
import { Injectable } from '@angular/core';
import { CanLoad, Route, UrlSegment, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../_services/auth.service';

@Injectable({providedIn: 'root'})
export class AuthGuard implements CanLoad {
  constructor(private authService: AuthService, private router: Router) { }

  returnUrl = location.pathname;
  canLoad(
    route: Route,
    segments: UrlSegment[]) {
    const currentUser = this.authService.currentUserValue;
    if (currentUser) {
      // authorised so return true
      return true;
    }

    // not logged in so redirect to login page with the return url
    this.router.navigate(['/auth'], { queryParams: { returnUrl: this.returnUrl } });
    return false;
  }
}
