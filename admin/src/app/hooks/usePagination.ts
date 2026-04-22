import { useMemo, useState } from "react";

type UsePaginationParams = {
  currentPage: number;
  itemsPerPage: number;
};

export function usePagination(props: UsePaginationParams) {
  const [currentPage, setCurrentPage] = useState(props.currentPage);
  const [itemsPerPage, setItemsPerPage] = useState(props.itemsPerPage);

  const paginate = (pageNum: number) => setCurrentPage(pageNum);

  const goToPage = (page: number) => setCurrentPage(page);

  const nextPage = () => setCurrentPage(currentPage + 1);

  const prevPage = () => setCurrentPage(currentPage - 1);

  const indexOfLastItem = useMemo(
    () => Math.ceil(currentPage * itemsPerPage),
    [currentPage, itemsPerPage]
  );

  const indexOfFirstItem = useMemo(
    () => Math.ceil(indexOfLastItem - itemsPerPage),
    [indexOfLastItem, itemsPerPage]
  );

  return {
    currentPage,
    itemsPerPage,
    paginate,
    goToPage,
    nextPage,
    prevPage,
    indexOfLastItem,
    indexOfFirstItem,
  };
}
