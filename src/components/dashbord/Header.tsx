

export default function DashHeader() {
  return (
    <div className="border-b border-gray-200 pb-5">
      <div className="sm:flex sm:items-baseline sm:justify-between">
        <div className="sm:w-0 sm:flex-1">
          <h1 id="message-heading" className="text-base font-semibold leading-6 text-gray-900">
            Full-Stack Developer
          </h1>
          <p className="mt-1 truncate text-sm text-gray-500">Checkout and Payments Team</p>
        </div>

        <div className="mt-4 flex items-center justify-between sm:ml-6 sm:mt-0 sm:flex-shrink-0 sm:justify-start">
          <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
            Open
          </span>
        </div>
      </div>
    </div>
  )
}
