import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from '../../common/base-api-service';
import { ApiResponse, OrderEndpoints } from '../../common/ApiConstants';
import { OrderMaster, OrderPayload } from '../models/OrderMaster';
 // Adjust path as needed

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private baseApi = inject(BaseApiService);

  getAllOrders(): Observable<ApiResponse<OrderMaster[]>> {
    return this.baseApi.request<ApiResponse<OrderMaster[]>>(
      OrderEndpoints.GET_ALL_ORDERS
    );
  }

  getOrderById(orderId: number): Observable<ApiResponse<OrderMaster>> {
    return this.baseApi.request<ApiResponse<OrderMaster>>(
        OrderEndpoints.GET_ORDER_BY_ID,
      undefined,
      { pathParams: { orderId } }
    );
  }

  createOrder(payload: OrderPayload): Observable<ApiResponse<OrderMaster>> {
    return this.baseApi.request<ApiResponse<OrderMaster>>(
        OrderEndpoints.CREATE_ORDER,
      payload,
      { successMessage: 'Order created successfully!' }
    );
  }

  updateOrder(orderId: number, payload: OrderPayload): Observable<ApiResponse<OrderMaster>> {
    return this.baseApi.request<ApiResponse<OrderMaster>>(
        OrderEndpoints.UPDATE_ORDER,
      payload,
      { 
        pathParams: { orderId },
        successMessage: 'Order updated successfully!'
      }
    );
  }

  deleteOrder(orderId: number): Observable<ApiResponse<any>> {
    return this.baseApi.request<ApiResponse<any>>(
        OrderEndpoints.DELETE_ORDER,
      undefined,
      { 
        pathParams: { orderId },
        successMessage: 'Order deleted successfully!'
      }
    );
  }

  uploadBillImage(orderId: number, fileData: { file: string }): Observable<ApiResponse<OrderMaster>> {
    return this.baseApi.request<ApiResponse<OrderMaster>>(
        OrderEndpoints.UPLOAD_ORDER_BILL,
      fileData,
      { 
        pathParams: { orderId },
        successMessage: 'Bill image uploaded successfully!'
      }
    );
  }

  getOrdersByDealer(dealerId: number): Observable<ApiResponse<OrderMaster[]>> {
    return this.baseApi.request<ApiResponse<OrderMaster[]>>(
      OrderEndpoints.GET_ORDERS_BY_DEALER,
      undefined, 
      { pathParams: { dealerId } } 
    );
  }
}