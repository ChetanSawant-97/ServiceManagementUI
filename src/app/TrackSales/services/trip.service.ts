import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from '../../common/base-api-service';
import { ApiResponse } from '../../common/ApiConstants';
import { TripEndpoints } from '../../common/ApiConstants';
import { Trip, TripPing, TripPingsResponse } from '../models/trip.model';
import { TripReportRequest, TripReportResponse } from '../models/trip-report.model';

@Injectable({
  providedIn: 'root'
})
export class TripService {
  private baseApi = inject(BaseApiService);

  /**
   * Fetches trips. If a salesPersonId is provided, filters the trips for that specific user.
   */
  getTrips(salesPersonId?: number): Observable<ApiResponse<Trip[]>> {
    if (salesPersonId) {
      return this.baseApi.request<ApiResponse<Trip[]>>(
        TripEndpoints.GET_TRIPS_BY_SALES_PERSON,
        undefined, // No body for GET
        { pathParams: { salesPersonId } } // BaseApi will replace {salesPersonId} in the URL
      );
    }
    
    // Fallback to fetch all if no ID is passed
    return this.baseApi.request<ApiResponse<Trip[]>>(
      TripEndpoints.GET_ALL_TRIPS
    );
  }

  /**
   * Fetches the location pings and leads for a specific trip ID.
   */
  getTripPings(tripId: number): Observable<ApiResponse<TripPingsResponse>> {
    return this.baseApi.request<ApiResponse<TripPingsResponse>>(
      TripEndpoints.GET_TRIP_PINGS,
      undefined, 
      { pathParams: { tripId } } 
    );
  }

  getTripReport(payload: TripReportRequest): Observable<ApiResponse<TripReportResponse[]>> {
    return this.baseApi.request<ApiResponse<TripReportResponse[]>, TripReportRequest>(
      TripEndpoints.GET_TRIP_REPORT,
      payload
    );
  }
}