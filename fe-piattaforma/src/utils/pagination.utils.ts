export interface PaginationBounds {
    displayItem: string;
  }
  
  export function calculatePaginationBounds(
    pageNumber?: number,
    pageSize?: number,
    totalCounter?: number
  ): PaginationBounds {
    let displayItem = '';
  
    if (pageNumber && pageSize && totalCounter) {
      const startElement = (pageNumber - 1) * pageSize;
      const endElement = Math.min(startElement + pageSize, totalCounter);
      displayItem = `${endElement} di ${totalCounter}`;
    }
  
    return { displayItem };
  }