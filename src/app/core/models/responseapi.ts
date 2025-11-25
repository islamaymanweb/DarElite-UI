/* // src/app/models/pagination.model.ts
export interface Pagination<T> {
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  data: T[];
}

// src/app/models/product-params.model.ts
export interface ProductParams {
  sort?: string;
  categoryId?: number;
  search?: string;
  pageSize?: number;
  pageNumber?: number;
}

// src/app/models/response.model.ts
export interface ResponseAPI {
  statusCode: number;
  message?: string;
} */