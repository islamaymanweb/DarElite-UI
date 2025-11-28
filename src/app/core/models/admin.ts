export interface AddAdminDTO {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}

export interface AdminInfoDTO {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
}

export interface RemoveAdminDTO {
  email: string;
}

export interface AdminResponse {
  statusCode?: number;
  message?: string;
  data?: AdminInfoDTO[];
  isAdmin?: boolean;
}

export interface AdminListResponse {
  statusCode: number;
  message: string;
  data: AdminInfoDTO[];
}

export interface AdminCheckResponse {
  statusCode: number;
  message: string;
  isAdmin: boolean;
}

