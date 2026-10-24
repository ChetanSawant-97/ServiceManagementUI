export interface CreateBranchManagerPayload {
    username: string;
    password: string;
  }
  
  export interface BranchManagerData {
    userId: number;
    username: string;
    role: string;
  }
  
  export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
  }