import { Component, Input, OnInit } from '@angular/core';
import { CommentModel} from "./comment";
import {UserService} from "../../../../user/user.service";
import {FeedDetailsPage} from "../feed-details.page";
import {UserModelModel} from "../../../../user/user.model";
import { ExploreService } from 'src/app/feed/explore.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss'],
})

export class CommentComponent implements OnInit {
  @Input() comment!: CommentModel;
  @Input() text: string = '';
  @Input() authUserId: string | null = '';
  @Input() feedId : string = "";
  userId: string = "";
  username:string = "";
  photoUrl: string = "";
  editedText: string = '';
  editingMode: boolean = false;
  dateTimePosted: Date = new Date();

  public userC!: UserModelModel;

  constructor(private userService: UserService, private exploreService: ExploreService, private router: Router, private fdp: FeedDetailsPage) {}

  ngOnInit() {
    this.userService.getUserById(this.comment.uid).subscribe(user => {
      this.userC = user as UserModelModel;
      this.username = this.userC.username;
      this.photoUrl = this.userC.photoUrl;
      this.editedText = this.comment.text; 
      this.dateTimePosted = this.comment.dateTimePosted;
    });
  }

  isLoggedUserComment(){
    if(this.comment.uid === this.authUserId)
      return true;
    return false;
}

deleteComment() {
  this.exploreService.deleteComment(this.comment.key, this.feedId).subscribe(() => {});
  this.fdp.comments = this.fdp.comments.filter(f => f.key !== this.comment.key);
}

toggleEditMode() {
  this.editingMode = true;
}

saveEdit() {
  
  this.exploreService.editComment(
    this.comment.key,
    this.editedText,
    this.userC.uid,
    this.feedId
  ).subscribe(() => {
    this.text = this.editedText;
    this.dateTimePosted = new Date();
    this.editingMode = false; 
  });
}

viewPosterProfile(){
  this.router.navigate(['/profile', this.comment.uid]);
}

}
