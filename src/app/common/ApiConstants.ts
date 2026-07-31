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
  AUTH_LOGIN: { url: 'api/auth/login', method: 'POST' },
  
  // Dealers
  GET_DEALER_BY_ID: { url: 'api/dealers/{dealerId}', method: 'GET' },
  UPDATE_DEALER:    { url: 'api/dealers/{dealerId}', method: 'PUT' },
  DELETE_DEALER:    { url: 'api/dealers/{dealerId}', method: 'DELETE' }
} as const;


export const OrderEndpoints = {
  // Orders
  GET_ALL_ORDERS:   { url: 'api/orders', method: 'GET' },
  GET_ORDER_BY_ID:  { url: 'api/orders/{orderId}', method: 'GET' },
  CREATE_ORDER:     { url: 'api/orders', method: 'POST' },
  UPDATE_ORDER:     { url: 'api/orders/{orderId}', method: 'PUT' },
  DELETE_ORDER:     { url: 'api/orders/{orderId}', method: 'DELETE' },
  UPLOAD_ORDER_BILL:{ url: 'api/orders/{orderId}/bill-image', method: 'POST' }
} as const;

export const DealerEndPoints = {
  GET_ALL_DEALERS:   { url: 'api/dealers', method: 'GET' },
  GET_DEALER_BY_ID:  { url: 'api/dealers/{dealerId}', method: 'GET' },
  CREATE_DEALER:     { url: 'api/dealers', method: 'POST' },
  UPDATE_DEALER:     { url: 'api/dealers/{dealerId}', method: 'PUT' },
  DELETE_DEALER:     { url: 'api/dealers/{dealerId}', method: 'DELETE' },
  
  UPLOAD_ORDER_BILL: { url: 'api/orders/{orderId}/bill-image', method: 'POST' }
} as const;