"use client";

import { useDashboardAnalytics, useResponseTrends, useTopPerformingForms } from "~/hooks/analytics";
import { useGetMe } from "~/hooks/api/dashboard";

export default function AnalyticsDashboardPage() {
    const { user } = useGetMe();
    const { analytics, isLoading: analyticsLoading } = useDashboardAnalytics();
    const { trends, isLoading: trendsLoading } = useResponseTrends();
    const { topForms, isLoading: topFormsLoading } = useTopPerformingForms();

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "40px", width: "100%" }}>
            <style>{`
                /* Hide scrollbar for Chrome, Safari and Opera */
                ::-webkit-scrollbar {
                    display: none;
                }
                /* Hide scrollbar for IE, Edge and Firefox */
                * {
                    -ms-overflow-style: none;  /* IE and Edge */
                    scrollbar-width: none;  /* Firefox */
                }
            `}</style>
            {/* Header Section */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <h1 style={{ fontSize: "24px", fontWeight: 600, color: "var(--text-primary)", margin: 0, letterSpacing: "-0.02em" }}>Analytics Overview</h1>
                <p style={{ color: "var(--text-secondary)", margin: 0, fontSize: "14px" }}>
                    Welcome back, {user?.fullName?.split(" ")[0] || "User"}. Here are the metrics for your forms.
                </p>
            </div>

            {/* Quick Stats Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "24px" }}>
                <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "12px", padding: "24px", display: "flex", flexDirection: "column", gap: "12px" }}>
                    <div style={{ fontSize: "13px", color: "var(--text-secondary)", fontWeight: 500 }}>Total Forms</div>
                    <div style={{ fontSize: "32px", color: "var(--text-primary)", fontWeight: 700 }}>
                        {analyticsLoading ? "..." : (analytics?.totalForms || 0)}
                    </div>
                </div>

                <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "12px", padding: "24px", display: "flex", flexDirection: "column", gap: "12px" }}>
                    <div style={{ fontSize: "13px", color: "var(--text-secondary)", fontWeight: 500 }}>Total Responses</div>
                    <div style={{ fontSize: "32px", color: "var(--text-primary)", fontWeight: 700 }}>
                        {analyticsLoading ? "..." : (analytics?.totalResponses || 0)}
                    </div>
                </div>

                <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "12px", padding: "24px", display: "flex", flexDirection: "column", gap: "12px" }}>
                    <div style={{ fontSize: "13px", color: "var(--text-secondary)", fontWeight: 500 }}>Active Forms</div>
                    <div style={{ fontSize: "32px", color: "var(--text-primary)", fontWeight: 700 }}>
                        {analyticsLoading ? "..." : (analytics?.activeForms || 0)}
                    </div>
                </div>

                <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "12px", padding: "24px", display: "flex", flexDirection: "column", gap: "12px" }}>
                    <div style={{ fontSize: "13px", color: "var(--text-secondary)", fontWeight: 500 }}>Drafts / Archived</div>
                    <div style={{ fontSize: "32px", color: "var(--text-primary)", fontWeight: 700 }}>
                        {analyticsLoading ? "..." : `${analytics?.draftForms || 0} / ${analytics?.archivedForms || 0}`}
                    </div>
                </div>
            </div>

            {/* Response Trends Chart */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <h2 style={{ fontSize: "18px", fontWeight: 600, color: "var(--text-primary)", margin: 0, letterSpacing: "-0.01em" }}>Response Trends</h2>
                <div style={{ 
                    width: "100%", height: "260px", padding: "24px", 
                    background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "12px",
                    display: "flex", flexDirection: "column", justifyContent: "flex-end", position: "relative"
                }}>
                    {trendsLoading ? (
                        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-secondary)", fontSize: "14px" }}>
                            Loading chart data...
                        </div>
                    ) : trends && trends.length > 0 ? (
                        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "8px", width: "100%", height: "100%" }}>
                            {trends.map((point) => {
                                const maxCount = Math.max(...trends.map(t => t.count), 1);
                                const height = `${(point.count / maxCount) * 100}%`;
                                return (
                                    <div key={point.date} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", height: "100%" }}>
                                        <div style={{ flex: 1, width: "100%", height: "100%", display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
                                            <div style={{ 
                                                width: "100%", maxWidth: "32px", height, 
                                                background: "var(--red)", borderRadius: "4px 4px 0 0", minHeight: "4px" 
                                            }} title={`${point.count} responses`} />
                                        </div>
                                        <span style={{ fontSize: "11px", color: "var(--text-secondary)" }}>{point.date.slice(5)}</span>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)", fontSize: "14px" }}>
                            No response data available yet
                        </div>
                    )}
                </div>
            </div>

            {/* Top Performing Forms */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <h2 style={{ fontSize: "18px", fontWeight: 600, color: "var(--text-primary)", margin: 0, letterSpacing: "-0.01em" }}>Top Performing Forms</h2>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {topFormsLoading ? (
                        <div style={{ padding: "32px", textAlign: "center", color: "var(--text-secondary)", fontSize: "14px" }}>Loading top forms...</div>
                    ) : topForms && topForms.length > 0 ? (
                        topForms.map((form, index) => (
                            <div key={form.formId} style={{ 
                                display: "flex", alignItems: "center", justifyContent: "space-between", 
                                padding: "16px 20px", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "10px"
                            }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                                    <div style={{ 
                                        width: "28px", height: "28px", borderRadius: "6px", 
                                        background: "var(--red-subtle)", color: "var(--red)", 
                                        display: "flex", alignItems: "center", justifyContent: "center", 
                                        fontWeight: 600, fontSize: "13px"
                                    }}>
                                        {index + 1}
                                    </div>
                                    <span style={{ fontWeight: 500, color: "var(--text-primary)", fontSize: "15px" }}>{form.title}</span>
                                </div>
                                <div style={{ padding: "6px 12px", background: "var(--bg-input)", borderRadius: "20px", display: "flex", alignItems: "center", gap: "6px" }}>
                                    <span style={{ color: "var(--text-primary)", fontWeight: 600, fontSize: "13px" }}>{form.responseCount}</span>
                                    <span style={{ color: "var(--text-secondary)", fontSize: "13px" }}>responses</span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div style={{ padding: "40px", border: "1px dashed var(--border)", borderRadius: "12px", textAlign: "center", color: "var(--text-muted)", fontSize: "14px" }}>
                            No form performance data available yet
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
