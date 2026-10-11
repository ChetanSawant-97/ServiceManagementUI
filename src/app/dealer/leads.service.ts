import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from '../common/base-api-service';
import { Lead } from './models/Leads';
import { DistributorEndpoints } from '../common/ApiConstants';


export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

@Injectable({
  providedIn: 'root'
})
export class LeadService {
  private baseApi = inject(BaseApiService);

  getLeads(salesId?: number): Observable<ApiResponse<Lead[]>> {
    // Clone the endpoint config so we don't mutate the global constant
    const endpoint = { ...DistributorEndpoints.GET_DISTRIBUTORS };
    
    if (salesId) {
      endpoint.url += `?salesId=${salesId}`;
    }

    return this.baseApi.request<ApiResponse<Lead[]>>(
      endpoint,
      null, 
      { showLoader: true }
    );
  }
}