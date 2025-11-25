export interface LoginDTO {
  email: string;
  password: string;
}

export interface RegisterDTO extends LoginDTO {
  userName: string;
  displayName: string;
}

export interface ResetPasswordDTO extends LoginDTO {
  token: string;
}

export interface ActiveAccountDTO {
  email: string;
  token: string;
}

export interface Address {
  id?: number;
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  appUserId?: string;
}

export interface ShipAddressDTO {
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface ResponseAPI {
  statusCode: number;
  message: string;
}

export interface ApiResponse<T> {
  data?: T;
  success: boolean;
  message?: string;
}