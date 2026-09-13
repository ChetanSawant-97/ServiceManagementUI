export interface TripReportRequest {
    salesPersonId: number;
    fromDate: string; // Format: YYYY-MM-DD
    toDate: string;   // Format: YYYY-MM-DD
  }
  
  export interface TripReportResponse {
    salesPersonName: string;
    travelDate: string;
    actualDistance: number;
    estimatedDistance: number;
    transportBy: string;
    ratePerKm: number;
    totalTravelAmount: number;
  }