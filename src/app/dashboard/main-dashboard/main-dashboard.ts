import { Component } from '@angular/core';
import { DashboardPanel } from './panels/dashboard-panel/dashboard-panel';
import { WeeklyObjectivesPanel } from './panels/weekly-objectives-panel/weekly-objectives-panel';
import { GraphicPanel } from './panels/graphic-panel/graphic-panel';
import { WeeklyObjectives } from '../../models/weekly-objectives';

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

  weeklyObjective : WeeklyObjectives = {
    totalMonth: 150000,
    day: 7500,
    weeks: [
      { label: "Semana 1", proformedEu: 2, proformedVG: 1, chargedEU: 1, chargedVG: 1, objective: 37500, accumulated: 10000 },
      { label: "Semana 2", proformedEu: 3, proformedVG: 2, chargedEU: 2, chargedVG: 2, objective: 37500, accumulated: 75000 },
      { label: "Semana 3", proformedEu: 4, proformedVG: 3, chargedEU: 3, chargedVG: 3, objective: 37500, accumulated: 112500 },
      { label: "Semana 4", proformedEu: 5, proformedVG: 4, chargedEU: 4, chargedVG: 4, objective: 37500, accumulated: 150000 },
    ],
    daysInMonth: 20
  };

  holidays: string[] = [
    '2026-01-01',
    '2026-01-06',
    '2026-01-20',
    '2026-03-02',
    '2026-04-02',
    '2026-04-03',
    '2026-04-06', 
    '2026-05-01',
    '2026-06-24',
    '2026-08-15', 
    '2026-10-12', 
    '2026-11-01', 
    '2026-12-25',
    '2026-12-26' 
  ];

}
