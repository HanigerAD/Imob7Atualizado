import { useEffect, useMemo } from "react";

export const Pagination = ({
  itemsPerPage,
  totalItems,
  currentPage,
  paginate,
  nextPage,
  prevPage,
}: {
  itemsPerPage: number;
  totalItems: number;
  currentPage: number;
  paginate(pageNum: number): void;
  nextPage(): void;
  prevPage(): void;
}) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  const indexOfLastItem = useMemo(
    () => Math.ceil(currentPage * itemsPerPage),
    [currentPage, itemsPerPage]
  );

  const indexOfFirstItem = useMemo(
    () => Math.ceil(indexOfLastItem - itemsPerPage),
    [indexOfLastItem, itemsPerPage]
  );

  const lastPage = useMemo(() => {
    return Math.ceil(totalItems / itemsPerPage);
  }, [totalItems, itemsPerPage]);

  return totalItems > 0 ? (
    <div className="d-flex justify-content-end align-items-center">
      <div style={{ marginRight: "10px" }}>
        {indexOfFirstItem + 1} -{" "}
        {indexOfLastItem + 1 > totalItems ? totalItems : indexOfLastItem} de{" "}
        {totalItems}
      </div>

      <nav className="text-right">
        <ul className="pagination mb-0">
          <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
            <button
              className="page-link btn-sm"
              type="button"
              disabled={currentPage === 1}
              onClick={() => paginate(1)}
            >
              <i className="fas fa-solid fa-angles-left"></i>
            </button>
          </li>

          <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
            <button
              className="page-link btn-sm"
              type="button"
              disabled={currentPage === 1}
              onClick={() => prevPage()}
            >
              <i className="fas fa-solid fa-angle-left"></i>
            </button>
          </li>

          <li className={`page-item ${currentPage + 1 > lastPage ? "disabled" : ""}`}>
            <button
              className="page-link btn-sm"
              type="button"
              disabled={currentPage + 1 > lastPage}
              onClick={() => nextPage()}
            >
              <i className="fas fa-angle-right"></i>
            </button>
          </li>

          <li
            className={`page-item ${currentPage >= lastPage ? "disabled" : ""}`}>
            <button
              className="page-link btn-sm"
              type="button"
              disabled={currentPage >= lastPage}
              onClick={() => paginate(lastPage)}
            >
              <i className="fas fa-solid fa-angles-right"></i>
            </button>
          </li>
        </ul>
      </nav>
    </div>
  ) : null;
};
