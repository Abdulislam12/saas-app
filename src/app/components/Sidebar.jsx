"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
    Home,
    Users,
    FileText,
    CreditCard,
    Package,
    BarChart3,
    X,
    Receipt,
    BookOpen,
    LogOut,
    Lock,
    Banknote,
} from "lucide-react";
import ConfirmationModal from "./ConfirmationModal";

const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Profile", href: "/profile", icon: Users },
    { name: "Linkedin", href: "/post-title-generator", icon: Package },
    { name: "Invoices", href: "/invoices", icon: FileText },
    { name: "Payments", href: "/payments", icon: CreditCard },
    { name: "Expenses", href: "/expenses", icon: Receipt },
    { name: "Accounts", href: "/accounts", icon: Banknote },
    { name: "Ledger", href: "/ledger", icon: BookOpen },
    { name: "Reports", href: "/reports", icon: BarChart3 },
];

export default function Sidebar({ sidebarOpen, setSidebarOpen }) {
    const pathname = usePathname();
    const router = useRouter();
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
        setLoggingOut(true);
        try {
            await fetch("/api/logout", { method: "POST" });
            router.push("/login");
        } catch (error) {
            console.error("Sign out error:", error);
        } finally {
            setLoggingOut(false);
            setShowLogoutModal(false);
        }
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
                            <h1 className="text-xl font-bold text-gray-900">Rustam Industry</h1>
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
                                    { name: "Change Password", href: "/change-password", icon: Lock },
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
                        <h1 className="text-xl font-bold text-gray-900">Rustam Industry</h1>
                    </div>
                    <nav className="flex-1 space-y-1 px-4 py-2">
                        <div className="border-t border-gray-200 mb-4"></div>

                        {navigation.map((item) => renderNavItem(item))}

                        <div className="pt-4 border-t border-gray-200" style={{ marginTop: "16px" }}>
                            {renderNavItem({ name: "Change Password", href: "/change-password", icon: Lock })}
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
