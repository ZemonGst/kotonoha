"use client";



import { useGetMe } from "~/hooks/api/dashboard";

export default function DashboardPage() {
    const { user, isLoading } = useGetMe();

    return (
        <div className="dashboard-page">
            <div className="page-header">
                <div className="page-header-left">
                    <h1>Welcome back, {isLoading ? "..." : user?.fullName?.split(" ")[0] || "User"}</h1>
                    <p>Here's what's happening with your forms today.</p>
                </div>
            </div>

            {/* Placeholder for the rest of the dashboard content */}
            <div className="stat-cards-row" style={{ display: "flex", gap: "16px", marginTop: "24px" }}>
                <div className="stat-card" style={{ flex: 1 }}>
                    <div className="stat-card-label">Published Forms</div>
                    <div className="stat-card-value">0</div>
                </div>
                <div className="stat-card" style={{ flex: 1 }}>
                    <div className="stat-card-label">Drafts</div>
                    <div className="stat-card-value">0</div>
                </div>
                <div className="stat-card" style={{ flex: 1 }}>
                    <div className="stat-card-label">Total Responses</div>
                    <div className="stat-card-value">0</div>
                </div>
                <div className="stat-card" style={{ flex: 1 }}>
                    <div className="stat-card-label">Total Views</div>
                    <div className="stat-card-value">0</div>
                </div>
            </div>
            
            <div className="empty-state" style={{ marginTop: "40px", border: "1px dashed var(--border)", borderRadius: "12px" }}>
                <h3>No forms yet</h3>
                <p>Create your first form to start collecting responses.</p>
                <button className="btn-primary">Create New Form</button>
            </div>
        </div>
    );
}
