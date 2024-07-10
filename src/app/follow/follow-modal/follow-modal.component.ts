import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { UserModelModel } from 'src/app/user/user.model';
import { Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-follow-modal',
  templateUrl: './follow-modal.component.html',
  styleUrls: ['./follow-modal.component.scss'],
})
export class FollowModalComponent  implements OnInit {

  @Input() follows: UserModelModel[] = [];
  @Input() followersModal: boolean = true;

  constructor(private modalController: ModalController, private router: Router) { }

  ngOnInit() {}

  goToUserProfile(userId: string) {
    this.modalController.dismiss().then(() => {
      this.router.navigate(['/profile', userId]);
    });
  }

  onCancel(){
    this.modalController.dismiss();
  }
}
