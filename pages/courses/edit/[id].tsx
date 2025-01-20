import React from "react";
import { useRouter } from "next/router";
import { useGetCourseByIdQuery } from "@/slice/courseSlice";
import Header from "@/components/Header";
import CourseForm from "@/components/CourseForm";
function EditTrainerPage() {
  const router = useRouter();
  const { id } = router.query;
  const {
    data: course,
    isLoading,
    error,
  } = useGetCourseByIdQuery(id as string, { skip: !id });

  return (
    <div>
      <Header />
      <main className="container mx-auto p-6">
        <CourseForm />
      </main>
    </div>
  );
}

export default EditTrainerPage;
