import { SortOrder } from "./metaQueryDto.dto";

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginatedMeta;
}

export interface PaginatedMeta {
  total: number;
  page: number;
  size: number;
  sort: SortOrder;
}
