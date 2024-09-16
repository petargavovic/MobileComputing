import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { UserSearchModalComponent } from 'src/app/feed/explore/user-search-modal/user-search-modal.component';
import { ChatServiceService } from '../chat-service.service';
import { Router } from '@angular/router';
import { UserService } from 'src/app/user/user.service';
import { UserModelModel } from 'src/app/user/user.model';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.page.html',
  styleUrls: ['./contacts.page.scss'],
})
export class ContactsPage implements OnInit {

  constructor(private modalCtrl: ModalController, private chatService: ChatServiceService, private router: Router, private userService: UserService) { }

  chatIds: string[] = [];
  users: UserModelModel[] = [];

  ngOnInit() {
    
  }

  ionViewDidEnter() {
    this.chatService.getAllChatIds().subscribe(ids => {
      this.chatIds = ids;
      console.log(this.chatIds);
      this.chatIds.forEach(id => {
        this.userService.getUserByUsername(id).subscribe(user =>{
          this.users.push(user as UserModelModel);
        })
      });
    });
  }

  async openSearchModal() {
    const modal = await this.modalCtrl.create({
      component: UserSearchModalComponent,
      componentProps: {route: '/chat'}
    });
    return await modal.present();
  }

  selectUser(userId: string) {
    this.router.navigate(['/chat', userId]);
  }
}
