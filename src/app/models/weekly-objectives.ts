import { WeekRow } from "./week-row";

export interface WeeklyObjectives {
    totalMonth:number; 
    day:number; 
    weeks:WeekRow[]; 
    daysInMonth:number;
}