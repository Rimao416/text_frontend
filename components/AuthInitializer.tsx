import { useEffect } from "react";
import Cookies from "js-cookie";
import { useGetUserQuery, useRefreshTokenMutation } from "@/slice/authSlice";

export default function AuthInitializer() {
  const {  error, refetch } = useGetUserQuery(undefined, {
    skip: !Cookies.get("accessToken"), // Évite d'appeler si pas de token
  });
  const [refreshToken] = useRefreshTokenMutation();

  useEffect(() => {
    const handleTokenRefresh = async () => {
      if (error && "status" in error && error.status === 401) {
        try {
          const response = await refreshToken().unwrap();
          console.log(response);
          const newAccessToken = response;

          // Sauvegarder le nouveau token dans les cookies
          Cookies.set("accessToken", newAccessToken, { expires: 15 / (24 * 60) }); // 15 minutes

          // Relancer la requête pour récupérer les données utilisateur
          refetch();
        } catch (refreshError) {
          console.error(
            "Erreur lors du rafraîchissement du token:",
            refreshError
          );
        }
      }
    };

    if (error) {
      handleTokenRefresh();
    }
  }, [error, refreshToken, refetch]);

  // Vous devez retourner du JSX même si vous n'affichez rien
  return null; // ou remplacer par un spinner ou un élément de chargement
}
