export interface TripWaypoint {
  sequenceOrder: number;
  latitude: number;
  longitude: number;
  label: string;
  distanceFromPreviousKm: number;
  estimationMethod: string;
}

export interface Trip {
  id: number;
  salesPersonId: number;
  salesPersonName: string;
  waypoints: TripWaypoint[];
  estimatedDistanceKm: number;
  estimationMethod: string;
  actualDistanceKm: number;
  status: string;
  startedAt: string; // ISO string
  endedAt: string;   // ISO string
}

export interface TripPing {
  id: number;
  latitude: number;
  longitude: number;
  capturedAt: string; // ISO string
}

// NEW: Model for the leads returned in the pings response
export interface TripLead {
  latitude: number;
  longitude: number;
  leadName: string | null;
}

// NEW: Wrapper model for the updated endpoint response
export interface TripPingsResponse {
  pings: TripPing[];
  leads: TripLead[];
}