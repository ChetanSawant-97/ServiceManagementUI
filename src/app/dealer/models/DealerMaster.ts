export interface DealerMaster {
  dealerId: number;
  dealerName: string;
  branchCode: string;
  mobileNo: string;
  emailId: string;
  adharCard: string;
  panCard: string;
  gst: string;
  addressId: number;
  addressLine1: string;
  addressLine2: string;
  landmark: string;
  area: string;
  city: string;
  state: string;
  pinCode: string;
  country: string;
  isActive?: boolean;
  isDeleted?: boolean;
  username?: string;
}

export interface DealerUpdatePayload {
  dealerName: string;
  mobileNo: string;
  emailId: string;
  adharCard: string;
  panCard: string;
  gst: string;
  addressLine1: string;
  addressLine2: string;
  landmark: string;
  area: string;
  city: string;
  state: string;
  pinCode: string;
  country: string;
}

// Extends the update payload to include auth fields required only during creation
export interface DealerCreatePayload extends DealerUpdatePayload {
  username?: string;
  password?: string;
}