export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

// Generic wrapper matching your backend response
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface EndpointConfig {
  url: string;
  method: HttpMethod;
}

export const ApiEndpoints = {
  AUTH_LOGIN: { url: '/api/auth/login', method: 'POST' },
  
  // Dealers
  GET_DEALER_BY_ID: { url: '/api/dealers/{dealerId}', method: 'GET' },
  UPDATE_DEALER:    { url: '/api/dealers/{dealerId}', method: 'PUT' },
  DELETE_DEALER:    { url: '/api/dealers/{dealerId}', method: 'DELETE' }
} as const;

export const OrderEndpoints = {
  // Orders
  GET_ALL_ORDERS:   { url: '/api/orders', method: 'GET' },
  GET_ORDER_BY_ID:  { url: '/api/orders/{orderId}', method: 'GET' },
  CREATE_ORDER:     { url: '/api/orders', method: 'POST' },
  UPDATE_ORDER:     { url: '/api/orders/{orderId}', method: 'PUT' },
  DELETE_ORDER:     { url: '/api/orders/{orderId}', method: 'DELETE' },
  UPLOAD_ORDER_BILL:{ url: '/api/orders/{orderId}/bill-image', method: 'POST' }
} as const;

export const DealerEndPoints = {
  GET_ALL_DEALERS:   { url: '/api/dealers', method: 'GET' },
  GET_DEALER_BY_ID:  { url: '/api/dealers/{dealerId}', method: 'GET' },
  CREATE_DEALER:     { url: '/api/dealers', method: 'POST' },
  UPDATE_DEALER:     { url: '/api/dealers/{dealerId}', method: 'PUT' },
  DELETE_DEALER:     { url: '/api/dealers/{dealerId}', method: 'DELETE' },
  
  UPLOAD_ORDER_BILL: { url: '/api/orders/{orderId}/bill-image', method: 'POST' }
} as const;

// NEW: Configuration Endpoints
export const ConfigEndpoints = {
  GET_ALL_TRANSPORTS:  { url: '/api/transport-details', method: 'GET' },
  TRANSPORT_BY_ID:     { url: '/api/transport-details/{transportId}', method: 'GET' },
  CREATE_TRANSPORT:    { url: '/api/transport-details', method: 'POST' },
  UPDATE_TRANSPORT:    { url: '/api/transport-details/{transportId}', method: 'PUT' },
  DELETE_TRANSPORT:    { url: '/api/transport-details/{transportId}', method: 'DELETE' }
} as const;


export const ProductEndpoints = {
  GET_ALL_PRODUCTS:  { url: '/api/products', method: 'GET' },
  GET_PRODUCT_BY_ID: { url: '/api/products/{productId}', method: 'GET' },
  CREATE_PRODUCT:    { url: '/api/products', method: 'POST' },
  UPDATE_PRODUCT:    { url: '/api/products/{productId}', method: 'PUT' },
  DELETE_PRODUCT:    { url: '/api/products/{productId}', method: 'DELETE' }
} as const;

 // ApiConstants.ts (Add this block)
 export const DesignationEndpoints = {
  GET_ALL_DESIGNATIONS:  { url: '/api/sales-designations', method: 'GET' },
  GET_DESIGNATION_BY_ID: { url: '/api/sales-designations/{designationId}', method: 'GET' },
  CREATE_DESIGNATION:    { url: '/api/sales-designations', method: 'POST' },
  UPDATE_DESIGNATION:    { url: '/api/sales-designations/{designationId}', method: 'PUT' },
  DELETE_DESIGNATION:    { url: '/api/sales-designations/{designationId}', method: 'DELETE' }
} as const;