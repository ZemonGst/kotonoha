"use client";

import { useState, useRef, useEffect } from "react";
import { useGetMe, useLogout } from "~/hooks/api/dashboard";
import { LogOut, FileIcon, Search, FileEdit, Archive, Send, Menu } from "lucide-react";
import { useGetAllForms } from "~/hooks/draft";
import { useRouter } from "next/navigation";

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
    onMenuClick?: () => void;
}

export function Topbar({ title = "Dashboard", onMenuClick }: TopbarProps) {
    const { user } = useGetMe();
    const { logout, status: logoutStatus } = useLogout();
    const isLoggingOut = logoutStatus === "pending";
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Search functionality
    const { forms } = useGetAllForms();
    const [searchQuery, setSearchQuery] = useState("");
    const [searchOpen, setSearchOpen] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    // Close dropdowns when clicking outside
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setDropdownOpen(false);
            }
            if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
                setSearchOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const filteredForms = forms?.filter(f => 
        f.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        f.description?.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

    const handleFormClick = (form: any) => {
        setSearchOpen(false);
        setSearchQuery("");
        if (form.status === "active") {
            router.push(`/dashboard/responses?formId=${form.id}`);
        } else if (form.status === "draft") {
            router.push(`/dashboard/form/${form.id}`);
        } else if (form.status === "archived") {
            router.push(`/dashboard/responses?formId=${form.id}`);
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "active": return <Send size={14} className="text-[#50CD89]" />;
            case "draft": return <FileEdit size={14} className="text-[#A1A5B7]" />;
            case "archived": return <Archive size={14} className="text-[#FFA800]" />;
            default: return <FileIcon size={14} className="text-[#A1A5B7]" />;
        }
    };

    return (
        <header className="topbar">
            <div className="flex items-center gap-3">
                {onMenuClick && (
                    <button 
                        onClick={onMenuClick} 
                        className="lg:hidden text-[#8B8FA8] hover:text-white p-1 -ml-1 rounded-md hover:bg-[rgba(255,255,255,0.05)] transition-colors"
                        aria-label="Toggle menu"
                    >
                        <Menu size={20} />
                    </button>
                )}
                <span className="topbar-title">{title}</span>
            </div>

            {/* Search */}
            <div className="topbar-search relative" ref={searchRef}>
                <Search size={14} className="text-[#4A4D65] flex-shrink-0" />
                <input 
                    placeholder="Search forms..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setSearchOpen(true)}
                />
                
                {searchOpen && searchQuery && (
                    <div className="absolute top-[calc(100%+8px)] left-0 w-80 bg-[#0E0F1A] border border-[rgba(255,255,255,0.07)] rounded-xl shadow-2xl overflow-hidden z-[100] max-h-96 flex flex-col">
                        <div className="p-2 text-xs font-semibold text-[#8B8FA8] uppercase tracking-wider border-b border-[rgba(255,255,255,0.05)] bg-[#080910]">
                            Search Results
                        </div>
                        <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-1">
                            {filteredForms.length === 0 ? (
                                <div className="p-4 text-center text-[#A1A5B7] text-sm">
                                    No forms found matching "{searchQuery}"
                                </div>
                            ) : (
                                filteredForms.map((form) => (
                                    <button
                                        key={form.id}
                                        onClick={() => handleFormClick(form)}
                                        className="text-left w-full p-2.5 rounded-lg hover:bg-[rgba(255,255,255,0.04)] transition-colors flex flex-col gap-1"
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium text-white line-clamp-1">{form.title}</span>
                                            {getStatusIcon(form.status)}
                                        </div>
                                        {form.description && (
                                            <span className="text-xs text-[#8B8FA8] line-clamp-1">{form.description}</span>
                                        )}
                                    </button>
                                ))
                            )}
                        </div>
                    </div>
                )}
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
