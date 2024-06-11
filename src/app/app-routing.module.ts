import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth-guard.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'welcome',
    loadChildren: () =>
      import('./screens/welcome/welcome.module').then(
        (m) => m.WelcomePageModule
      ),
  },
  {
    path: 'home',
    loadChildren: () =>
      import('./screens/home/home.module').then((m) => m.HomePageModule),
      canActivate: [AuthGuard]
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./screens/login/login.module').then((m) => m.LoginPageModule),
  },
  {
    path: 'group-details',
    loadChildren: () =>
      import('./screens/group-details/group-details.module').then(
        (m) => m.GroupDetailsPageModule
      ),
  },
  {
    path: 'join-page',
    loadChildren: () =>
      import('./screens/join-page/join-page.module').then(
        (m) => m.JoinPagePageModule
      ),
  },
  {
    path: 'advisors',
    loadChildren: () =>
      import('./screens/advisors/advisors.module').then(
        (m) => m.AdvisorsPageModule
      ),
  },
  {
    path: 'payment-modal',
    loadChildren: () =>
      import('./screens/payment-modal/payment-modal.module').then(
        (m) => m.PaymentModalPageModule
      ),
  },
  {
    path: 'account',
    loadChildren: () =>
      import('./screens/account/account.module').then(
        (m) => m.AccountPageModule
      ),
  },
  {
    path: 'group-post',
    loadChildren: () =>
      import('./screens/group-post/group-post.module').then(
        (m) => m.GroupPostPageModule
      ),
  },
  {
    path: 'my-groups',
    loadChildren: () =>
      import('./screens/my-groups/my-groups.module').then(
        (m) => m.MyGroupsPageModule
      ),
  },
  {
    path: 'comment-modal',
    loadChildren: () =>
      import('./screens/comment-modal/comment-modal.module').then(
        (m) => m.CommentModalPageModule
      ),
  },
  {
    path: 'date-picker',
    loadChildren: () => import('./screens/date-picker/date-picker.module').then( m => m.DatePickerPageModule)
  },
  {
    path: 'advisor-details',
    loadChildren: () => import('./screens/advisor-details/advisor-details.module').then( m => m.AdvisorDetailsPageModule)
  },
  {
    path: 'registration',
    loadChildren: () => import('./screens/registration/registration.module').then( m => m.RegistrationPageModule)
  },
  {
    path: 'change-password',
    loadChildren: () => import('./screens/change-password/change-password.module').then( m => m.ChangePasswordPageModule)
  },
  {
    path: 'forgot-password',
    loadChildren: () => import('./screens/forgot-password/forgot-password.module').then( m => m.ForgotPasswordPageModule)
  },
  {
    path: 'create-post',
    loadChildren: () => import('./screens/create-post/create-post.module').then( m => m.CreatePostPageModule)
  },
  {
    path: 'view-image',
    loadChildren: () => import('./screens/view-image/view-image.module').then( m => m.ViewImagePageModule)
  },
  {
    path: 'search-group',
    loadChildren: () => import('./screens/search-group/search-group.module').then( m => m.SearchGroupPageModule)
  },
  {
    path: 'cms-page',
    loadChildren: () => import('./screens/cms-page/cms-page.module').then( m => m.CmsPagePageModule)
  },
  {
    path: 'privacy-policy',
    loadChildren: () => import('./screens/privacy-policy/privacy-policy.module').then( m => m.PrivacyPolicyPageModule)
  },

  {
    path: 'terms-and-conditions',
    loadChildren: () => import('./screens/terms-and-conditions/terms-and-conditions.module').then( m => m.TermsAndConditionsPageModule)
  },
  {
    path: 'members-list',
    loadChildren: () => import('./screens/members-list/members-list.module').then( m => m.MembersListPageModule)
  },
  {
    path: 'chat-page',
    loadChildren: () => import('./screens/chat-page/chat-page.module').then( m => m.ChatPagePageModule)
  },
  {
    path: 'contact-us',
    loadChildren: () => import('./screens/contact-us/contact-us.module').then( m => m.ContactUsPageModule)
  },
  {
    path: 'my-calender',
    loadChildren: () => import('./screens/my-calender/my-calender.module').then( m => m.MyCalenderPageModule)
  },
  {
    path: 'my-leave',
    loadChildren: () => import('./screens/my-leave/my-leave.module').then( m => m.MyLeavePageModule)
  },
  {
    path: 'my-booking',
    loadChildren: () => import('./screens/my-booking/my-booking.module').then( m => m.MyBookingPageModule)
  },
  {
    path: 'transaction-history',
    loadChildren: () => import('./screens/transaction-history/transaction-history.module').then( m => m.TransactionHistoryPageModule)
  },
  {
    path: 'add-consultation-charge',
    loadChildren: () => import('./screens/add-consultation-charge/add-consultation-charge.module').then( m => m.AddConsultationChargePageModule)
  },
  {
    path: 'my-message',
    loadChildren: () => import('./screens/my-message/my-message.module').then( m => m.MyMessagePageModule)
  },
  {
    path: 'sucess-page',
    loadChildren: () => import('./sucess-page/sucess-page.module').then( m => m.SucessPagePageModule)
  },
  
  {
    path: 'aditional-details',
    loadChildren: () => import('./screens/aditional-details/aditional-details.module').then( m => m.AditionalDetailsPageModule)
  },
 
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
