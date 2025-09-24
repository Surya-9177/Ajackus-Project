export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  website: string;
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: {
      lat: string;
      lng: string;
    };
  };
  company: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
}

export interface UserFormData {
  name: string;
  username: string;
  email: string;
  phone: string;
  website: string;
  company: string;
}

export interface UserFilters {
  name?: string;
  username?: string;
  email?: string;
  company?: string;
}

export interface PaginationOptions {
  page: number;
  limit: number;
  total: number;
}

export type SortField = 'name' | 'username' | 'email' | 'company';
export type SortOrder = 'asc' | 'desc';