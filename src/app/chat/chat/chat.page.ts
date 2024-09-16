import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ChatServiceService } from '../chat-service.service';
import { Router, Route, ActivatedRoute } from '@angular/router';
import { IonContent } from '@ionic/angular';
import { Observable, of } from 'rxjs';
import { Timestamp } from 'firebase/firestore';
import { MessageModel } from './message.model';
import { UserModelModel } from 'src/app/user/user.model';
import { UserService } from 'src/app/user/user.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {
  @ViewChild(IonContent) content!: IonContent;

  messages: MessageModel[] = [];
  newMsg = '';
  user!: UserModelModel;
  username: string = '';
  @Input() text: string = '';

  constructor(public chatService: ChatServiceService, private router: Router,private route: ActivatedRoute, private userService: UserService) { }


  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      console.log("?");
      if (paramMap.has('userId')) {
        this.userService.getUserById(paramMap.get('userId') as string).subscribe(user => {
          this.user = user as UserModelModel;
          this.username = this.user.username as string;
          this.chatService.getChatMessages(this.username).subscribe((res)=>{
            this.messages = res;
            console.log(res);
          })
        })
      }
    });
    
  }

  sendMessage(){
    this.chatService.addChatMessage(this.newMsg, this.user).subscribe((res)=>{
      this.newMsg = '';
      this.content.scrollToBottom();
      this.messages = this.messages.concat(res);
      console.log(res);
    })
  }

  viewProfile(uid: string){
    this.router.navigate(['/profile', uid]);
  }

}
