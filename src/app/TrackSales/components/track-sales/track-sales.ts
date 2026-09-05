import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, signal, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { SelectComponent } from '../../../common/forms/components/input-select/input-select';
import { MapComponent, LngLat } from '../map-component/map-component';
import { SalesPersonService } from '../../../sales/services/SalesPerson.service';
import { TripService } from '../../services/trip.service';
import { Subscription, timer, switchMap, catchError, of } from 'rxjs';

@Component({
  selector: 'app-track-sales',
  standalone: true,
  imports: [CommonModule, SelectComponent, ReactiveFormsModule, MapComponent],
  templateUrl: './track-sales.html',
  styleUrl: './track-sales.scss',
})
export class TrackSales implements OnInit, OnDestroy {
  private salesService = inject(SalesPersonService);
  private tripService = inject(TripService);

  public viewMode : 'history' | 'live' = 'live';
  public selectedPersonControl = new FormControl(null);
  public tripControl = new FormControl(null);
  
  public personOptions: { label: string; value: number }[] = [];
  public tripDetails: {label: string, value: number}[] = [];
  private rawTrips: any[] = []; 

  private readonly defaultLng = 79.0882;
  private readonly defaultLat = 21.1458;

  userHistoryCoords = signal<LngLat[]>([[this.defaultLng, this.defaultLat]]);
  currentPushedLocation = signal<LngLat>([this.defaultLng, this.defaultLat]);

  private livePollingSub?: Subscription;

  ngOnInit(): void {
    // 1. Load Sales Persons
    this.salesService.getAllSalesPersons().subscribe({
      next: (response) => {
        if (response && response.data) {
          this.personOptions = response.data.map(salesPerson => ({
            label: salesPerson.fullName,
            value: salesPerson.salesPersonId 
          }));
        }
      },
      error: (error) => console.error('Error fetching sales persons:', error)
    });

    // 2. Listen to Person Selection to load Trips
    this.selectedPersonControl.valueChanges.subscribe(selectedId => {
      this.cancelLivePolling(); 

      if (selectedId) {
        this.tripService.getTrips(selectedId).subscribe({
          next: (response: any) => {
            const tripsArray = Array.isArray(response) ? response : response?.data;
            
            if (tripsArray && tripsArray.length > 0) {
              this.rawTrips = tripsArray; 
              
              this.tripDetails = tripsArray.map((trip: any) => {
                return {
                  // FIX: Use our new custom formatter
                  label: this.formatTripLabel(trip.startedAt, trip.status),
                  value: trip.id
                };
              });
            } else {
              this.tripDetails = []; 
              this.rawTrips = [];
            }
          },
          error: (error) => {
            console.error('Error fetching trips:', error);
            this.tripDetails = [];
            this.rawTrips = [];
          }
        });
      } else {
        this.tripDetails = [];
        this.rawTrips = [];
        this.tripControl.reset();
      }
    });

    // 3. Listen to Trip Selection to load Map Pings
    this.tripControl.valueChanges.subscribe(tripId => {
      this.cancelLivePolling(); 

      if (tripId) {
        const selectedTrip = this.rawTrips.find(t => t.id === tripId);
        this.viewMode = selectedTrip?.status === 'ACTIVE' ? 'live' : 'history';

        if (this.viewMode === 'live') {
          // --- ACTIVE TRIP: Poll the API every 10 seconds ---
          this.livePollingSub = timer(0, 10000).pipe(
            switchMap(() => this.tripService.getTripPings(tripId).pipe(
              catchError(error => {
                console.error('Error fetching live pings:', error);
                return of(null);
              })
            ))
          ).subscribe(response => {
            if (response) this.processMapData(response);
          });

        } else {
           // <-- add this
          this.tripService.getTripPings(tripId).subscribe({
            next: (response) => {
              console.warn('RAW getTripPings response:', response); // <-- add this
              this.processMapData(response);
            },
            error: (error) => {
              console.error('Error fetching trip history:', error);
              this.clearMapData();
            }
          });
        }
      } else {
        this.clearMapData();
      }
    });
  }

  ngOnDestroy(): void {
    this.cancelLivePolling();
  }

  /**
   * Helper to format dates like "6th Sep 2026 - Active"
   */
  private formatTripLabel(isoDateString: string, status: string): string {
    const date = new Date(isoDateString);
    const day = date.getDate();
    
    // Calculate ordinal suffix (st, nd, rd, th)
    const suffix = (day >= 11 && day <= 13) ? 'th' : ['th', 'st', 'nd', 'rd'][day % 10] || 'th';
    const month = date.toLocaleString('en-US', { month: 'short' });
    const year = date.getFullYear();
    
    const formattedDate = `${day}${suffix} ${month} ${year}`;
    const statusText = status === 'ACTIVE' ? 'Active' : 'Completed';
    
    return `${formattedDate} - ${statusText}`;
  }

  private processMapData(response: any) {
    // Handle: flat array of pings, {data: [...]}, a single trip object with .waypoints,
    // or an array of trip objects each with .waypoints
    let pingsArray: any[] = [];
  
    if (Array.isArray(response)) {
      // Could be an array of raw pings OR an array of trip objects
      if (response.length > 0 && response[0]?.waypoints) {
        pingsArray = response.flatMap((trip: any) => trip.waypoints ?? []);
      } else {
        pingsArray = response;
      }
    } else if (response?.waypoints) {
      pingsArray = response.waypoints;
    } else if (response?.data) {
      pingsArray = Array.isArray(response.data) ? response.data : response.data.waypoints ?? [];
    }
  
    if (pingsArray && pingsArray.length > 0) {
      const coordinates: LngLat[] = pingsArray
        .filter((p: any) => p.longitude != null && p.latitude != null)
        .map((p: any) => [p.longitude, p.latitude]);
  
      if (coordinates.length > 0) {
        this.userHistoryCoords.set(coordinates);
        this.currentPushedLocation.set(coordinates[coordinates.length - 1]);
        return;
      }
    }
  
    if (this.viewMode === 'history') {
      this.clearMapData();
    }
  }

 
  private cancelLivePolling() {
    if (this.livePollingSub) {
      this.livePollingSub.unsubscribe();
      this.livePollingSub = undefined;
    }
  }

  private clearMapData() {
    this.userHistoryCoords.set([[this.defaultLng, this.defaultLat]]);
    this.currentPushedLocation.set([this.defaultLng, this.defaultLat]);
  }
}