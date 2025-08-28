import { ChevronLeft, ChevronRight } from "lucide-react";
function Pagination({
  totalPages,
  searchParams,
  setSearchParams,
  pagesCount,
  shift,
  handlePage,
  currentPage,
}) {
  let startPage = 0;
  const page = currentPage
    ? currentPage
    : Number(searchParams?.get("page")) || 0;
  const toRender = pagesCount <= totalPages ? pagesCount : totalPages;
  if (page > shift) {
    startPage =
      totalPages - page < toRender ? totalPages - toRender : page - shift;
  }

  return (
    <div className="flex justify-center items-center gap-2 backdrop-blur-sm bg-amber-50/10 mt-4 p-1 rounded-2xl">
      {startPage > 0 && (
        <div>
          <button
            type="button"
            onClick={
              handlePage
                ? () => handlePage(0, false, false)
                : () => {
                    searchParams?.set("page", 0);
                    setSearchParams(searchParams);
                  }
            }
          >
            1
          </button>
          ...
        </div>
      )}
      {startPage > 0 && (
        <button
          type="button"
          onClick={
            handlePage
              ? () => handlePage(false, true, false)
              : () => {
                  searchParams?.set("page", page - 1);
                  setSearchParams(searchParams);
                }
          }
        >
          <ChevronLeft />
        </button>
      )}
      {Array(toRender)
        .fill()
        .map((_, i) => {
          const currentPage = i + startPage;
          return (
            <button
              key={i}
              onClick={
                handlePage
                  ? () => handlePage(currentPage, false, false)
                  : () => {
                      searchParams?.set("page", currentPage);
                      setSearchParams(searchParams);
                    }
              }
              className={`px-2 p-1 rounded-md border border-gray-500 min-w-12 ${
                currentPage === page && "bg-secondary"
              }`}
            >
              {currentPage + 1}
            </button>
          );
        })}
      {totalPages - startPage > pagesCount && (
        <button
          type="button"
          onClick={
            handlePage
              ? () => handlePage(false, false, true)
              : () => {
                  searchParams?.set("page", page + 1);
                  setSearchParams(searchParams);
                }
          }
        >
          <ChevronRight />
        </button>
      )}
      {totalPages - startPage > pagesCount && (
        <div>
          ...
          <button
            type="button"
            onClick={
              handlePage
                ? () => handlePage(totalPages - 1, false, false)
                : () => {
                    searchParams?.set("page", totalPages - 1);
                    setSearchParams(searchParams);
                  }
            }
          >
            {totalPages}
          </button>
        </div>
      )}
    </div>
  );
}

export default Pagination;
