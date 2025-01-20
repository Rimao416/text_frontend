// trainerSlice.js
import { API } from "@/config";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface ITrainer {
    _id: string;
  name: string;
  training_subjects: string[];
  location: string;
  email: string;
  password?: string; // Optionnel si nécessaire pour la création
}

export interface TrainerPayload {
  name: string;
  training_subjects: string[];
  location: string;
  email: string;
  password?: string; // Optionnel si nécessaire
}

// Define the API slice for trainers
export const trainerApi = createApi({
  reducerPath: "trainerApi",
  baseQuery: fetchBaseQuery({
    baseUrl: API.defaults.baseURL,
    credentials: "include", // Inclus les cookies dans les requêtes
  }),
  tagTypes: ["Trainer"], // Ajoute les tags pour l'invalidation du cache
  endpoints: (builder) => ({
    // Récupère les formateurs
    getTrainers: builder.query<ITrainer[], void>({
      query: () => "/trainers",
      transformResponse: (response: { data: ITrainer[] }) => response.data,

      providesTags: (result) =>
        result
          ? [
              ...result.map(({ email }) => ({
                type: "Trainer" as const,
                id: email,
              })),
              { type: "Trainer", id: "LIST" },
            ]
          : [{ type: "Trainer", id: "LIST" }],
    }),

    // Ajoute un formateur
    addTrainer: builder.mutation<ITrainer, TrainerPayload>({
      query: (trainer) => ({
        url: "/trainers",
        method: "POST",
        body: trainer,
      }),
      invalidatesTags: [{ type: "Trainer", id: "LIST" }],
    }),
    suggestTrainer: builder.query<
      ITrainer,
      { courseSubject: string; courseDate: string }
    >({
      query: ({ courseSubject, courseDate }) =>
        `/trainers/suggest?courseSubject=${courseSubject}&courseDate=${courseDate}`,
      providesTags: [{ type: "Trainer", id: "LIST" }],
      transformResponse: (response: { data: { trainer: ITrainer } }) => response.data.trainer,
    }),
  }),
});

// Export the auto-generated hooks for querying and mutations
export const {
  useGetTrainersQuery,
  useAddTrainerMutation,
  useSuggestTrainerQuery,
} = trainerApi;
