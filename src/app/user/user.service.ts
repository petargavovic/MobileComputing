import { Injectable } from '@angular/core';
import {BehaviorSubject, map, Observable, tap} from "rxjs";
import {UserModelModel} from "./user.model";
import {switchMap, take} from "rxjs/operators";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {User} from "../auth/user.model";
import {AuthService} from "../auth/auth.service";

interface UserModelModelData {
  uid: string,
  email:string,
  name:string,
  surname:string,
  username:string,
  photoUrl:string
}




@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient,private router: Router, private authService: AuthService) { }


  private _users = new BehaviorSubject<UserModelModel[]>([]);

  private baseUrl = 'https://connecthub-mobile-computing-default-rtdb.europe-west1.firebasedatabase.app';

  getUserById(userId: string): Observable<UserModelModel | null> {
    return this.authService.getToken().pipe(
      take(1),
      switchMap(token => {
        return this.http.get<{ [key: string]: UserModelModel }>(
          `${this.baseUrl}/users.json?auth=${token}`);
      }),
      map(usersData => {

        for (const key in usersData) {
          if(usersData[key].uid == userId)
            if (usersData.hasOwnProperty(key)) {
              return new UserModelModel(
                usersData[key].uid,
                usersData[key].email,
                usersData[key].name,
                usersData[key].surname,
                usersData[key].username,
                usersData[key].photoUrl
              );
            }
        }
        return null;
      })
    );
  }

  getUserByUsername(username: string): Observable<UserModelModel | null> {
    return this.authService.getToken().pipe(
      take(1),
      switchMap(token => {
        return this.http.get<{ [key: string]: UserModelModel }>(
          `${this.baseUrl}/users.json?auth=${token}`);
      }),
      map(usersData => {

        for (const key in usersData) {
          if(usersData[key].username == username)
            if (usersData.hasOwnProperty(key)) {
              return new UserModelModel(
                usersData[key].uid,
                usersData[key].email,
                usersData[key].name,
                usersData[key].surname,
                usersData[key].username,
                usersData[key].photoUrl
              );
            }
        }
        return null;
      })
    );
  }

  getUsers() {
    return this.authService.getToken().pipe(
      take(1),
      switchMap(token => {
        return this.http.get<{ [key: string]: UserModelModel }>(
          `${this.baseUrl}/users.json?auth=${token}`
        );
      }),
      map(usersData => {
        const users: UserModelModel[] = [];
        for (const key in usersData) {
          if (usersData.hasOwnProperty(key)) {
            users.push(new UserModelModel(
              usersData[key].uid,
                usersData[key].email,
                usersData[key].name,
                usersData[key].surname,
                usersData[key].username,
                usersData[key].photoUrl
            ));
          }
        }
        return users;
      }),
      tap(users => {
        this._users.next(users);
      })
    );
  }

  addUserDetail(uid: string, email: string, name: string, surname: string, username: string, photoUrl: string): Observable<any> {
    let newUser: UserModelModel;


    return this.authService.userId.pipe(
      take(1),
      switchMap(() => {
        return this.authService.getToken();
      }),
      take(1),
      switchMap(token => {
        newUser = new UserModelModel(
          uid,
          email,
          name,
          surname,
          username,
          photoUrl
        );
        return this.http.post<{ name: string }>(
          `${this.baseUrl}/users.json?auth=${token}`,
          { ...newUser}
        );
      }),
      take(1),
      switchMap(() => {
        return this.authService.users;
      }),
      take(1),
      tap(users => {
        this._users.next(users.concat(newUser));
      })
    );

  }

  usernameExists(username: string) {
    return this.http.get<{ [key: string]: UserModelModel }>(
      `${this.baseUrl}/users.json`
    ).pipe(
      map(usersData => {
        if (!usersData) {
          return false;
        }
        for (const key in usersData) {
          if (usersData[key].username === username) {
            return true;
          }
        }
        return false;
      })
    );
  }

  emailExists(email: string) {
    return this.http.get<{ [key: string]: UserModelModel }>(
      `${this.baseUrl}/users.json`
    ).pipe(
      map(usersData => {
        if (!usersData) {
          return false;
        }
        for (const key in usersData) {
          if (usersData[key].email === email) {
            return true;
          }
        }
        return false;
      })
    );
  }
}
