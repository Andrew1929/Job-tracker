/**
 * Every paginated endpoint returns the same `meta` block. The response DTOs stay
 * per-module because their `@Expose()` shapes belong to their own contracts, but
 * the arithmetic lives here so page-boundary rules cannot drift between them.
 */

export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

export function buildPaginationMeta(pagination: {
  page: number;
  limit: number;
  total: number;
}): PaginationMeta {
  const { page, limit, total } = pagination;
  const totalPages = limit > 0 ? Math.ceil(total / limit) : 0;

  return {
    page,
    limit,
    total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  };
}
