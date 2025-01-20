"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CourseSchema } from "@/schemas";
import { useRouter } from "next/navigation";
import { useAddCourseMutation } from "@/slice/courseSlice"; // Assumed mutation to add a course
import { useMessages } from "@/context/useMessage";
import { z } from "zod";

// Type inference from the schema
type CourseType = z.infer<typeof CourseSchema>;

export default function CourseForm() {
  const router = useRouter();
  const { setMessage } = useMessages();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CourseType>({
    resolver: zodResolver(CourseSchema),
    defaultValues: {
      name: "",
      date: "",
      subject: "",
      location: "",
      participants: 0,
      notes: "",
      price: 0,
      trainerPrice: 0,
    },
  });

  // Using the mutation to add a course
  const [addCourse, { isLoading, isSuccess }] = useAddCourseMutation();

  const onSubmit = async (data: CourseType) => {
    try {
      await addCourse(data).unwrap(); // Send request to the backend
      setMessage("Course added successfully", "success");
      router.push("/courses"); // Redirect after course addition
} catch (err: unknown) {
    let errorMessage = "Une erreur est survenue.";

    if (
      typeof err === "object" &&
      err !== null &&
      "data" in err &&
      typeof err.data === "object" &&
      err.data !== null &&
      "message" in err.data
    ) {
      errorMessage = String(
        (err as { data: { message: string } }).data.message
      );
    }

    setMessage(errorMessage, "error");
  }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Add a Course</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Course Name Field */}
        <div>
          <label className="block text-gray-700 font-medium">Course Name</label>
          <input
            {...register("name")}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Advanced React.js"
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}
        </div>

        {/* Date Field */}
        <div>
          <label className="block text-gray-700 font-medium">Course Date</label>
          <input
            {...register("date")}
            type="date"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.date && (
            <p className="text-red-500 text-sm">{errors.date.message}</p>
          )}
        </div>

        {/* Subject Field */}
        <div>
          <label className="block text-gray-700 font-medium">Subject</label>
          <input
            {...register("subject")}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="React.js"
          />
          {errors.subject && (
            <p className="text-red-500 text-sm">{errors.subject.message}</p>
          )}
        </div>

        {/* Location Field */}
        <div>
          <label className="block text-gray-700 font-medium">Location</label>
          <input
            {...register("location")}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Stuttgart"
          />
          {errors.location && (
            <p className="text-red-500 text-sm">{errors.location.message}</p>
          )}
        </div>

        {/* Participants Field */}
        <div>
          <label className="block text-gray-700 font-medium">
            Number of Participants
          </label>
          <input
            {...register("participants", { valueAsNumber: true })}
            type="number"
            min="1"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="20"
          />
          {errors.participants && (
            <p className="text-red-500 text-sm">{errors.participants.message}</p>
          )}
        </div>

        {/* Price Field */}
        <div>
          <label className="block text-gray-700 font-medium">Price</label>
          <input
            {...register("price", { valueAsNumber: true })}
            type="number"
            min="0"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="2000"
          />
          {errors.price && (
            <p className="text-red-500 text-sm">{errors.price.message}</p>
          )}
        </div>

        {/* Trainer Price Field */}
        <div>
          <label className="block text-gray-700 font-medium">Trainer Price</label>
          <input
            {...register("trainerPrice", { valueAsNumber: true })}
            type="number"
            min="0"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="500"
          />
          {errors.trainerPrice && (
            <p className="text-red-500 text-sm">{errors.trainerPrice.message}</p>
          )}
        </div>

        {/* Notes Field */}
        <div>
          <label className="block text-gray-700 font-medium">Notes</label>
          <textarea
            {...register("notes")}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Focus on hooks and context API"
          />
          {errors.notes && (
            <p className="text-red-500 text-sm">{errors.notes.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-green-500 text-white p-2 rounded-md hover:bg-green-600"
          disabled={isLoading}
        >
          {isLoading ? "Submitting..." : "Submit"}
        </button>
      </form>

      {isSuccess && (
        <p className="text-green-500 mt-4">Course added successfully!</p>
      )}
    </div>
  );
}