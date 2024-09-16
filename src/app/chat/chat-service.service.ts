import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {FieldValue, Timestamp} from 'firebase/firestore';
import { AuthService } from '../auth/auth.service';
import { UserModelModel } from '../user/user.model';
import { UserService } from '../user/user.service';
import { serverTimestamp } from 'firebase/firestore';
import { BehaviorSubject, Observable, map, switchMap, take, tap } from 'rxjs';
import { MessageModel } from './chat/message.model';
import { HttpClient } from '@angular/common/http';


export interface Message {
    createdAt: Date,
    id: string,
    from: UserModelModel,
    to: UserModelModel,
    msg: string
}

@Injectable({
  providedIn: 'root'
})
export class ChatServiceService {
  public authUserId: string | null = null;
  authUser: (UserModelModel | null) = null;
  users: UserModelModel[] = [];
  private baseUrl = 'https://connecthub-mobile-computing-default-rtdb.europe-west1.firebasedatabase.app';

  public _messages = new BehaviorSubject<MessageModel[]>([]);

  constructor(private afs: AngularFirestore, private authService: AuthService, private userService: UserService, private http: HttpClient) {
    this.authService.getUserId().subscribe(userId => {
      this.authUserId = userId;
      this.userService.getUserById(this.authUserId as string).subscribe(user => {
        this.authUser = user;
      });
    });
   }

   get messages() {
    return this._messages.asObservable();
  }

  getAllChatIds(): Observable<string[]> {
    return this.authService.getToken().pipe(
      take(1),
      switchMap(token => {
        return this.http.get<{ [key: string]: any }>(
          `${this.baseUrl}/chats.json?auth=${token}`
        );
      }),
      map(chatsData => {
        const chatIds: string[] = [];
        for (const key in chatsData) {
          if(key.includes(this.authUser?.username as string))
          if (chatsData.hasOwnProperty(key)) {
            chatIds.push(key.replace(this.authUser?.username as string, ''));
          }
        }
        return chatIds;
      })
    );
  }

   getChatMessages(username: string): Observable<MessageModel[]> {
    let authUserName =  this.authUser?.username as string;
    let chatId = authUserName < username ? 
    authUserName + username : username + authUserName;
    return this.authService.getToken().pipe(
      take(1),
      switchMap(token => {
        return this.http.get<{ [key: string]: MessageModel }>(
          `${this.baseUrl}/chats/${chatId}/messages.json?auth=${token}`);
      }),
      map(messagesData => {

        const messages: Message[] = [];
        for (const key in messagesData) {

          
          if (messagesData.hasOwnProperty(key)) {
            messages.push(new MessageModel(
              messagesData[key].createdAt,
              key,
              messagesData[key].from,
              messagesData[key].to,
              messagesData[key].msg
            ));
          }
        }
        return messages;
      })
    );
  }

  addChatMessage(msg: string, user: UserModelModel) {
    let generatedId: string;
    let newMsg: MessageModel;
    let fetchedUserId: string | null;
    let authUserName =  this.authUser?.username as string;
    let chatId = authUserName < user.username ? 
    authUserName + user.username : user.username + authUserName;


    return this.authService.userId.pipe(
      take(1),
      switchMap(userId => {
        fetchedUserId = userId;
        return this.authService.getToken();
      }),
      take(1),
      switchMap(token => {
        newMsg = new MessageModel(
          new Date(),
          '',
          this.authUser as UserModelModel,
          user,
          msg
        );
        return this.http.post<{ name: string }>(
          `${this.baseUrl}/chats/${chatId}/messages.json?auth=${token}`,
          { ...newMsg, id: null }
        );
      }),
      take(1),
      map(resData => {
        generatedId = resData.name;
        newMsg.id = generatedId;
        return newMsg;
      }),
      take(1),
      tap(newMsg => {
        this._messages.next(this._messages.getValue().concat(newMsg));
      })
    );
  }

  getUserForMsg(msgFromId: string, users:UserModelModel[]): string{
    for(let usr of users){
      if(usr.uid == msgFromId){
        return usr.username;
      }
    }
    return 'Deleted';
  }
}
