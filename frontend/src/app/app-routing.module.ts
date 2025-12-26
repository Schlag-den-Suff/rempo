import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {SiteStructureComponent} from './shared/components/site-structure/site-structure.component';
import {AboutUsComponent} from './shared/components/about-us/about-us.component';
import {ImprintComponent} from './shared/components/imprint/imprint.component';
import {DataPolicyComponent} from './shared/components/data-policy/data-policy.component';
import {LandingPageComponent} from './features/landing-page/landing-page.component';
import {LoginComponent} from './features/user-management/login/login.component';
import {AccountCreationComponent} from './features/user-management/account-creation/account-creation.component';
import {GamesComponent} from './features/games/games.component';
import {AuthGuard} from './auth/auth.guard';
import {MyGamesComponent} from './features/my-games/my-games';
import {GameManagementComponent} from './features/game-management/game-management';
import {CreateNewGameComponent} from './features/create-new-game/create-new-game';

const routes: Routes = [
  {
    path: '',
    component: SiteStructureComponent,
    children: [
      { path: '', component: LandingPageComponent },
      { path: 'games', component: GamesComponent, canActivate: [AuthGuard] },
      { path: 'my-games', component: MyGamesComponent, canActivate: [AuthGuard] },
      { path: 'game-management', component: GameManagementComponent, canActivate: [AuthGuard] },
      { path: 'create-new-game', component: CreateNewGameComponent, canActivate: [AuthGuard] },
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
