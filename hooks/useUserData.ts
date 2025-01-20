import { useEffect } from "react";
import Cookies from "js-cookie";
import { useGetUserQuery, useRefreshTokenMutation } from "../slice/authSlice";



const useUserData = () => {
  const { data: user, error, refetch } = useGetUserQuery(undefined, {
    skip: !Cookies.get("accessToken"), // Ne pas appeler l'API si pas de token
  });
  const [refreshToken] = useRefreshTokenMutation();

  useEffect(() => {
    const handleTokenRefresh = async () => {
      if (error && "status" in error && error.status === 401) {
        try {
          const response = await refreshToken().unwrap();
          console.log(response)
          const newAccessToken = response;

          // Sauvegarder le nouveau token dans les cookies
          Cookies.set("accessToken", newAccessToken, { expires: 1 / 24 }); // Expiration dans 1 heure

          // Relancer la requête pour récupérer les données utilisateur
          refetch();
        } catch (refreshError) {
          console.error("Erreur lors du rafraîchissement du token:", refreshError);
        }
      }
    };

    if (error) {
      handleTokenRefresh();
    }
  }, [error, refreshToken, refetch]);

  return { user, error };
};

export default useUserData;
