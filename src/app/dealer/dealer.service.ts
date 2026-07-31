import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from '../common/base-api-service';
import { ApiResponse, DealerEndPoints } from '../common/ApiConstants';
import { DealerCreatePayload, DealerMaster, DealerUpdatePayload } from './models/DealerMaster';

@Injectable({
  providedIn: 'root'
})
export class DealerService {
  private baseApi = inject(BaseApiService);

  getAllDealers(): Observable<ApiResponse<DealerMaster[]>> {
    return this.baseApi.request<ApiResponse<DealerMaster[]>>(
      DealerEndPoints.GET_ALL_DEALERS
    );
  }

  getDealerById(dealerId: number): Observable<ApiResponse<DealerMaster>> {
    return this.baseApi.request<ApiResponse<DealerMaster>>(
      DealerEndPoints.GET_DEALER_BY_ID,
      undefined,
      { pathParams: { dealerId } }
    );
  }

  createDealer(payload: DealerCreatePayload): Observable<ApiResponse<DealerMaster>> {
    return this.baseApi.request<ApiResponse<DealerMaster>>(
      DealerEndPoints.CREATE_DEALER,
      payload,
      { successMessage: 'Dealer created successfully!' }
    );
  }

  updateDealer(dealerId: number, payload: DealerUpdatePayload): Observable<ApiResponse<DealerMaster>> {
    return this.baseApi.request<ApiResponse<DealerMaster>>(
      DealerEndPoints.UPDATE_DEALER,
      payload,
      { 
        pathParams: { dealerId },
        successMessage: 'Dealer updated successfully!'
      }
    );
  }

  deleteDealer(dealerId: number): Observable<ApiResponse<any>> {
    return this.baseApi.request<ApiResponse<any>>(
      DealerEndPoints.DELETE_DEALER,
      undefined,
      { 
        pathParams: { dealerId },
        successMessage: 'Dealer deleted successfully!'
      }
    );
  }
}