export interface SearchPaginationResponse {
  data: any;
  totalCount: number;
}

export interface CreateUserResponse {
  id: string;
}

export interface RoleResponse {
  id: number;
  name: string;
  access: string;
}
