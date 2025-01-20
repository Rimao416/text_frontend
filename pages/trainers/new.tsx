import Header from "@/components/Header";
import TrainerForm from "@/components/TrainerForm";
import React from "react";
import { useAddTrainerMutation } from "@/slice/trainerSlice";
import { useRouter } from "next/router";
import { TrainerType } from "@/schemas";

function New() {
  const router = useRouter();
  const [addTrainer] = useAddTrainerMutation();

  const handleAddTrainer = async (data: TrainerType) => {
    try {
      await addTrainer(data).unwrap(); // Envoie les données au backend
      router.push("/"); // Redirection après ajout
    } catch (error) {
      console.error("Erreur lors de l'ajout du formateur :", error);
      throw error; // Laisser le formulaire afficher un message d'erreur
    }
  };

  return (
    <div className="container mx-auto p-6">
      <Header />
      <div className="container mx-auto p-6">
        <h1 className="text-4xl font-bold mb-8 text-white">New Trainer</h1>
        <TrainerForm
          onSubmit={handleAddTrainer}
          mode="add"
        />
      </div>
    </div>
  );
}

export default New;
