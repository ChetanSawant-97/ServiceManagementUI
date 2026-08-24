export interface SalesPerson {
  userId: number;
  username: string;
  role: string;
  salesPersonId: number;
  designationId: number;
  designationName: string;
  reportingDesignationId: number;
  fullName: string;
  mobileNumber: string;
  aadharId: string;
  pancard: string;
  addressLine1: string;
  addressLine2: string;
  landmark: string;
  area: string;
  city: string;
  state: string;
  pinCode: string;
  country: string;
  photoId: number;
  photoPath: string;
  photoBase64: string;
  isActive: boolean;
  isDeleted: boolean;
}

export interface SalesPersonPayload {
  username: string;
  password?: string;
  designationId: number;
  fullName: string;
  mobileNumber: string;
  aadharId: string;
  pancard: string;
  addressLine1: string;
  addressLine2: string;
  landmark: string;
  area: string;
  city: string;
  state: string;
  pinCode: string;
  country: string;
  photoBase64: string;
}