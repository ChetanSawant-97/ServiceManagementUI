// designation.model.ts
export interface DesignationDetails {
    designationId: number;
    designationName: string;
    reportingDesignationId: number;
    reportingDesignationName: string;
    isDeleted: boolean;
  }
  
  export interface DesignationPayload {
    designationName: string;
    reportingDesignationId: number;
  }
  
 