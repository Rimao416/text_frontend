import { API } from "@/config";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";
export interface ICourse {
  id: string;
  name: string;
  date: string; // Date sous forme de chaîne de caractères ISO
  subject: string;
  location: string;
  participants: number;
  notes?: string;
  price: number;
  trainer_price: number; // Ajouter le prix du formateur
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
    baseUrl: API.defaults.baseURL, // Remplacez par votre URL
    prepareHeaders: (headers) => {
      const token = Cookies.get("accessToken");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
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

    // Mutation pour supprimer un cours
    deleteCourse: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/courses/${id}`,
        method: "DELETE",
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

    updateCourse: builder.mutation<ICourse, Partial<ICourse>>({
      query: ({ id, ...data }) => ({
        url: `/courses/${id}`,
        method: "PUT",
        body: data,
      }),
    }),
  }),
});

// Export des hooks générés automatiquement
export const {
  useGetCoursesQuery,
  useAddCourseMutation,
  useDeleteCourseMutation,
  useGetCourseByIdQuery,
  useAssignTrainerMutation,
  useUpdateCourseMutation,
} = courseApi; 
