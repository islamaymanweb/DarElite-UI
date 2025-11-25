/* export class ProductParams {
  CategoryId?: number;
  Sort?: string = '';
  Search: string = ' '; // قيمة افتراضية مسافة بدلاً من فارغ
  PageNumber: number = 1;
  pageSize: number = 12;
  TotatlCount?: number;
} */
/* export class ProductParams {
  CategoryId?: number;
  Sort?: string = '';
  Search: string = 'products'; // قيمة افتراضية 'all' بدلاً من مسافة
  PageNumber: number = 1;
  pageSize: number = 12;
  totalCount?: number;
} */
// في ProductParams
// shared/Models/ProductParams.ts
// shared/Models/ProductParams.ts
export class ProductParams {
  PageNumber: number = 1;
  pageSize: number = 6;
  CategoryId?: number;
  Sort: string = 'Name';
  Search: string = 'a'; // استخدام 'a' كقيمة افتراضية مؤكدة
  TotatlCount?: number;
}