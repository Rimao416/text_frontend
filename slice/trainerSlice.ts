// trainerSlice.js
import { API } from "@/config";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";
export interface ITrainer {
  _id: string;
  name: string;
  training_subjects: string[];
  location: string;
  email: string;
  password?: string; // Optionnel si nécessaire pour la création
}

export interface TrainerPayload {
  id: string;
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
    baseUrl: API.defaults.baseURL, // Remplacez par votre URL
    prepareHeaders: (headers) => {
      const token = Cookies.get("accessToken");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Trainer"], // Ajoute les tags pour l'invalidation du cache
  endpoints: (builder) => ({
    // Récupère tous les formateurs
    getTrainers: builder.query<ITrainer[], void>({
      query: () => "/trainers",
      transformResponse: (response: { data: ITrainer[] }) => response.data,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({
                type: "Trainer" as const,
                id: _id,
              })),
              { type: "Trainer", id: "LIST" },
            ]
          : [{ type: "Trainer", id: "LIST" }],
    }),

    // Récupère un formateur unique
    getSingleTrainer: builder.query<ITrainer, string>({
      query: (id) => `/trainers/${id}`,
      transformResponse: (response: { data: ITrainer }) => response.data,
      providesTags: (result, error, id) => [{ type: "Trainer", id }],
    }),

    // Ajoute un formateur
    addTrainer: builder.mutation<ITrainer, Partial<TrainerPayload>>({
      query: (trainer) => ({
        url: "/trainers",
        method: "POST",
        body: trainer,
      }),
      invalidatesTags: [{ type: "Trainer", id: "LIST" }],
    }),

    // Met à jour un formateur existant
    updateTrainer: builder.mutation<ITrainer, Partial<TrainerPayload>>({
      query: ({ id, ...data }) => ({
        url: `/trainers/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Trainer", id }],
    }),

    // Suggestion de formateur
    suggestTrainer: builder.query<
      ITrainer,
      { courseSubject: string; courseDate: string }
    >({
      query: ({ courseSubject, courseDate }) =>
        `/trainers/suggest?courseSubject=${courseSubject}&courseDate=${courseDate}`,
      providesTags: [{ type: "Trainer", id: "LIST" }],
      transformResponse: (response: { data: { trainer: ITrainer } }) =>
        response.data.trainer,
    }),
    deleteTrainer: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/trainers/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Trainer", id }],
    }),
  }),
});

// Export the auto-generated hooks for querying and mutations
export const {
  useGetTrainersQuery,
  useGetSingleTrainerQuery,
  useAddTrainerMutation,
  useUpdateTrainerMutation,
  useSuggestTrainerQuery,
  useDeleteTrainerMutation,
} = trainerApi;
