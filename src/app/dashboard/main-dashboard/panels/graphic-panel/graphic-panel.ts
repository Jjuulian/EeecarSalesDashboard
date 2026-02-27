import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-graphic-panel',
  imports: [CommonModule],
  templateUrl: './graphic-panel.html',
  styleUrl: './graphic-panel.css',
  standalone: true
})
export class GraphicPanel {
  @Input() incomePoints: number[] = [];
  @Input() benefitsPoints: number[] = [];
  hovered: { series: 'income' | 'benefit'; i: number } | null = null;
  coords(points?: number[]) {
  const safe = points ?? [];
  const total = safe.length;
  if (!total) return [];
  return safe.map((v, i) => ({
    i,
    v,
    x: this.scaleX(i, total),
    y: this.scaleY(v),
  }));
}

  width = 760;
  height = 300;
  paddingX = 60;
  paddingY = 40;

  get maxValue(): number {
    return Math.max(
      ...this.incomePoints,
      ...this.benefitsPoints,
      1
    );
  }

  private scaleX(index: number, total: number): number {
    if (total <= 1) return this.paddingX;
    const usableWidth = this.width - this.paddingX * 2;
    return this.paddingX + (usableWidth / (total - 1)) * index;
  }

  private scaleY(value: number): number {
    const usableHeight = this.height - this.paddingY;
    return this.height - (value / this.maxValue) * usableHeight;
  }

  buildPath(points: number[]): string {
    if (!points.length) return '';

    return points
      .map((value, index) => {
        const x = this.scaleX(index, points.length);
        const y = this.scaleY(value);
        return `${index === 0 ? 'M' : 'L'}${x},${y}`;
      })
      .join(' ');
  }

  buildArea(points: number[]): string {
    if (!points.length) return '';

    const line = this.buildPath(points);
    return `${line} L${this.width - this.paddingX},${this.height} L${this.paddingX},${this.height} Z`;
  }

    onEnter(series: 'income' | 'benefit', i: number) {
    this.hovered = { series, i };
  }

  onLeave() {
    this.hovered = null;
  }

  get hoveredPoint() {
    if (!this.hovered) return null;
    const arr = this.hovered.series === 'income' ? this.incomePoints : this.benefitsPoints;
    const p = this.coords(arr)[this.hovered.i];
    return p ?? null;
  }

  formatValue(v: number) {
    return v.toLocaleString('es-ES');
  }

  tipW(v: number) {
    const s = this.formatValue(v);
    return Math.max(56, 18 + s.length * 7);
  }

  tipX(x: number) {
    const w = 90; // ancho aprox (si quieres exacto usa tipW con hoveredPoint)
    const maxX = this.width - this.paddingX;
    return (x + w > maxX) ? (x - w - 12) : (x + 10);
  }
}
