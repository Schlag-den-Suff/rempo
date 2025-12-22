import { Component } from '@angular/core';

@Component({
  selector: 'app-landing-page',
  standalone: false,
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss'
})
export class LandingPageComponent {
  allHyperscalersSelected = false;
  selectedHyperscalers = { aws: false, azure: false, gcp: false };
  allSuperscalersSelected = false;
  selectedSuperscalers = { Stackit: false, IONOS: false, OVHcloud: false };
  selectedIndex: number = 0;
  toggleAllHyperscalers(checked: boolean)
  { this.selectedHyperscalers = { aws: checked, azure: checked, gcp: checked }; }
  toggleAllSuperscalers(checked: boolean)
  { this.selectedSuperscalers = { Stackit: checked, IONOS: checked, OVHcloud: checked }; }

  nextStep() {
    if (this.selectedIndex < 2) { // number of tabs - 1
      this.selectedIndex++;
    }
  }
}
