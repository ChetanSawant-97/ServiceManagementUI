import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { SelectComponent } from '../../../common/forms/components/input-select/input-select';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MapComponent, LngLat } from '../map-component/map-component';

@Component({
  selector: 'app-track-sales',
  standalone: true,
  imports: [CommonModule, SelectComponent, ReactiveFormsModule, MapComponent],
  templateUrl: './track-sales.html',
  styleUrl: './track-sales.scss',
})
export class TrackSales implements OnInit, OnDestroy {
  public viewMode : 'history' | 'live' = 'live';
  public selectedPersonControl = new FormControl(null);
  public personOptions = [
    { label: 'John Doe', value: 'john_doe' },
    { label: 'Jane Smith', value: 'jane_smith' },
    { label: 'Alice Johnson', value: 'alice_johnson' },
  ];

  // Starting coordinate
  private readonly startLng = 79.0882;
  private readonly startLat = 21.1458;

  // Historical breadcrumb path
  userHistoryCoords = signal<LngLat[]>([[this.startLng, this.startLat]]);

  // Active moving point
  currentPushedLocation = signal<LngLat>([this.startLng, this.startLat]);

  private simulationInterval: any = null;
  private simulationPath: LngLat[] = [];
  private currentIndex = 0;

  ngOnInit(): void {
    this.simulationPath = this.generateSmoothRoute(this.startLng, this.startLat, 1000);

    this.startSimulation();
  }

  ngOnDestroy(): void {
    if (this.simulationInterval) {
      clearInterval(this.simulationInterval);
    }
  }

  private startSimulation(): void {
    this.simulationInterval = setInterval(() => {
      if (this.currentIndex >= this.simulationPath.length) {
        // Reset or loop when finished
        this.currentIndex = 0;
        this.userHistoryCoords.set([this.simulationPath[0]]);
      }

      const nextCoord = this.simulationPath[this.currentIndex];
      this.onNewGpsPing(nextCoord);
      this.currentIndex++;
    }, 1000); // Speed: emits a new GPS ping every 300ms
  }

  onNewGpsPing(newCoord: LngLat): void {
    this.currentPushedLocation.set(newCoord);
    this.userHistoryCoords.update(history => [...history, newCoord]);
  }

  /**
   * Generates a continuous winding road path of N points
   */
  private generateSmoothRoute(startLng: number, startLat: number, totalPoints: number): LngLat[] {
    const points: LngLat[] = [];
    let lng = startLng;
    let lat = startLat;
    let angle = 0;

    for (let i = 0; i < totalPoints; i++) {
      // Create organic curves simulating turns on city roads
      angle += (Math.random() - 0.5) * 0.4;
      const step = 0.00015; // ~15 meters per tick

      lng += Math.cos(angle) * step;
      lat += Math.sin(angle) * step;

      points.push([+lng.toFixed(6), +lat.toFixed(6)]);
    }

    return points;
  }
}