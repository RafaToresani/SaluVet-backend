import { PaginatedMeta, PaginatedResponse } from "./paginated.response";

export function buildPaginatedResponse<T>(
  data: T[], meta: PaginatedMeta
): PaginatedResponse<T> {
  return {
    data,
    meta: {
      page: meta.page,
      size: meta.size,
      total: meta.total,
      sort: meta.sort,
    },
  };
}