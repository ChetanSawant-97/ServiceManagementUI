export interface Lead {
    leadId: number;
    name: string;
    mobileNumber: string;
    location: string;
    photoId: number;
    photoPath: string;
    photoBase64: string;
    isDeleted: boolean;
    salesId: number;
    salesPersonName: string;
  }