import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'feed',
    pathMatch: 'full'
  },
  {
    path: 'feed',
    loadChildren: () => import('./feed/feed.module').then(m => m.FeedPageModule),
    canLoad: [AuthGuard]
  },
  {
    path: 'post',
    loadChildren: () => import('./post/post.module').then(m => m.PostPageModule),
    canLoad: [AuthGuard]
  },
  {
    path: 'profile/:userId',
    loadChildren: () => import('./profile/profile.module').then(m => m.ProfilePageModule),
    canLoad: [AuthGuard]
  },
  {
    path: 'log-in',
    loadChildren: () => import('./auth/log-in/log-in.module').then(m => m.LogInPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./auth/register/register.module').then(m => m.RegisterPageModule)
  },
  {
    path: 'explore',
    loadChildren: () => import('./feed/explore/explore.module').then(m => m.ExplorePageModule),
    canLoad: [AuthGuard]
  },
  {
    path: 'feed-details/:feedId',
    loadChildren: () => import('./feed/explore/feed-details/feed-details.module').then(m => m.FeedDetailsPageModule),
    canLoad: [AuthGuard]
  },
  {
    path: 'publish-post',
    loadChildren: () => import('./publish-post/publish-post.module').then(m => m.PublishPostPageModule),
    canLoad: [AuthGuard]
  },{
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule),
    canLoad: [AuthGuard]
  },
  {
    path: 'chat/:userId',
    loadChildren: () => import('./chat/chat/chat.module').then( m => m.ChatPageModule),
    canLoad: [AuthGuard]
  },
  {
    path: 'contacts',
    loadChildren: () => import('./chat/contacts/contacts.module').then( m => m.ContactsPageModule)
  },
  // Za rute koje ne postoje
  {
    path: '**',
    redirectTo: 'log-in'
  }
  
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
