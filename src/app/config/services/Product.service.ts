import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse, ProductEndpoints } from '../../common/ApiConstants';
import { BaseApiService } from '../../common/base-api-service';
import { ProductDetails, ProductPayload } from '../models/ProductMaster';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private baseApi = inject(BaseApiService);

  getAllProducts(): Observable<ApiResponse<ProductDetails[]>> {
    return this.baseApi.request<ApiResponse<ProductDetails[]>>(
      ProductEndpoints.GET_ALL_PRODUCTS
    );
  }

  getProductById(productId: number): Observable<ApiResponse<ProductDetails>> {
    return this.baseApi.request<ApiResponse<ProductDetails>>(
      ProductEndpoints.GET_PRODUCT_BY_ID,
      undefined,
      { pathParams: { productId } }
    );
  }

  createProduct(payload: ProductPayload): Observable<ApiResponse<ProductDetails>> {
    return this.baseApi.request<ApiResponse<ProductDetails>, ProductPayload>(
      ProductEndpoints.CREATE_PRODUCT, 
      payload,
      { successMessage: 'Product created successfully!' }
    );
  }

  updateProduct(productId: number, payload: ProductPayload): Observable<ApiResponse<ProductDetails>> {
    return this.baseApi.request<ApiResponse<ProductDetails>, ProductPayload>(
      ProductEndpoints.UPDATE_PRODUCT, 
      payload,
      { 
        pathParams: { productId },
        successMessage: 'Product updated successfully!' 
      }
    );
  }

  deleteProduct(productId: number): Observable<ApiResponse<{}>> {
    return this.baseApi.request<ApiResponse<{}>>(
      ProductEndpoints.DELETE_PRODUCT,
      undefined,
      { 
        pathParams: { productId },
        successMessage: 'Product deleted successfully.'
      }
    );
  }
}