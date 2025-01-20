"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CourseSchema } from "@/schemas";
import { useMessages } from "@/context/useMessage";
import { z } from "zod";

// Type inference from the schema
type CourseType = z.infer<typeof CourseSchema>;

type CourseFormProps = {
  onSubmit: (data: CourseType) => Promise<void>;
  mode: "add" | "edit";
  defaultValues?: Partial<CourseType>; // To pre-fill fields in edit mode
};

export default function CourseForm({
  onSubmit,
  mode,
  defaultValues = {},
}: CourseFormProps) {
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
      price: 0,
      trainer_price: 0,
      notes: "",
      ...defaultValues, // Merge with provided defaults
    },
  });

  const handleFormSubmit = async (data: CourseType) => {
    try {
      await onSubmit(data); // Call parent handler
      const successMessage =
        mode === "add" ? "Course added successfully" : "Course updated successfully";
      setMessage(successMessage, "success");
    } catch (err: unknown) {
      let errorMessage = "An error occurred.";

      if (
        typeof err === "object" &&
        err !== null &&
        "data" in err &&
        typeof err.data === "object" &&
        err.data !== null &&
        "message" in err.data
      ) {
        errorMessage = String((err as { data: { message: string } }).data.message);
      }

      setMessage(errorMessage, "error");
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        {mode === "add" ? "Add a Course" : "Edit Course"}
      </h2>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        {/* Input fields */}
        <div>
          <label className="block text-gray-700 font-medium">Course Name</label>
          <input
            {...register("name")}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}
        </div>
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
        {/* Add more fields as needed */}
        <button
          type="submit"
          className="w-full bg-green-500 text-white p-2 rounded-md hover:bg-green-600"
        >
          {mode === "add" ? "Add Course" : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
