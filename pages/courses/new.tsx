import CourseForm from "@/components/CourseForm";
import Header from "@/components/Header";
import React from "react";

function New() {
  
  return (
    <div className="container mx-auto p-6">
      <Header />
      <div className="container mx-auto p-6">
        <h1 className="text-4xl font-bold mb-8 text-white">New Course</h1>

        <CourseForm />
      </div>
    </div>
  );
}

export default New;
