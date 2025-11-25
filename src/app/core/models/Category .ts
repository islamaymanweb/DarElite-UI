export class ICateogry{
    id!:number
    name!:string
      description!: string;
}


export interface CategoryDTO {
  name: string;
  description: string;
}

export interface UpdateCategoryDTO {
  id: number;
  name: string;
  description: string;
}