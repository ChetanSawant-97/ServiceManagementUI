export interface OrderMaster {
  orderId: number;
  customerName: string;
  customerNumber: string;
  productId: number;
  productCode: string;
  productName: string;
  productSerialNumber: string;
  billDate: string;
  dealerId: number;
  dealerName: string;
  billPhotoId: number;
  billPhotoPath: string;
  billPhotoBase64: string;
}

export interface OrderPayload {
  customerName: string;
  customerNumber: string;
  productId: number;
  productSerialNumber: string;
  billDate: string;
  dealerId: number;
  billPhotoBase64: string;
}