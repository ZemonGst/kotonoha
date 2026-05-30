"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

export function DashboardShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isBuilderMode = pathname?.includes("/dashboard/form/");

    return (
        <div className={`dashboard-root ${isBuilderMode ? "is-builder-mode" : ""}`}>
            <div className="sidebar-container">
                <div className="sidebar-hover-zone" />
                <Sidebar />
            </div>
            
            <div className="dashboard-main">
                {!isBuilderMode && <Topbar />}
                <main className={isBuilderMode ? "builder-content" : "page-content"}>
                    {children}
                </main>
            </div>
        </div>
    );
}
