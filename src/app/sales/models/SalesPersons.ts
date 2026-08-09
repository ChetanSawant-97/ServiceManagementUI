export interface SalesPerson {
    userId: number;
    username: string;
    role: string;
    dealerId: number;
    dealerName: string;
    salesPersonId: number;
    designationId: number;
    designationName: string;
    reportingDesignationId: number;
    mobileNumber: string;
    aadharId: string;
    pancard: string;
    photoId: number;
    photoPath: string;
    photoBase64: string;
    isActive: boolean;
    isDeleted: boolean;
  }
  
  export interface SalesPersonPayload {
    username: string;
    password?: string;
    dealerId: number;
    designationId: number;
    mobileNumber: string;
    aadharId: string;
    pancard: string;
    photoBase64: string;
  }