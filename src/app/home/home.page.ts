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
    this.loadFeeds();
  }
  showDetails(id:string){
    this.router.navigate(['/feed-details', id]);
  }
  ionViewDidEnter() {
    // Ensure feeds are loaded when entering the view
    this.loadFeeds();
  }

  loadFeeds() {
    this.isLoading = true;
    this.exploreService.feeds.subscribe(feeds => {
      this.feeds = feeds;
      this.feedsWithUsers = [];
      const requests = feeds.map(feed => this.userService.getUserById(feed.userId));

      forkJoin(requests).subscribe(users => {
        users.forEach((user, index) => {
          this.following.forEach((follow) =>{
            if(follow?.followedId === this.authUserId) {
              const feedWUModel: FeedWUModel = {
                id: feeds[index].id,
                userId: feeds[index].userId,
                description: feeds[index].description,
                title: feeds[index].title,
                imageUrl: feeds[index].imageUrl,
                profileUrl: user?.photoUrl as string,
                username: user?.username as string
              };
              this.feedsWithUsers.push(feedWUModel);
            }
          });
        });
        this.isLoading = false;
      });
    });
  }

  viewPosterProfile(posterId: string) {
    this.router.navigate(['/profile', posterId]);
  }
}
