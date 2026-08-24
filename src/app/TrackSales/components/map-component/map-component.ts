import { Component, OnInit, computed, input } from '@angular/core';
import { NgxMapLibreGLModule } from '@maplibre/ngx-maplibre-gl';
import type { Feature, LineString, Point } from 'geojson';
import type { StyleSpecification } from 'maplibre-gl';
import { setWorkerUrl } from 'maplibre-gl';

// Turf.js helps us calculate the bounding box to fit the whole route on screen
import bbox from '@turf/bbox';
import { lineString } from '@turf/helpers';

export type LngLat = [number, number];

@Component({
  selector: 'app-map-component',
  standalone: true,
  imports: [NgxMapLibreGLModule],
  templateUrl: './map-component.html',
  styleUrl: './map-component.scss',
})
export class MapComponent implements OnInit {

  // Explicitly tell the map which mode it is in
  readonly viewMode = input<'history' | 'live'>('live');

  // Used only when viewMode === 'history'
  readonly travelHistory = input<LngLat[]>([]);

  // Used only when viewMode === 'live'
  readonly liveLocation = input<LngLat | null>(null);

  ngOnInit(): void {
    setWorkerUrl('https://unpkg.com/maplibre-gl@6.6.0/dist/maplibre-gl-worker.mjs');
  }

  // --- STATE CONTROL ---

  // 1. Center camera on the moving dot (Only works in Live Mode)
  readonly mapCenter = computed<LngLat>(() => {
    if (this.viewMode() === 'live' && this.liveLocation()) {
      return this.liveLocation()!;
    }
    // Default fallback to Nagpur
    return [79.0882, 21.1458];
  });

  // 2. Zoom out to fit the whole route (Only works in History Mode)
  readonly mapBounds = computed<[number, number, number, number] | undefined>(() => {
    if (this.viewMode() === 'history' && this.travelHistory().length > 1) {
      // Turf calculates [minLng, minLat, maxLng, maxLat]
      return bbox(lineString(this.travelHistory())) as [number, number, number, number];
    }
    return undefined;
  });

  // --- DATA SOURCES ---

  readonly routeData = computed<Feature<LineString>>(() => {
    const coords = this.travelHistory();
    return {
      type: 'Feature',
      properties: {},
      geometry: { type: 'LineString', coordinates: coords.length > 1 ? coords : [[0, 0], [0, 0]] }
    };
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

  mapStyle: StyleSpecification = {
    version: 8,
    sources: {
      'osm-tiles': {
        type: 'raster',
        tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
        tileSize: 256,
        attribution: '&copy; OSM'
      }
    },
    layers: [{ id: 'osm', type: 'raster', source: 'osm-tiles', minzoom: 0, maxzoom: 19 }]
  };
}