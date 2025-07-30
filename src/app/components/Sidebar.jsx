"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useDispatch } from "react-redux";
import {
    Home,
    Users,
    Linkedin,
    Captions,
    X,
    LogOut,
    Lock,
    CircleDollarSign
} from "lucide-react";
import ConfirmationModal from "./ConfirmationModal";
import { logout } from "@/lib/authSlice";

const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Profile", href: "/dashboard/profile", icon: Users },
    { name: "Linkedin", href: "/dashboard/generate-titles", icon: Linkedin },
    { name: "Your Titles", href: "/dashboard/your-titles", icon: Captions },
    { name: "Subscriptions", href: "/dashboard/subscriptions", icon: CircleDollarSign },

];

export default function Sidebar({ sidebarOpen, setSidebarOpen }) {
    const pathname = usePathname();
    const router = useRouter();
    const dispatch = useDispatch();
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [loggingOut, setLoggingOut] = useState(false);

    const handleLogoutClick = (e) => {
        e.preventDefault();
        setShowLogoutModal(true);
    };

    const handleLogoutCancel = () => {
        setShowLogoutModal(false);
    };

    const handleLogoutConfirm = async () => {
        dispatch(logout());
        router.push("/login")
    };

    const renderNavItem = (item, isMobile = false) => {
        const isActive = pathname === item.href;
        const isLogout = item.name === "Sign Out";

        const baseClasses = `group flex items-center px-2 py-2 text-sm font-medium rounded-md ${isActive ? "bg-blue-100 text-blue-900" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`;

        if (isLogout) {
            return (
                <button
                    key={item.name}
                    onClick={handleLogoutClick}
                    className={baseClasses}
                    disabled={loggingOut}
                >
                    <item.icon className="mr-3 h-5 w-5" />
                    {loggingOut ? "Signing out..." : item.name}
                </button>
            );
        }

        return (
            <Link
                key={item.name}
                href={item.href}
                className={baseClasses}
                onClick={() => isMobile && setSidebarOpen(false)}
            >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
            </Link>
        );
    };

    return (
        <>
            {/* Mobile sidebar */}
            <div className="lg:hidden">
                <div
                    className={`fixed inset-0 z-50 transition-opacity duration-300 ${sidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                        }`}
                >
                    <div
                        className={`fixed inset-0 bg-gray-600 transition-opacity duration-300 ${sidebarOpen ? "bg-opacity-75" : "bg-opacity-0"
                            }`}
                        onClick={() => setSidebarOpen(false)}
                    />
                    <div
                        className={`fixed inset-y-0 left-0 flex w-64 flex-col bg-white transform transition-transform duration-300 ease-in-out ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
                            }`}
                    >
                        <div className="flex h-16 items-center justify-between px-4">
                            <h1 className="text-xl font-bold text-gray-900">Saas Ai App</h1>
                            <button
                                onClick={() => setSidebarOpen(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>
                        <nav className="flex-1 space-y-1 px-4 py-2">
                            <div className="border-t border-gray-200 mb-4"></div>

                            {navigation.map((item) => renderNavItem(item, true))}

                            <div className="pt-4 border-t border-gray-200" style={{ marginTop: "16px" }}>
                                {renderNavItem(
                                    { name: "Change Password", href: "/dashboard/change-password", icon: Lock },
                                    true
                                )}
                                {renderNavItem({ name: "Sign Out", href: "#", icon: LogOut }, true)}
                            </div>
                        </nav>
                    </div>
                </div>
            </div>

            {/* Desktop sidebar */}
            <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-56 lg:flex-col">
                <div className="flex flex-col flex-grow bg-white border-r border-gray-200">
                    <div className="flex h-16 items-center px-4">
                        <h1 className="text-xl font-bold text-gray-900">Saas Ai App</h1>
                    </div>
                    <nav className="flex-1 space-y-1 px-4 py-2">
                        <div className="border-t border-gray-200 mb-4"></div>

                        {navigation.map((item) => renderNavItem(item))}

                        <div className="pt-4 border-t border-gray-200" style={{ marginTop: "16px" }}>
                            {renderNavItem({ name: "Change Password", href: "/dashboard/change-password", icon: Lock })}
                            {renderNavItem({ name: "Sign Out", href: "#", icon: LogOut })}
                        </div>
                    </nav>
                </div>
            </div>

            {/* Logout Confirmation Modal */}
            <ConfirmationModal
                isOpen={showLogoutModal}
                onClose={handleLogoutCancel}
                onConfirm={handleLogoutConfirm}
                title="Sign Out"
                message="Are you sure you want to sign out?"
                confirmText={loggingOut ? "Signing out..." : "Sign Out"}
                cancelText="Cancel"
                type="danger"
            />
        </>
    );
}
