export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
export interface EndpointConfig {
  url: string;
  method: HttpMethod;
}

export const ApiEndpoints: Record<string, EndpointConfig> = {
  AUTH_LOGIN: { url: 'api/auth/login', method: 'POST' },
  
  // Dealers
  GET_DEALER_BY_ID: { url: 'api/dealers/{dealerId}', method: 'GET' },
  UPDATE_DEALER:    { url: 'api/dealers/{dealerId}', method: 'PUT' },
  DELETE_DEALER:    { url: 'api/dealers/{dealerId}', method: 'DELETE' }
};