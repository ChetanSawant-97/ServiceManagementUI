export interface ProductDetails {
    productId: number;
    productName: string;
    productCode: string;
    isDeleted: boolean;
}

export interface ProductPayload {
    productName: string;
    productCode: string;
}