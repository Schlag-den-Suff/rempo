import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MatSidenav} from '@angular/material/sidenav';
import {MatSnackBar} from '@angular/material/snack-bar';
import {AuthService} from '../../../auth/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-site-structure',
  standalone: false,
  templateUrl: './site-structure.component.html',
  styleUrl: './site-structure.component.scss'
})
export class SiteStructureComponent implements OnInit{
  @ViewChild('sidenav') sidenav!: MatSidenav;

  isDropdownOpen = false; // Boolean to track if the dropdown menu is open.
  isSideBarOpen = false; // Boolean to track if the side navigation bar is open.
  isBackdropVisible = false; // Boolean to track if the backdrop overlay is visible.
  isLoggedIn = false; // Boolean to check if the user is logged in.


  constructor(
    @Inject(Router) private router: Router,
    protected authService: AuthService,
  ) {
  }

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isAuthenticated();
  }

  closeAll() {
    this.toggleDropdown(false);
    this.sidenav.close().then();
    this.isSideBarOpen = this.sidenav.opened;
  }

  toggleBackdrop(show: boolean) {
    this.isBackdropVisible = show;
  }

  toggleSideBar() {
    this.sidenav.toggle().then();
    this.isSideBarOpen = this.sidenav.opened;
    this.toggleBackdrop(this.isSideBarOpen);
  }

  toggleDropdown(show: boolean) {
    this.isDropdownOpen = show;
    this.toggleBackdrop(show);
  }

  logout() {
    this.authService.logout();
    this.closeAll();
  }
}
