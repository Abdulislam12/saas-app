"use client";

import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { logout } from "@/lib/authSlice";

export default function Dashboard() {
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
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center shadow">
        <h1 className="text-xl font-semibold">Dashboard</h1>

      </nav>

      {/* Main Content */}
      <main className="p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded shadow text-center">
            <h2 className="text-sm text-gray-500">Total Users</h2>
            <p className="text-2xl font-bold text-blue-600">1,204</p>
          </div>
          <div className="bg-white p-6 rounded shadow text-center">
            <h2 className="text-sm text-gray-500">Active Sessions</h2>
            <p className="text-2xl font-bold text-green-600">89</p>
          </div>
          <div className="bg-white p-6 rounded shadow text-center">
            <h2 className="text-sm text-gray-500">Articles</h2>
            <p className="text-2xl font-bold text-purple-600">340</p>
          </div>
          <div className="bg-white p-6 rounded shadow text-center">
            <h2 className="text-sm text-gray-500">Storage Used</h2>
            <p className="text-2xl font-bold text-red-500">75%</p>
          </div>
        </div>

        {/* Placeholder for charts or more content */}
        <div className="bg-white p-6 rounded shadow min-h-[200px] text-gray-500 flex items-center justify-center">
          📊 Chart or Activity Feed will go here.
        </div>
      </main>
    </div>
  );
}
