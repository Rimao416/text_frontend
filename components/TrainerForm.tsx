"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { TrainerSchema } from "@/schemas";
import { useAddTrainerMutation } from "@/slice/trainerSlice";
import { useMessages } from "@/context/useMessage";
import { useRouter } from "next/navigation";
// Inférence des types à partir du schéma
type TrainerType = z.infer<typeof TrainerSchema>;

export default function TrainerForm() {
  const router = useRouter();
  const { setMessage } = useMessages();
  const {
    register,
    handleSubmit,
    trigger,
    control,
    formState: { errors },
  } = useForm<TrainerType>({
    resolver: zodResolver(TrainerSchema),
    defaultValues: {
      name: "",
      location: "",
      email: "",
      training_subjects: [{ value: "" }], // Sujet initial vide
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "training_subjects",
  });

  // Utilisation de la mutation pour ajouter un formateur
  const [addTrainer, { isLoading, isSuccess }] = useAddTrainerMutation();

  const onSubmit = async (data: TrainerType) => {
    // Transforme les sujets en un tableau de chaînes
    const formattedData = {
      ...data,
      training_subjects: data.training_subjects.map((subject) => subject.value),
    };

    try {
      const response = await addTrainer(formattedData).unwrap(); // Envoie la requête au backend
      console.log(response);
      console.log(isSuccess);
      setMessage("Formateur ajouté avec succès", "success");
      router.push("/");

      //   reset();
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
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Formulaire Formateur
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Champ Nom */}
        <div>
          <label className="block text-gray-700 font-medium">Nom</label>
          <input
            {...register("name")}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="John Doe"
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}
        </div>

        {/* Champ Localisation */}
        <div>
          <label className="block text-gray-700 font-medium">
            Localisation
          </label>
          <input
            {...register("location")}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Berlin"
          />
          {errors.location && (
            <p className="text-red-500 text-sm">{errors.location.message}</p>
          )}
        </div>

        {/* Champ Email */}
        <div>
          <label className="block text-gray-700 font-medium">Email</label>
          <input
            {...register("email")}
            type="email"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="john.doe@example.com"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}
        </div>

        {/* Sujets de formation */}
        <div>
          <label className="block text-gray-700 font-medium">
            Sujets de formation
          </label>
          {fields.map((field, index) => (
  <div key={field.id} className="flex items-center space-x-2 mt-2">
    <div>
    <input
      {...register(`training_subjects.${index}.value` as const)}
      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
      placeholder="Ex: React.js"
    />

    </div>
    {errors.training_subjects?.[index]?.value && (
      <p className="text-red-500 text-sm">
        {errors.training_subjects[index].value.message}
      </p>
    )}
    <button
      type="button"
      onClick={() => {
        if (fields.length > 1) {
          remove(index);
          trigger("training_subjects"); // 🔥 Forcer la validation
        }
      }}
      className={`px-3 py-1 rounded-md ${
        fields.length === 1 ? "bg-gray-400 cursor-not-allowed" : "bg-red-500 text-white"
      }`}
      disabled={fields.length === 1}
    >
      ×
    </button>
  </div>
))}

          {errors.training_subjects && (
            <p className="text-red-500 text-sm">
              {errors.training_subjects.message}
            </p>
          )}
          <button
            type="button"
            onClick={() => append({ value: "" })}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md"
          >
            Ajouter un sujet
          </button>
        </div>

        {/* Bouton Soumettre */}
        <button
          type="submit"
          className="w-full bg-green-500 text-white p-2 rounded-md hover:bg-green-600"
          disabled={isLoading}
        >
          {isLoading ? "En cours..." : "Soumettre"}
        </button>
      </form>

      {isSuccess && (
        <p className="text-green-500 mt-4">Formateur ajouté avec succès !</p>
      )}
    </div>
  );
}
