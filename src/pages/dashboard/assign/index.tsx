import AppLayout from '../../../layout/AppLayout';

const classes = [
  { stage: '1', 
    year: '3', 
    age: '13-16', 
    subject:[
      { subject1: 'English', subject2: 'Mathematics' }
    ] 
  },
  // More people...
];

export default function Assign() {
  return (
      <AppLayout>
        <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-base font-semibold leading-6 text-gray-900">Assigned Classes</h1>
            <p className="mt-2 text-sm text-gray-700">
              A list of all assigned classes and students.
            </p>
          </div>
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            <button
              type="button"
              className="block rounded-md bg-purple-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Add Class
            </button>
          </div>
        </div>
        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className='bg-purple-500 bg-opacity-50 ml-4'>
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-4">
                      Key Stage
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Year
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Age
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Subject
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {classes.map((Class, index) => (
                    <tr key={index}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-4">
                        {Class.stage}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{Class.year}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{Class.age}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {Class.subject.map((subject, index) => (
                          <span key={index}>{subject.subject1},<br /> {subject.subject2} ...</span>
                        ))}
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                        <a href="#" className="text-indigo-600 hover:text-indigo-900">
                          Edit<span className="sr-only">, {Class.stage}</span>
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      </AppLayout>
  );
}
