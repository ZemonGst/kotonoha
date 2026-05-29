"use client";

import { useState, useRef, useEffect } from "react";
import { useGetMe, useLogout } from "~/hooks/api/dashboard";
import { LogOut } from "lucide-react";

import "~/components/dashboard/dashboard.css";

function getInitials(name?: string) {
    if (!name) return "?";
    return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
}

interface TopbarProps {
    title?: string;
}

export function Topbar({ title = "Dashboard" }: TopbarProps) {
    const { user } = useGetMe();
    const { logout, status: logoutStatus } = useLogout();
    const isLoggingOut = logoutStatus === "pending";
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <header className="topbar">
            <span className="topbar-title">{title}</span>

            {/* Search */}
            <div className="topbar-search">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <circle cx="6" cy="6" r="4.5" stroke="#4A4D65" strokeWidth="1.5" />
                    <path d="M9.5 9.5L12 12" stroke="#4A4D65" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                <input placeholder="Search..." />
            </div>

            {/* Avatar + dropdown */}
            <div className="topbar-avatar-wrap" ref={dropdownRef}>
                <button
                    id="topbar-avatar-btn"
                    className="topbar-avatar"
                    onClick={() => setDropdownOpen((v) => !v)}
                    aria-label="Open user menu"
                    aria-expanded={dropdownOpen}
                >
                    {user?.profileImageUrl ? (
                        <img
                            src={user.profileImageUrl}
                            alt={user?.fullName}
                            style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }}
                        />
                    ) : (
                        getInitials(user?.fullName)
                    )}
                </button>

                {dropdownOpen && (
                    <div className="avatar-dropdown" role="menu">
                        {/* User info */}
                        <div className="avatar-dropdown-user">
                            <div className="avatar-dropdown-name">{user?.fullName ?? "—"}</div>
                            <div className="avatar-dropdown-email">{user?.email ?? "—"}</div>
                        </div>

                        <div className="avatar-dropdown-divider" />

                        {/* Logout */}
                        <button
                            id="logout-btn"
                            className="avatar-dropdown-item avatar-dropdown-item--danger"
                            onClick={() => logout()}
                            disabled={isLoggingOut}
                            role="menuitem"
                        >
                            <LogOut size={14} />
                            {isLoggingOut ? "Logging out…" : "Log out"}
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
}
