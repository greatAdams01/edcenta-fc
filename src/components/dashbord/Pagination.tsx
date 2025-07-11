import { ArrowLongLeftIcon, ArrowLongRightIcon } from '@heroicons/react/20/solid'

export default function Pagination({ page, count, handlePageChange }: { page: number; count: number, handlePageChange: (pageNum: number) => void }) {
  const pages = Array.from({length: count}, (_, i) => i + 1);
  const handlePreviousPage = () => {};
  const handleNextPage = () => {};
  return (
    <nav className="flex items-center justify-between border-t border-gray-200 px-4 sm:px-0 mt-20">
      <div className="-mt-px flex w-0 flex-1">
        <a
          href="#"
          className={`inline-flex items-center border-t-2 border-transparent pr-1 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700 ${page === 1 && 'cursor-not-allowed opacity-50'}`}
          onClick={(e) => {
            e.preventDefault();
            if (page > 1) {
              // handlePreviousPage function should be implemented to handle page change
              const value = page - 1
              handlePageChange(value);
            }
          }}
        >
          <ArrowLongLeftIcon className="mr-3 h-5 w-5 text-gray-400" aria-hidden="true" />
          Previous
        </a>
      </div>
      <div className="hidden md:-mt-px md:flex">
        {pages.map((pageNumber) => (
          <a
            key={pageNumber}
            href="#"
            className={`inline-flex items-center border-t-2 px-4 pt-4 text-sm font-medium ${pageNumber === page ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            aria-current={pageNumber === page ? 'page' : undefined}
            onClick={(e) => {
              e.preventDefault();
              // handlePageChange function should be implemented to handle page change
              handlePageChange(pageNumber);
            }}
          >
            {pageNumber}
          </a>
        ))}
      </div>
      <div className="-mt-px flex w-0 flex-1 justify-end">
        <a
          href="#"
          className={`inline-flex items-center border-t-2 border-transparent pl-1 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700 ${page === count && 'cursor-not-allowed opacity-50'}`}
          onClick={(e) => {
            e.preventDefault();
            if (page < count) {
              // handleNextPage function should be implemented to handle page change
              const value = page + 1
              handlePageChange(value);
            }
          }}
        >
          Next
          <ArrowLongRightIcon className="ml-3 h-5 w-5 text-gray-400" aria-hidden="true" />
        </a>
      </div>
    </nav>
  )
}