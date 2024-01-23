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
      const startElement = pageNumber * pageSize;
      const endElement = Math.min(startElement, totalCounter);
      displayItem = `${endElement} di ${totalCounter}`;
    }
  
    return { displayItem };
  }
  