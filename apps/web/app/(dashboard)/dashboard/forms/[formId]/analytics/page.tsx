"use client";

import { use, useEffect } from "react";
import { useFormAnalytics, useResponseTrends, useQuestionAnalytics } from "~/hooks/analytics";
import { useGetFormById } from "~/hooks/form";
import Link from "next/link";

export default function FormAnalyticsPage({ params }: { params: Promise<{ formId: string }> }) {
    const { formId } = use(params);
    const { form, isLoading: formLoading } = useGetFormById(formId);
    const { analytics, isLoading: analyticsLoading } = useFormAnalytics(formId);
    const { trends, isLoading: trendsLoading } = useResponseTrends(formId);
    const { questionAnalytics, isLoading: questionsLoading } = useQuestionAnalytics(formId);

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
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "var(--text-secondary)" }}>
                    <Link href="/dashboard/analytics" style={{ color: "var(--text-secondary)", textDecoration: "none" }}>Analytics</Link>
                    <span>/</span>
                    <span style={{ color: "var(--text-primary)", fontWeight: 500 }}>{form?.title || "Form"}</span>
                </div>
                <div>
                    <h1 style={{ fontSize: "24px", fontWeight: 600, color: "var(--text-primary)", margin: 0, letterSpacing: "-0.02em" }}>
                        {formLoading ? "Loading..." : form?.title}
                    </h1>
                    <p style={{ color: "var(--text-secondary)", margin: "8px 0 0 0", fontSize: "14px" }}>
                        {formLoading ? "Loading details..." : form?.description || "Detailed metrics and insights for this form."}
                    </p>
                </div>
            </div>

            {/* General Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "24px" }}>
                <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "12px", padding: "24px", display: "flex", flexDirection: "column", gap: "12px" }}>
                    <div style={{ fontSize: "13px", color: "var(--text-secondary)", fontWeight: 500 }}>Total Responses</div>
                    <div style={{ fontSize: "32px", color: "var(--text-primary)", fontWeight: 700 }}>
                        {analyticsLoading ? "..." : (analytics?.totalResponses || 0)}
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
                        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-secondary)", fontSize: "14px" }}>Loading chart data...</div>
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

            {/* Question Analytics */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <h2 style={{ fontSize: "18px", fontWeight: 600, color: "var(--text-primary)", margin: 0, letterSpacing: "-0.01em" }}>Question Breakdown</h2>
                {questionsLoading ? (
                    <div style={{ padding: "32px", textAlign: "center", color: "var(--text-secondary)", fontSize: "14px" }}>Loading question analytics...</div>
                ) : questionAnalytics && questionAnalytics.length > 0 ? (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px" }}>
                        {questionAnalytics.map((qa) => (
                            <div key={qa.fieldId} style={{ 
                                display: "flex", flexDirection: "column", padding: "24px", 
                                background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "12px" 
                            }}>
                                <div style={{ marginBottom: "24px" }}>
                                    <h3 style={{ fontSize: "16px", fontWeight: 600, color: "var(--text-primary)", margin: "0 0 8px 0" }}>{qa.label}</h3>
                                    <span style={{ 
                                        display: "inline-flex", padding: "2px 8px", borderRadius: "12px", 
                                        background: "var(--bg-input)", color: "var(--text-secondary)", fontSize: "11px", fontWeight: 500, textTransform: "capitalize"
                                    }}>
                                        {qa.type.replace('_', ' ')}
                                    </span>
                                </div>
                                
                                <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
                                    {["select", "radio", "checkbox"].includes(qa.type) ? (
                                        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                                            {Object.keys(qa.stats).length > 0 ? (
                                                Object.entries(qa.stats).map(([option, count]) => {
                                                    const countNum = Number(count);
                                                    const total = Object.values(qa.stats).reduce((acc, val) => acc + Number(val), 0);
                                                    const percentage = total > 0 ? ((countNum / total) * 100).toFixed(1) : "0";
                                                    return (
                                                        <div key={option} style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                                                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
                                                                <span style={{ color: "var(--text-primary)", fontWeight: 500 }}>{option}</span>
                                                                <span style={{ color: "var(--text-secondary)" }}>{countNum} ({percentage}%)</span>
                                                            </div>
                                                            <div style={{ width: "100%", height: "6px", background: "var(--bg-input)", borderRadius: "3px", overflow: "hidden" }}>
                                                                <div style={{ height: "100%", background: "var(--red)", borderRadius: "3px", width: `${percentage}%` }} />
                                                            </div>
                                                        </div>
                                                    )
                                                })
                                            ) : (
                                                <div style={{ fontSize: "13px", color: "var(--text-muted)", fontStyle: "italic" }}>No data yet</div>
                                            )}
                                        </div>
                                    ) : ["number", "rating"].includes(qa.type) ? (
                                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                                            <div style={{ display: "flex", flexDirection: "column", padding: "16px", background: "var(--bg-input)", borderRadius: "8px" }}>
                                                <span style={{ fontSize: "12px", color: "var(--text-secondary)", marginBottom: "4px" }}>Average</span>
                                                <span style={{ fontSize: "24px", fontWeight: 700, color: "var(--text-primary)" }}>{qa.stats.average || 0}</span>
                                            </div>
                                            <div style={{ display: "flex", flexDirection: "column", padding: "16px", background: "var(--bg-input)", borderRadius: "8px" }}>
                                                <span style={{ fontSize: "12px", color: "var(--text-secondary)", marginBottom: "4px" }}>Responses</span>
                                                <span style={{ fontSize: "24px", fontWeight: 700, color: "var(--text-primary)" }}>{qa.stats.count || 0}</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div style={{ display: "flex", flexDirection: "column", padding: "16px", background: "var(--bg-input)", borderRadius: "8px" }}>
                                            <span style={{ fontSize: "12px", color: "var(--text-secondary)", marginBottom: "4px" }}>Total Submissions</span>
                                            <span style={{ fontSize: "24px", fontWeight: 700, color: "var(--text-primary)" }}>{qa.stats.submitted || 0}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div style={{ padding: "40px", border: "1px dashed var(--border)", borderRadius: "12px", textAlign: "center", color: "var(--text-muted)", fontSize: "14px" }}>
                        No questions or form fields available to display analytics for.
                    </div>
                )}
            </div>
        </div>
    );
}
