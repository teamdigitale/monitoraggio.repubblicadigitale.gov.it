export interface Page<T> {
    number: number;
    size: number;
    numberOfElements: number;
    totalElements: number;
    totalPages: number;
    content: T[];
  }
  