import { useGetCoursesQuery } from "@/slice/courseSlice";
import Header from "../components/Header";
import LoaderTable from "../components/LoaderTable";
import Link from "next/link";
import { format } from "date-fns";
export default function Courses() {
  const { data: courses, error, isLoading } = useGetCoursesQuery();
  if (error) {
    let errorMessage = "An unknown error occurred";

    if ("status" in error) {
      errorMessage = `Error ${error.status}: ${JSON.stringify(error.data)}`;
    } else if ("message" in error) {
      errorMessage = error.message || "An unknown error occurred";
    }

    return <div>Error: {errorMessage}</div>;
  }
  return (
    <div>
      <Header />
      <main className="container mx-auto p-6">
        <h1 className="text-4xl font-bold mb-8">Courses</h1>*
        <Link
          href="/courses/new"
          className="bg-green-500 text-white px-4 py-2 rounded mb-4"
        >
          Create Course
        </Link>
        {isLoading ? (
          <LoaderTable />
        ) : (
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="py-3 px-4 border-b">Course Name</th>
                <th className="py-3 px-4 border-b">Date</th>
                <th className="py-3 px-4 border-b">Subject</th>
                <th className="py-3 px-4 border-b">Location</th>
                <th className="py-3 px-4 border-b">Trainer</th>
                <th className="py-3 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses?.map((course, index) => (
                <tr key={index}>
                  <td className="py-3 px-4 border-b">{course.name}</td>
                  <td className="py-3 px-4 border-b">
                    {format(new Date(course.date), "yyyy-MM-dd")}
                  </td>
                  <td className="py-3 px-4 border-b">{course.subject}</td>
                  <td className="py-3 px-4 border-b">{course.location}</td>
                  <td className="py-3 px-4 border-b">
                    {course.trainer ? (
                      <div>
                        <strong>{course.trainer.name}</strong>
                      </div>
                    ) : (
                      <span>No trainer assigned</span>
                    )}
                  </td>
                  <td className="py-3 px-4 border-b flex space-x-2">
                    <Link href={`/courses/edit/${course.id}`}>
                      <button className="bg-yellow-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-yellow-600">
                        Edit
                      </button>
                    </Link>
                    <button className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-600">
                      Delete
                    </button>

                    <Link href={`/courses/assign/${course.id}`}>
                      <button className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-600">
                        Assign Trainer
                      </button>
                    </Link>
                    {/* {course.trainer ? (
                      <button className="bg-gray-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-gray-600">
                        Remove Trainer
                      </button>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <select className="border border-gray-300 px-4 py-2 rounded-lg shadow-md">
                          <option value="">Select Trainer</option>
                          {sampleTrainers.map((trainer) => (
                            <option key={trainer.id} value={trainer.id}>
                              {trainer.name}
                            </option>
                          ))}
                        </select>
                        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600">
                          Assign Trainer
                        </button>
                      </div>
                    )} */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>
    </div>
  );
}
