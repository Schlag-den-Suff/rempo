import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {SiteStructureComponent} from './shared/components/site-structure/site-structure.component';
import {AboutUsComponent} from './shared/components/about-us/about-us.component';
import {ImprintComponent} from './shared/components/imprint/imprint.component';
import {DataPolicyComponent} from './shared/components/data-policy/data-policy.component';
import {LandingPageComponent} from './features/landing-page/landing-page.component';
import {LoginComponent} from './features/user-management/login/login.component';
import {AccountCreationComponent} from './features/user-management/account-creation/account-creation.component';
import {ResultComponent} from './features/result/result.component';

const routes: Routes = [
  {
    path: '',
    component: SiteStructureComponent,
    children: [
      { path: '', component: LandingPageComponent },
      { path: 'result', component: ResultComponent },
      {
        path: 'ueber-uns',
        component: AboutUsComponent,
      },
      {
        path: 'impressum',
        component: ImprintComponent,
      },
      {
        path: 'datenschutz',
        component: DataPolicyComponent,
      },
    ],
  },
  { path: 'login', component: LoginComponent },
  { path: 'registrieren', component: AccountCreationComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
