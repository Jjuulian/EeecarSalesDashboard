import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MainDashboard } from './main-dashboard/main-dashboard';
import { PersonalDashboard } from './personal-dashboard/personal-dashboard';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, MainDashboard, PersonalDashboard],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
  standalone: true
})
export class Dashboard {

  activeTab: string = "resumen";

  toggleTab(tabName: string) {
    this.activeTab = tabName;
  }
}
