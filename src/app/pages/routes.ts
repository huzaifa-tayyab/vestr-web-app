import { Routes } from '@angular/router';

export const content: Routes = [
  {
    path: 'feed',
    loadChildren: () =>
      import('./main/main.module').then((m) => m.MainPageModule),
  },
  {
    path: 'draft',
    loadChildren: () =>
      import('./draft/draft.module').then((m) => m.DraftPageModule),
  },
  {
    path: 'view-all-graph',
    loadChildren: () =>
      import('./view-all-graph/view-all-graph.module').then(
        (m) => m.ViewAllGraphPageModule
      ),
  },
  {
    path: 'view-all-stocks/:id',
    loadChildren: () =>
      import('./view-all-stocks/view-all-stocks.module').then(
        (m) => m.ViewAllStocksPageModule
      ),
  },
  {
    path: 'post-detail/:id',
    loadChildren: () =>
      import('./post-detail/post-detail.module').then(
        (m) => m.PostDetailPageModule
      ),
  },
  {
    path: 'profile',
    loadChildren: () =>
      import('./profile/profile.module').then((m) => m.ProfilePageModule),
  },
  {
    path: 'news',
    loadChildren: () =>
      import('./news/news.module').then((m) => m.NewsPageModule),
  },
  {
    path: 'profile-edit',
    loadChildren: () =>
      import('./profile-edit/profile-edit.module').then(
        (m) => m.ProfileEditPageModule
      ),
  },
  {
    path: 'profile/:id',
    loadChildren: () =>
      import('./other-profile/other-profile.module').then(
        (m) => m.OtherProfilePageModule
      ),
  },
  {
    path: 'markets',
    loadChildren: () =>
      import('./market/market.module').then((m) => m.MarketPageModule),
  },
  {
    path: 'market-detail/:id',
    loadChildren: () =>
      import('./market-detail/market-detail.module').then(
        (m) => m.MarketDetailPageModule
      ),
  },
  {
    path: 'crypto-detail/:id/:doolar',
    loadChildren: () =>
      import('./crypto-detail/crypto-detail.module').then(
        (m) => m.CryptoDetailPageModule
      ),
  },
  {
    path: 'messages',
    loadChildren: () =>
      import('./messages/messages.module').then((m) => m.MessagesPageModule),
  },
  {
    path: 'messages/:id',
    loadChildren: () =>
      import('./messages/messages.module').then((m) => m.MessagesPageModule),
  },
  {
    path: 'transaction-details',
    loadChildren: () =>
      import('./transaction-details/transaction-details.module').then(
        (m) => m.TransactionDetailsPageModule
      ),
  },
  {
    path: 'rooms',
    loadChildren: () =>
      import('./rooms/rooms.module').then((m) => m.RoomsPageModule),
  },
  {
    path: 'rooms/:id',
    loadChildren: () =>
      import('./rooms/rooms.module').then((m) => m.RoomsPageModule),
  },
  {
    path: 'create-room',
    loadChildren: () =>
      import('./create-room/create-room.module').then(
        (m) => m.CreateRoomPageModule
      ),
  },
  {
    path: 'create-room/:id',
    loadChildren: () =>
      import('./create-room/create-room.module').then(
        (m) => m.CreateRoomPageModule
      ),
  },
  {
    path: 'home',
    loadChildren: () =>
      import('./home/home.module').then((m) => m.HomePageModule),
  },
  {
    path: 'explore',
    loadChildren: () =>
      import('./explore/explore.module').then((m) => m.ExplorePageModule),
  },
  {
    path: 'add-post',
    loadChildren: () =>
      import('./add-post/add-post.module').then((m) => m.AddPostPageModule),
  },
  {
    path: 'add-post/:type/:id',
    loadChildren: () =>
      import('./add-post/add-post.module').then((m) => m.AddPostPageModule),
  },
  {
    path: 'notifications',
    loadChildren: () =>
      import('./notifications/notifications.module').then(
        (m) => m.NotificationsPageModule
      ),
  },
  {
    path: '**',
    redirectTo: 'feed',
  },
];
