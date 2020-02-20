export interface Paginated<T> {
  totalCount: number;
  edges: EdgeNode<T>[];
  pageInfo: PageInfo;
}

export interface EdgeNode<T> {
  node: T;
  cursor: string;
}

export interface PageInfo {
  hasNextPage: boolean;
  hasPrevPage: boolean;
  startCursor: string;
  endCursor: string;
  pages: number;
}
