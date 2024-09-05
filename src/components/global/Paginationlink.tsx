/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";

interface PaginationProps {
  data: number;
}

export const Paginationlink = (props: PaginationProps) => {
  const { data } = props;
  const [items, setItems] = useState(data);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  const [maxPageNumberLimit, setMaxPageNumberLimit] = useState(
    Math.ceil(1000 / itemsPerPage)
  );

  const PageArray = [];

  for (let i = 1; i < maxPageNumberLimit + 1; i++) {
    PageArray.push(i);
  }

  const handleMouseClick = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    const target = e.target as HTMLButtonElement;
    const id = target.id;
    setCurrentPage(Number(id));
  };

  const handlePaginationChange = (value: string) => {
    setCurrentPage(Number(value));
  };

  return (
    <div>
      {items > itemsPerPage ? (
        <div className="flex items-center justify-between rounded-md border-gray-200 bg-white">
          <div className="sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <nav
                className="inline-flex -space-x-px rounded-md shadow-sm"
                aria-label="Pagination"
              >
                {currentPage !== 1 && (
                  <a
                    href="#"
                    className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                    onClick={() =>
                      handlePaginationChange(
                        String(currentPage !== 1 ? currentPage - 1 : 1)
                      )
                    }
                  >
                    <span className="sr-only">Start</span>
                    <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                  </a>
                )}
                {currentPage > 4 && (
                  <>
                    <a
                      href="#"
                      aria-current="page"
                      id={"1"}
                      onClick={() => handlePaginationChange(String(1))}
                      className={
                        currentPage === 1
                          ? "relative z-10 inline-flex items-center bg-indigo-600 px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                          : "relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                      }
                    >
                      {1}
                    </a>
                    <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 focus:outline-offset-0">
                      ...
                    </span>
                  </>
                )}

                {PageArray.map((number) =>
                  (currentPage < 5 && number <= 5) ||
                  (currentPage > maxPageNumberLimit - 4 &&
                    number > maxPageNumberLimit - 5) ? (
                    <a
                      key={number}
                      id={String(number)}
                      href="#"
                      aria-current="page"
                      onClick={handleMouseClick}
                      className={
                        currentPage === number
                          ? "relative z-10 inline-flex items-center bg-indigo-600 px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                          : "relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                      }
                    >
                      {number}
                    </a>
                  ) : number === currentPage + 1 ||
                    number === currentPage - 1 ||
                    number === currentPage ? (
                    <a
                      key={number}
                      id={String(number)}
                      href="#"
                      aria-current="page"
                      onClick={handleMouseClick}
                      className={
                        currentPage === number
                          ? "relative z-10 inline-flex items-center bg-indigo-600 px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                          : "relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                      }
                    >
                      {number}
                    </a>
                  ) : null
                )}

                {currentPage < maxPageNumberLimit - 3 && (
                  <>
                    <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 focus:outline-offset-0">
                      ...
                    </span>
                    <a
                      href="#"
                      aria-current="page"
                      onClick={() =>
                        handlePaginationChange(String(maxPageNumberLimit))
                      }
                      className={
                        currentPage === maxPageNumberLimit
                          ? "relative z-10 inline-flex items-center bg-indigo-600 px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                          : "relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                      }
                    >
                      {maxPageNumberLimit}
                    </a>
                  </>
                )}
                {currentPage != maxPageNumberLimit && (
                  <a
                    href="#"
                    className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                    onClick={() =>
                      handlePaginationChange(
                        String(
                          currentPage !== maxPageNumberLimit
                            ? currentPage + 1
                            : maxPageNumberLimit
                        )
                      )
                    }
                  >
                    <span className="sr-only">Next</span>
                    <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                  </a>
                )}
              </nav>
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};
