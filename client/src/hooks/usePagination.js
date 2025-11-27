import { useState } from "react";

export default function usePagination(initialPage = 1, pageSize = 10) {
  const [page, setPage] = useState(initialPage);
  const [limit] = useState(pageSize);

  return { page, limit, setPage };
}
