export interface OrderMaster {
    orderId: number;
    customerName: string;
    customerNumber: string;
    productName: string;
    productSerialNumber: string;
    billDate: string; // or Date
    dealerId: number;
    dealerName: string;
    photoId: number;
    photoPath: string;
  }

  export interface OrderPayload {
    customerName: string;
    customerNumber: string;
    productName: string;
    productSerialNumber: string;
    billDate: string;
    dealerId: number;
    photoBase64 : string;
  }