import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from '../../common/base-api-service';
import { ApiResponse, SalesPersonEndpoints } from '../../common/ApiConstants';
import { SalesPerson, SalesPersonPayload } from '../models/SalesPersons';

@Injectable({
  providedIn: 'root'
})
export class SalesPersonService {
  private baseApi = inject(BaseApiService);

  getAllSalesPersons(): Observable<ApiResponse<SalesPerson[]>> {
    return this.baseApi.request<ApiResponse<SalesPerson[]>>(
      SalesPersonEndpoints.GET_ALL_SALES_PERSONS
    );
  }

  getSalesPersonById(userId: number): Observable<ApiResponse<SalesPerson>> {
    return this.baseApi.request<ApiResponse<SalesPerson>>(
      SalesPersonEndpoints.GET_SALES_PERSON_BY_ID,
      undefined,
      { pathParams: { userId } }
    );
  }

  createSalesPerson(payload: SalesPersonPayload): Observable<ApiResponse<SalesPerson>> {
    return this.baseApi.request<ApiResponse<SalesPerson>>(
      SalesPersonEndpoints.CREATE_SALES_PERSON,
      payload,
      { successMessage: 'Sales Person created successfully!' }
    );
  }

  updateSalesPerson(userId: number, payload: SalesPersonPayload): Observable<ApiResponse<SalesPerson>> {
    return this.baseApi.request<ApiResponse<SalesPerson>>(
      SalesPersonEndpoints.UPDATE_SALES_PERSON,
      payload,
      { 
        pathParams: { userId },
        successMessage: 'Sales Person updated successfully!'
      }
    );
  }

  deleteSalesPerson(userId: number): Observable<ApiResponse<any>> {
    return this.baseApi.request<ApiResponse<any>>(
      SalesPersonEndpoints.DELETE_SALES_PERSON,
      undefined,
      { 
        pathParams: { userId },
        successMessage: 'Sales Person deleted successfully!'
      }
    );
  }
}