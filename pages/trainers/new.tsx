import Header from "@/components/Header";
import TrainerForm from "@/components/TrainerForm";
import React from "react";

function New() {
  
  return (
    <div className="container mx-auto p-6">
      <Header />
      <div className="container mx-auto p-6">
        <h1 className="text-4xl font-bold mb-8 text-white">New Trainer</h1>

        <TrainerForm />
      </div>
    </div>
  );
}

export default New;
