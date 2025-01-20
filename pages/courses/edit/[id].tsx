import CourseForm from "@/components/CourseForm";
import Header from "@/components/Header";
import { useRouter } from "next/router";
import { useGetCourseByIdQuery, useUpdateCourseMutation } from "@/slice/courseSlice";

function EditTrainerPage() {
  const router = useRouter();
  const { id } = router.query;

  // Charger les données du cours
  const { data: course, isLoading } = useGetCourseByIdQuery(id as string, {
    skip: !id,
  });

  // Mutation pour mettre à jour le cours
  const [updateCourse] = useUpdateCourseMutation();

  // Handler pour soumettre les données mises à jour
  const handleUpdateCourse = async (data: Omit<typeof course, "id" | "trainer">) => {
    try {
      await updateCourse({ id: id as string, ...data }).unwrap();
    } catch (err) {
      console.error("Error updating course:", err);
    }
  };

  if (isLoading) return <p>Loading...</p>;

  if (!course) return <p>Course not found</p>;

  // Mapper les valeurs par défaut pour le formulaire
  const defaultValues = {
    name: course.name,
    date: course.date,
    subject: course.subject,
    location: course.location,
    participants: course.participants,
    price: course.price,
    trainerPrice: course.trainer_price,
    notes: course.notes,
  };

  return (
    <div className="container mx-auto p-6">
      <Header />
      <h1 className="text-4xl font-bold mb-8 text-white">Edit Course</h1>
      <CourseForm
        onSubmit={handleUpdateCourse}
        mode="edit"
        defaultValues={defaultValues} // Pré-remplir le formulaire
      />
    </div>
  );
}

export default EditTrainerPage;
