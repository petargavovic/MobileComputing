import { Component, OnInit } from '@angular/core';
import { Feed } from "../feed/feed.model";
import { ExploreService } from "../feed/explore.service";
import { Router } from "@angular/router";
import {FeedWUModel} from "../feed/feedWU.model";
import{UserService} from "../user/user.service";
import {forkJoin} from "rxjs";
import {UserModelModel} from "../user/user.model";
import {AuthService} from "../auth/auth.service";
import {FollowService} from "../follow/follow.service";
import {FollowModel} from "../follow/follow.model";

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  feeds: Feed[] = [];
  feedsWithUsers: FeedWUModel[] = [];
  follows: (UserModelModel | null)[] = [];
  photoUrl: string = '';
  isLoading: boolean = false;
  authUserId: string | null = '';
  following: (FollowModel | null)[] = [];

  constructor(private exploreService: ExploreService, private router: Router, private userService: UserService, private authService: AuthService, private followService: FollowService) { }

  ngOnInit() {
    // Initial load of feeds
    this.authService.getUserId().subscribe(userId => {
      this.authUserId = userId;
    });
    this.followService.getfollowing(this.authUserId as string).subscribe(follows => {
      this.following = follows;
    });
  }

  ionViewDidEnter() {
    // Ensure feeds are loaded when entering the view
    this.feeds = [];
    this.loadFeeds();
  }

  loadFeeds() {
    this.isLoading = true;
      this.followService.getfollowing(this.authUserId as string).subscribe((follows) =>{
        follows.forEach(follow => {
          this.exploreService.getUserPosts(follow.followedId).subscribe((posts)=>{
            console.log(posts);
            this.feeds = this.feeds.concat(posts);
            this.feeds.reverse();
            this.isLoading = false;
          })
        });
      });
  }
}
