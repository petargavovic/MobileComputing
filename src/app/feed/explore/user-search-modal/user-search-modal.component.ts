import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { UserModelModel } from 'src/app/user/user.model';
import { UserService } from 'src/app/user/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-search-modal',
  templateUrl: './user-search-modal.component.html',
  styleUrls: ['./user-search-modal.component.scss'],
})
export class UserSearchModalComponent implements OnInit {

  searchTerm: string = '';
  public users: UserModelModel[] = [];
  public filteredUsers: UserModelModel[] = [];
  @Input() route: string = '';



  constructor(private modalCtrl: ModalController, private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.userService.getUsers().subscribe((users)=>{
      this.users = users;
      console.log(users);
    })
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

  searchUsers(event: any) {
    const searchTerm = event.target.value.toLowerCase();
      this.filteredUsers = this.users.filter(user => user.username.toLowerCase().includes(searchTerm));
  }

  selectUser(user: UserModelModel) {
    this.router.navigate([this.route, user.uid]);
    this.dismiss();
  }
}
