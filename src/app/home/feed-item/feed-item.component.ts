import { Component, OnInit, Input } from '@angular/core';
import { Router } from "@angular/router";
import { Feed } from 'src/app/feed/feed.model';
import { UserModelModel } from 'src/app/user/user.model';
import { UserService } from 'src/app/user/user.service';

@Component({
  selector: 'app-feed-item',
  templateUrl: './feed-item.component.html',
  styleUrls: ['./feed-item.component.scss'],
})
export class FeedItemComponent  implements OnInit {

  constructor(private router: Router, private userService: UserService) { }

  ngOnInit() {
    this.userService.getUserById(this.feed.userId as string).subscribe(user => {
      this.user = user as UserModelModel;
  });}
@Input() feed! : Feed;
profileUrl!: string;
  user!: UserModelModel;


  showDetails(id:string){
    this.router.navigate(['/feed-details', id]);
  }

  viewPosterProfile(posterId: string) {
    this.router.navigate(['/profile', posterId]);
  }

}
