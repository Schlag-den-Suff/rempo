import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AboutUsComponent } from './shared/components/about-us/about-us.component';
import { DataPolicyComponent } from './shared/components/data-policy/data-policy.component';
import { ImprintComponent } from './shared/components/imprint/imprint.component';
import { SiteStructureComponent } from './shared/components/site-structure/site-structure.component';
import { HeaderComponent } from './shared/components/site-structure/header/header.component';
import { FooterComponent } from './shared/components/site-structure/footer/footer.component';
import { LandingPageComponent } from './features/landing-page/landing-page.component';
import { LoginComponent } from './features/user-management/login/login.component';
import { AccountCreationComponent } from './features/user-management/account-creation/account-creation.component';
import {MatIcon} from '@angular/material/icon';
import {MatSidenav, MatSidenavContainer, MatSidenavContent} from '@angular/material/sidenav';
import {RouterModule} from '@angular/router';
import {MatDivider, MatListItem, MatListOption, MatNavList, MatSelectionList} from '@angular/material/list';
import {NgOptimizedImage} from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatMenu} from '@angular/material/menu';
import {JwtModule} from '@auth0/angular-jwt';
import { LoginFieldComponent } from './features/user-management/login/login-field/login-field.component';
import {ReactiveFormsModule} from '@angular/forms';
import {MAT_DATE_LOCALE, MatOption} from '@angular/material/core';
import {apiProvider} from './auth/auth.interceptor';
import {provideHttpClient} from '@angular/common/http';
import {MatInput} from '@angular/material/input';
import { AccountCreationFieldComponent } from './features/user-management/account-creation/account-creation-field/account-creation-field.component';
import {MatCheckbox} from '@angular/material/checkbox';
import {MatSelect} from '@angular/material/select';
import {MatTab, MatTabGroup} from '@angular/material/tabs';
import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle
} from '@angular/material/expansion';
import {MatCard, MatCardContent, MatCardHeader, MatCardTitle} from '@angular/material/card';
import { GamesComponent } from './features/games/games.component';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MyGamesComponent} from './features/my-games/my-games';
import {CreateNewGameComponent} from './features/create-new-game/create-new-game';
import {GameManagementComponent} from './features/game-management/game-management';

export function tokenGetter() {
  return localStorage.getItem('access_token');
}

@NgModule({
  declarations: [
    AppComponent,
    AboutUsComponent,
    DataPolicyComponent,
    ImprintComponent,
    SiteStructureComponent,
    HeaderComponent,
    FooterComponent,
    LandingPageComponent,
    LoginComponent,
    AccountCreationComponent,
    LoginFieldComponent,
    AccountCreationFieldComponent,
    GamesComponent,
    MyGamesComponent,
    CreateNewGameComponent,
    GameManagementComponent
  ],
  imports: [
    JwtModule.forRoot({
      config: {
        tokenGetter,
        allowedDomains: ['127.0.0.1:8000'], // Add Django backend URL here
        disallowedRoutes: ['http://127.0.0.1:8000/api/token/'],
      },
    }),
    BrowserModule,
    AppRoutingModule,
    MatIcon,
    MatSidenavContent,
    RouterModule,
    MatNavList,
    MatSidenav,
    MatSidenavContainer,
    NgOptimizedImage,
    MatListItem,
    MatButtonModule,
    MatMenu,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInput,
    MatCheckbox,
    MatSelect,
    MatOption,
    MatTab,
    MatListOption,
    MatSelectionList,
    MatExpansionPanelTitle,
    MatExpansionPanelHeader,
    MatExpansionPanel,
    MatAccordion,
    MatTabGroup,
    MatCardTitle,
    MatCardHeader,
    MatCard,
    MatDivider,
    MatCardContent,
    MatSnackBarModule,
  ],
  providers: [
    provideHttpClient(),
    apiProvider,
    { provide: MAT_DATE_LOCALE, useValue: 'de' },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
