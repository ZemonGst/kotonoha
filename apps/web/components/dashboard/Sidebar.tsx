"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useGetMe } from "~/hooks/api/dashboard";
import { CreateFormModal } from "./CreateFormModal";
import { Logo } from "~/components/ui/Logo";

import {
    Plus,
    File,
    Send,
    Inbox,
    BarChart2,
    Archive,
    Layout,
    Search,
    Settings,
} from "lucide-react";

import "~/components/dashboard/dashboard.css";

const navItems = [
    { label: "Form Creation",   href: "/dashboard/create",    icon: Plus },
    { label: "Drafts",          href: "/dashboard/drafts",    icon: File },
    { label: "Published Forms", href: "/dashboard/published-forms", icon: Send },
    { label: "Responses",       href: "/dashboard/responses", icon: Inbox },
    { label: "Analytics",       href: "/dashboard/analytics", icon: BarChart2 },
    { label: "Archived Forms",  href: "/dashboard/archived-forms",  icon: Archive },
];

function getInitials(name?: string) {
    if (!name) return "?";
    return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
}
interface SidebarProps {
    isMobileOpen?: boolean;
    onClose?: () => void;
}

export function Sidebar({ isMobileOpen, onClose }: SidebarProps = {}) {
    const pathname = usePathname();
    const { user } = useGetMe();

    return (
        <aside className={`sidebar ${isMobileOpen ? 'mobile-open' : ''}`}>
            {/* Logo — clicking navigates to the home dashboard */}
            <Link href="/dashboard" className="sidebar-logo" style={{ textDecoration: "none" }} onClick={onClose}>
                <Logo iconSize={36} textSize={20} />
            </Link>

            {/* Nav */}
            <nav className="sidebar-nav">
                {navItems.map(({ label, href, icon: Icon }) => {
                    const isActive = pathname === href || pathname.startsWith(href + "/");
                    const navItemElement = (
                        <div
                            key={href}
                            className={`nav-item${isActive ? " active" : ""} cursor-pointer`}
                        >
                            <Icon className="nav-item-icon" size={16} />
                            {label}
                        </div>
                    );

                    if (href === "/dashboard/create") {
                        return (
                            <CreateFormModal key={href}>
                                {navItemElement}
                            </CreateFormModal>
                        );
                    }

                    return (
                        <Link
                            key={href}
                            href={href}
                            className={`nav-item${isActive ? " active" : ""}`}
                            onClick={onClose}
                        >
                            <Icon className="nav-item-icon" size={16} />
                            {label}
                        </Link>
                    );
                })}
            </nav>

            {/* User profile */}
            <div className="sidebar-user">
                <div className="sidebar-avatar">
                    {user?.profileImageUrl ? (
                        <img
                            src={user.profileImageUrl}
                            alt={user.fullName}
                            style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }}
                        />
                    ) : (
                        getInitials(user?.fullName)
                    )}
                </div>
                <div className="sidebar-user-info">
                    <div className="sidebar-user-name">{user?.fullName ?? "Loading..."}</div>
                    <div className="sidebar-user-email">{user?.email ?? ""}</div>
                </div>
            </div>
        </aside>
    );
}
