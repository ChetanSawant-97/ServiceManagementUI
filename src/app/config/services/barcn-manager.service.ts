import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from '../../common/base-api-service';
import { ApiResponse, BranchManagerEndpoints } from '../../common/ApiConstants';
import { BranchManagerData, CreateBranchManagerPayload } from '../models/BranchManager';

@Injectable({
  providedIn: 'root'
})
export class BranchManagerService {
  private baseApi = inject(BaseApiService);

  createBranchManager(payload: CreateBranchManagerPayload): Observable<ApiResponse<BranchManagerData>> {
    return this.baseApi.request<ApiResponse<BranchManagerData>, CreateBranchManagerPayload>(
      BranchManagerEndpoints.CREATE_BRANCH_MANAGER,
      payload,
      { 
        showLoader: true,
        successMessage: 'Branch Manager created successfully' 
      }
    );
  }
}