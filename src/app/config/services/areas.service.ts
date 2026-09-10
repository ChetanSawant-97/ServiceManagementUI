import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from '../../common/base-api-service';
import { ApiResponse, AreaEndpoints } from '../../common/ApiConstants';
import { Area, AreaPayload } from '../models/Areas';

@Injectable({
  providedIn: 'root'
})
export class AreaService {
  private baseApi = inject(BaseApiService);

  /**
   * Fetches areas. If an ID is provided, appends it as a query parameter.
   */
  getAreas(id?: number): Observable<ApiResponse<Area[]>> {
    let url = AreaEndpoints.GET_AREAS.url;
    if (id) {
      url += `?id=${id}`;
    }
    
    // Passing a custom config object since we modified the URL string
    return this.baseApi.request<ApiResponse<Area[]>>(
      { url, method: 'GET' }
    );
  }

  createArea(payload: AreaPayload): Observable<ApiResponse<Area>> {
    return this.baseApi.request<ApiResponse<Area>, AreaPayload>(
      AreaEndpoints.CREATE_AREA,
      payload,
      { successMessage: 'Area created successfully!' }
    );
  }

  updateArea(id: number, payload: AreaPayload): Observable<ApiResponse<Area>> {
    return this.baseApi.request<ApiResponse<Area>, AreaPayload>(
      AreaEndpoints.UPDATE_AREA,
      payload,
      { 
        pathParams: { id },
        successMessage: 'Area updated successfully!' 
      }
    );
  }

  deleteArea(id: number): Observable<ApiResponse<{}>> {
    return this.baseApi.request<ApiResponse<{}>>(
      AreaEndpoints.DELETE_AREA,
      undefined,
      { 
        pathParams: { id },
        successMessage: 'Area deleted successfully.' 
      }
    );
  }
}