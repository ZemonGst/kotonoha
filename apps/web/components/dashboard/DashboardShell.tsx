"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

export function DashboardShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isBuilderMode = pathname?.includes("/dashboard/form/");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className={`dashboard-root ${isBuilderMode ? "is-builder-mode" : ""}`}>
            <div 
                className={`sidebar-backdrop ${isSidebarOpen ? "visible" : ""}`} 
                onClick={() => setIsSidebarOpen(false)} 
            />
            <div className="sidebar-container">
                <div className="sidebar-hover-zone" />
                <Sidebar 
                    isMobileOpen={isSidebarOpen} 
                    onClose={() => setIsSidebarOpen(false)} 
                />
            </div>
            
            <div className="dashboard-main">
                {!isBuilderMode && (
                    <Topbar onMenuClick={() => setIsSidebarOpen(true)} />
                )}
                <main className={isBuilderMode ? "builder-content" : "page-content"}>
                    {children}
                </main>
            </div>
        </div>
    );
}
