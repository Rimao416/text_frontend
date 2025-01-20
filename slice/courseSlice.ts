// coursesSlice.js
import { API } from "@/config";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface ICourse {
  id: string;
  name: string;
  date: string; // Date sous forme de chaîne de caractères ISO
  subject: string;
  location: string;
  participants: number;
  notes?: string;
  price: number;
  trainerPrice: number; // Ajouter le prix du formateur
  trainer: {
    _id: string;
    name: string;
    email: string;
    training_subjects: string[];
  } | null;
}

// Define the API slice for courses
export const courseApi = createApi({
  reducerPath: "courseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: API.defaults.baseURL,
    credentials: "include",
  }),

  endpoints: (builder) => ({
    // Query pour récupérer les cours
    getCourses: builder.query<ICourse[], void>({
      query: () => "/courses",
      transformResponse: (response: { data: ICourse[] }) => {
        return response.data;
      },
    }),

    // Mutation pour ajouter un cours
    addCourse: builder.mutation<ICourse, Partial<ICourse>>({
      query: (newCourse) => ({
        url: "/courses", // URL de l'endpoint pour créer un cours
        method: "POST",
        body: newCourse,
      }),
    }),
    getCourseById: builder.query<ICourse, string>({
      query: (id) => `courses/${id}`,
      transformResponse: (response: { data: ICourse }) => {
        return response.data;
      },
    }),
    assignTrainer: builder.mutation({
      query: ({ courseId, trainerEmail }) => ({
        url: `/courses/${courseId}/assign-trainer`,
        method: "PUT",
        body: { trainerEmail },
      }),
    }),
  }),
});

// Export des hooks générés automatiquement
export const {
  useGetCoursesQuery,
  useAddCourseMutation,
  useGetCourseByIdQuery,
  useAssignTrainerMutation,
} = courseApi;
