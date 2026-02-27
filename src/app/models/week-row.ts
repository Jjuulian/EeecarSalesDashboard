export interface WeekRow {
    label: string;
    proformedEu: number | null;
    proformedVG: number | null;
    chargedEU: number | null;
    chargedVG: number | null;
    objective: number;
    accumulated: number | null;
}