import { buildPaginationMeta } from './pagination.util';

describe('pagination.util', () => {
  it('reports page boundaries for a middle page', () => {
    expect(buildPaginationMeta({ page: 2, limit: 20, total: 45 })).toEqual({
      page: 2,
      limit: 20,
      total: 45,
      totalPages: 3,
      hasNextPage: true,
      hasPreviousPage: true,
    });
  });

  it('closes both boundaries when a single page holds every row', () => {
    const meta = buildPaginationMeta({ page: 1, limit: 20, total: 5 });

    expect(meta.totalPages).toBe(1);
    expect(meta.hasNextPage).toBe(false);
    expect(meta.hasPreviousPage).toBe(false);
  });

  it('treats an empty result as zero pages with no next page', () => {
    const meta = buildPaginationMeta({ page: 1, limit: 20, total: 0 });

    expect(meta.totalPages).toBe(0);
    expect(meta.hasNextPage).toBe(false);
  });

  it('avoids dividing by zero when the limit is zero', () => {
    expect(
      buildPaginationMeta({ page: 1, limit: 0, total: 10 }).totalPages,
    ).toBe(0);
  });
});
