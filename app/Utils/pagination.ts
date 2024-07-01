export async function buildPagination(meta: PaginationMeta) {
  return {
    first: meta.first_page,
    last: meta.last_page,
    previous: meta.current_page - 1,
    current: meta.current_page,
    next: meta.current_page + 1,
    pages: Array.from({ length: meta.last_page }, (_, i) => {
      return {
        page: i + 1,
        url: `?page=${i + 1}`,
        active: i + 1 === meta.current_page,
      };
    }),
  };
}

interface PaginationMeta {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
  first_page: number;
  first_page_url: string;
  last_page_url: string;
  next_page_url: string;
  previous_page_url: string;
}
