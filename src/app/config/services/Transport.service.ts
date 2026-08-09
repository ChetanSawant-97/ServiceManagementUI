import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TransportDetails, TransportPayload } from '../models/TripMaster';
import { ApiResponse, ConfigEndpoints } from '../../common/ApiConstants';
import { BaseApiService } from '../../common/base-api-service';
// Import your BaseApiService

@Injectable({
  providedIn: 'root'
})
export class TransportService {
  // Inject BaseApi instead of HttpClient
  private baseApi = inject(BaseApiService);

  /**
   * Fetches all transport records
   */
  getAllTransports(): Observable<ApiResponse<TransportDetails[]>> {
    return this.baseApi.request<ApiResponse<TransportDetails[]>>(
      ConfigEndpoints.GET_ALL_TRANSPORTS
    );
  }

  /**
   * Fetches a specific transport record by ID
   */
  getTransportById(transportId: number): Observable<ApiResponse<TransportDetails>> {
    return this.baseApi.request<ApiResponse<TransportDetails>>(
      ConfigEndpoints.TRANSPORT_BY_ID,
      undefined, // No body for a GET request
      { pathParams: { transportId } } // BaseApi handles the string replacement automatically!
    );
  }

  /**
   * Creates a new transport record
   */
  createTransport(payload: TransportPayload): Observable<ApiResponse<TransportDetails>> {
    return this.baseApi.request<ApiResponse<TransportDetails>, TransportPayload>(
      ConfigEndpoints.CREATE_TRANSPORT, 
      payload,
      { successMessage: 'Transport mode created successfully!' } // Optional: free toast notification!
    );
  }

  /**
   * Updates an existing transport record
   */
  updateTransport(transportId: number, payload: TransportPayload): Observable<ApiResponse<TransportDetails>> {
    return this.baseApi.request<ApiResponse<TransportDetails>, TransportPayload>(
      ConfigEndpoints.UPDATE_TRANSPORT, 
      payload,
      { 
        pathParams: { transportId },
        successMessage: 'Transport mode updated!' 
      }
    );
  }

  /**
   * Soft deletes a transport record
   */
  deleteTransport(transportId: number): Observable<ApiResponse<{}>> {
    return this.baseApi.request<ApiResponse<{}>>(
      ConfigEndpoints.DELETE_TRANSPORT,
      undefined,
      { 
        pathParams: { transportId },
        successMessage: 'Transport mode deleted.'
      }
    );
  }
}