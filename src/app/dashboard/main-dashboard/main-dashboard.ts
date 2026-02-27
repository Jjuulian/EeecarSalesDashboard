import { Component } from '@angular/core';
import { DashboardPanel } from './panels/dashboard-panel/dashboard-panel';
import { WeeklyObjectivesPanel } from './panels/weekly-objectives-panel/weekly-objectives-panel';
import { GraphicPanel } from './panels/graphic-panel/graphic-panel';

@Component({
  selector: 'app-main-dashboard',
  imports: [DashboardPanel, WeeklyObjectivesPanel, GraphicPanel],
  templateUrl: './main-dashboard.html',
  styleUrl: './main-dashboard.css',
  standalone: true
})
export class MainDashboard {
  incomePoints = [0, 29000, 34000, 41000, 30000, 38000, 45000, 40000];
  benefitsPoints = [0, 8000, 10000, 12000, 8500, 11555, 13555, 11555];

}
