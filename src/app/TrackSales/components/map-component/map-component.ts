import { Component, OnInit, computed, input } from '@angular/core';
import { NgxMapLibreGLModule } from '@maplibre/ngx-maplibre-gl';
import type { Feature, LineString, Point } from 'geojson';

import bbox from '@turf/bbox';
import { lineString } from '@turf/helpers';
import simplify from '@turf/simplify';

export type LngLat = [number, number];

@Component({
  selector: 'app-map-component',
  standalone: true,
  imports: [NgxMapLibreGLModule],
  templateUrl: './map-component.html',
  styleUrl: './map-component.scss',
})
export class MapComponent {

  readonly viewMode = input<'history' | 'live'>('live');
  readonly travelHistory = input<LngLat[]>([]);
  readonly liveLocation = input<LngLat | null>(null);


  // --- STATE CONTROL ---

  readonly mapCenter = computed<LngLat | undefined>(() => {
    if (this.viewMode() === 'live') {
      return this.liveLocation() ?? [79.0882, 21.1458];
    }
    return undefined;
  });

  readonly mapZoom = computed<number | undefined>(() => {
    return this.viewMode() === 'live' ? 14 : undefined;
  });

  readonly mapBounds = computed<[number, number, number, number] | undefined>(() => {
    if (this.viewMode() === 'history' && this.travelHistory().length > 1) {
      return bbox(lineString(this.travelHistory())) as [number, number, number, number];
    }
    return undefined;
  });

  public readonly emptyPoint: Feature<Point> = {
    type: 'Feature',
    properties: {},
    geometry: { type: 'Point', coordinates: [0, 0] }
  };

  private readonly rawRoute = computed<Feature<LineString>>(() => {
    const coords = this.travelHistory();
    return {
      type: 'Feature',
      properties: {},
      geometry: { type: 'LineString', coordinates: coords.length > 1 ? coords : [[0, 0], [0, 0]] }
    };
  });

  readonly routeData = computed<Feature<LineString>>(() => {
    const raw = this.rawRoute();
    if (raw.geometry.coordinates.length < 3) return raw;

    try {
      const simplified = simplify(raw, { tolerance: 0.00008, highQuality: true });
      return simplified as Feature<LineString>;
    } catch {
      return raw;
    }
  });

  readonly livePointData = computed<Feature<Point> | null>(() => {
    const loc = this.liveLocation();
    if (!loc) return null;
    return {
      type: 'Feature',
      properties: {},
      geometry: { type: 'Point', coordinates: loc }
    };
  });

  // Vector style — free, no API key, no rate limits, gives street names + POI labels
  mapStyle = 'https://api.maptiler.com/maps/streets-v2/style.json?key=bClFigFUzDBCCbTEZQCI';
}