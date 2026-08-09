export interface TransportDetails {
    transportId: number;
    transportBy: string;
    ratePerKm: number;
    isDeleted: boolean;
  }
  
  export interface TransportPayload {
    transportBy: string;
    ratePerKm: number;
  }