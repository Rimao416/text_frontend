import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const privateRoutes = ["/courses", "/auth/login", "/auth/new-password"];
const authRoutes = [
  "/auth/login",
  "/auth/register",
  "/auth/error",
  "/auth/reset",
  "/auth/new-password",
];

export function middleware(req: NextRequest) {
  const token = req.cookies.get("accessToken")?.value; // Récupérer le token depuis les cookies
  const isAuthenticated = !!token; // Vérifier si l'utilisateur est authentifié

  const { pathname } = req.nextUrl;

  // 🔹 Si l'utilisateur est authentifié et veut accéder à une route d'auth
  if (isAuthenticated && authRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/", req.url)); // Rediriger vers la home ou dashboard
  }

  // 🔹 Si l'utilisateur n'est PAS authentifié et veut accéder à une route privée
  if (!isAuthenticated && privateRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/login", req.url)); // Rediriger vers login
  }

  // ✅ Autoriser l'accès aux autres routes
  return NextResponse.next();
}

// 🔹 Spécifier les chemins où le middleware doit s'exécuter
const allRoutes = privateRoutes.concat(authRoutes, ["/dashboard"]);

export const config = {
  matcher: allRoutes,
};
