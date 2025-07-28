// lib/auth.js
import { cookies } from "next/headers";

export function isLoggedIn() {
  const token = cookies().get("token");
  return !!token;
}
