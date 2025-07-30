"use client";

import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { useRouter } from "next/navigation";



export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) return null;


  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <nav className="bg-blue-600 text-white px-4 py-3 flex justify-between rounded">
        <span>Welcome, {user?.email}</span>
      </nav>
      <div className="min-h-screen bg-gray-100 p-4">
      </div>
    </div>
  );
}
