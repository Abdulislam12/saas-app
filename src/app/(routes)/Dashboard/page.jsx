"use client";

import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { logout } from "../lib/authSlice";



export default function HomePage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) return null;

  const handleLogout = () => {
    dispatch(logout());
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <nav className="bg-blue-600 text-white px-4 py-3 flex justify-between rounded">
        <span>Welcome, {user?.email}</span>
        <button
          onClick={handleLogout}
          className="bg-white text-blue-600 px-4 py-1 rounded hover:bg-gray-200"
        >
          Logout
        </button>
      </nav>
      <div className="min-h-screen bg-gray-100 p-4">
        
      </div>
    </div>
  );
}
