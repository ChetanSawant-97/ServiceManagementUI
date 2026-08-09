import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DesignationDetails, DesignationPayload } from '../models/Designation';
import { ApiResponse, DesignationEndpoints } from '../../common/ApiConstants';
import { BaseApiService } from '../../common/base-api-service';

@Injectable({
  providedIn: 'root'
})
export class DesignationService {
  private baseApi = inject(BaseApiService);

  getAllDesignations(): Observable<ApiResponse<DesignationDetails[]>> {
    return this.baseApi.request<ApiResponse<DesignationDetails[]>>(
      DesignationEndpoints.GET_ALL_DESIGNATIONS
    );
  }

  getDesignationById(designationId: number): Observable<ApiResponse<DesignationDetails>> {
    return this.baseApi.request<ApiResponse<DesignationDetails>>(
      DesignationEndpoints.GET_DESIGNATION_BY_ID,
      undefined,
      { pathParams: { designationId } }
    );
  }

  createDesignation(payload: DesignationPayload): Observable<ApiResponse<DesignationDetails>> {
    return this.baseApi.request<ApiResponse<DesignationDetails>, DesignationPayload>(
      DesignationEndpoints.CREATE_DESIGNATION, 
      payload,
      { successMessage: 'Designation created successfully!' }
    );
  }

  updateDesignation(designationId: number, payload: DesignationPayload): Observable<ApiResponse<DesignationDetails>> {
    return this.baseApi.request<ApiResponse<DesignationDetails>, DesignationPayload>(
      DesignationEndpoints.UPDATE_DESIGNATION, 
      payload,
      { 
        pathParams: { designationId },
        successMessage: 'Designation updated successfully!' 
      }
    );
  }

  deleteDesignation(designationId: number): Observable<ApiResponse<{}>> {
    return this.baseApi.request<ApiResponse<{}>>(
      DesignationEndpoints.DELETE_DESIGNATION,
      undefined,
      { 
        pathParams: { designationId },
        successMessage: 'Designation deleted successfully.'
      }
    );
  }
}