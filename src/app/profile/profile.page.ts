import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';
import { ExploreService } from '../feed/explore.service';
import { Feed } from '../feed/feed.model';
import { Router } from '@angular/router';
import { FollowService } from '../follow/follow.service';
import { FollowModel } from '../follow/follow.model';
import {UserService} from "../user/user.service";
import { FollowModalComponent } from '../follow/follow-modal/follow-modal.component';
import { forkJoin } from 'rxjs';
import { UserModelModel } from '../user/user.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  userId: string | null = null;
  username: string = '';
  fullName: string = '';
  posts: Feed[] = [];
  follows: (UserModelModel | null)[] = [];
  following: (UserModelModel | null)[] = [];
  followers = 0;
  followed = 0;
  isLoading = false;
  email: string = '';
  photoUrl: string = '';
  canFollow = true;
  isFollowing = false;
  authUserId: string | null = null;
  authUser: (UserModelModel | null) = null;

  constructor(
    private authService: AuthService,
    private exploreService: ExploreService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
    private followService: FollowService,
    private alertController: AlertController,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      console.log("?");
      if (paramMap.has('userId')) {
        this.userId = paramMap.get('userId');
        console.log("?? " + this.userId);
        this.loadUserProfile();
        this.loadUserPosts();
        this.loadFollows();
      }
    });
    this.authService.getUserId().subscribe(userId => {
      this.authUserId = userId;
      this.userService.getUserById(this.authUserId as string).subscribe(user => {
        this.authUser = user;
      });
      if(this.userId === userId)
      this.canFollow = false;
      else{
        this.followService.checkIsFollowing(this.authUserId as string, this.userId as string).subscribe(isFollowing =>{
          if(isFollowing)
          this.isFollowing = true;
        })
      }
    });
  }

  loadUserProfile() {
    if (this.userId) {
      this.userService.getUserById(this.userId).subscribe(user => {
        if (user) {
          this.username = user.username;
          this.fullName = `${user.name} ${user.surname}`;
          this.email = user.email;
          this.photoUrl = user.photoUrl;
        }
      });
    }
  }

  loadUserPosts() {
    if (this.userId) {
      this.isLoading = true;
      this.exploreService.getUserPosts(this.userId).subscribe(posts => {
        this.posts = posts;
        this.isLoading = false;
      });
    }
  }

  loadFollows() {
    if (this.userId) {
      this.isLoading = true;
      this.followService.getfollows(this.userId).subscribe(follows => {
        const userRequests = follows.map(follow => this.userService.getUserById(follow.followerId));
        forkJoin(userRequests).subscribe(users => {
          this.follows = users;
          this.followers = users.length;
          this.isLoading = false;
          this.follows.reverse();
        });
      });
      this.followService.getfollowing(this.userId).subscribe(following => {
        const userRequests = following.map(follow => this.userService.getUserById(follow.followedId));
        forkJoin(userRequests).subscribe(users => {
          this.following = users;
          this.followed = users.length;
          this.isLoading = false;
          this.following.reverse();
        });
      });
    }
  }

  onDeletePost(postId: string) {
    this.alertCtrl.create({
      header: 'Are you sure?',
      message: 'Do you really want to delete this post?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Delete',
          handler: () => {
            this.loadingCtrl.create({ message: 'Deleting post...' }).then(loadingEl => {
              loadingEl.present();
              this.exploreService.deleteFeed(postId).subscribe(() => {
                loadingEl.dismiss();
                this.loadUserPosts(); // Reload posts after deletion
              });
            });
          }
        }
      ]
    }).then(alertEl => alertEl.present());
  }

  openFeedDetails(feedId: string) {
    this.router.navigate(['/feed-details', feedId]);
  }

  onLogout() {
    this.authService.logOut();
    this.router.navigateByUrl('/log-in').then(() => {
      window.location.reload();
    });
  }
  isAuthUser(): boolean {
    return this.canFollow;
  }
  isFollowingUser(): boolean {
    return this.isFollowing;
  }

  async onFollow(){
      this.followService.follow(this.authUserId as string, this.userId as string).subscribe(
        async response => {
          console.log('Follow added:', response);
          const alert = await this.alertController.create({
            header: 'Success',
            message: 'You are now following '+ this.username +'!',
            buttons: ['OK']
          });
          await alert.present();
          this.isFollowing = true;
          this.follows.unshift(this.authUser);
          console.log(this.follows);
          this.followers++;
        },
        async error => {
          console.error('Error following:', error);
          const alert = await this.alertController.create({
            header: 'Error',
            message: 'There was an error folowing ' + this.username +'.',
            buttons: ['OK']
          });
          await alert.present();
        }
      );
    }

    onUnfollow(){
      this.followService.unfollow(this.authUserId as string, this.userId as string).subscribe(() => {
        this.isFollowing = false;
        for (let index = 0; index < this.follows.length; index++) {
            if(this.follows[index]?.uid === this.authUserId)
              this.follows.splice(index, 1);
        }
        this.followers--;
      });
    }

    viewFollowers() {
      this.modalController.create({
        component: FollowModalComponent,
        componentProps: { follows: this.follows, followersModal: true  }
      }).then((modal) => {
        modal.present();
      })
    }
  
    viewFollowing() {
      this.modalController.create({
        component: FollowModalComponent,
        componentProps: { follows: this.following, followersModal: false }
      }).then((modal) => {
        modal.present();
      })
    }
  }
