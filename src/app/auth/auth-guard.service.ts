import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { CanActivate } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService{// implements CanActivate {

  constructor( public authenticationService: AuthService) { }

 // canActivate(): boolean {
 //   return this.authenticationService.isAuthenticated();
 // }
}