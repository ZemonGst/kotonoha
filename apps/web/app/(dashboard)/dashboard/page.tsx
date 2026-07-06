"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import {
    FileText,
    FileEdit,
    Send,
    MessageSquare,
    Plus,
    LayoutTemplate,
    BarChart2,
    CheckCircle2,
    Clock,
    Archive,
    MoreHorizontal,
    TrendingUp,
    Activity,
    Zap,
    Eye,
    Pencil,
    ChevronRight,
    Loader2,
} from "lucide-react";

import { useGetMe } from "~/hooks/api/dashboard";
import { useGetAllForms } from "~/hooks/draft";
import { useDashboardAnalytics } from "~/hooks/analytics";
import { CreateFormModal } from "~/components/dashboard/CreateFormModal";

// ─── Types ───────────────────────────────────────────────────────────────────

type FormStatus = "draft" | "active" | "archived";

// ─── Status badge config ─────────────────────────────────────────────────────

const statusConfig: Record<FormStatus, { label: string; color: string; bg: string }> = {
    active:   { label: "Published", color: "#10b981", bg: "rgba(16,185,129,0.12)" },
    draft:    { label: "Draft",     color: "#f59e0b", bg: "rgba(245,158,11,0.12)" },
    archived: { label: "Archived",  color: "#8B8FA8", bg: "rgba(139,143,168,0.12)" },
};

function StatusBadge({ status }: { status: FormStatus }) {
    const cfg = statusConfig[status];
    return (
        <span
            style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                padding: "3px 9px",
                borderRadius: 20,
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "0.02em",
                color: cfg.color,
                background: cfg.bg,
            }}
        >
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: cfg.color, flexShrink: 0 }} />
            {cfg.label}
        </span>
    );
}

// ─── Skeleton loaders ─────────────────────────────────────────────────────────

function StatCardSkeleton() {
    return (
        <div
            style={{
                background: "#0E0F1A",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 14,
                padding: "20px 22px",
                display: "flex",
                flexDirection: "column",
                gap: 12,
            }}
        >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ width: 80, height: 12, borderRadius: 6, background: "rgba(255,255,255,0.06)" }} />
                <div style={{ width: 34, height: 34, borderRadius: 10, background: "rgba(255,255,255,0.06)" }} />
            </div>
            <div>
                <div style={{ width: 56, height: 32, borderRadius: 6, background: "rgba(255,255,255,0.06)", marginBottom: 8 }} />
                <div style={{ width: 100, height: 11, borderRadius: 6, background: "rgba(255,255,255,0.04)" }} />
            </div>
        </div>
    );
}

function FormCardSkeleton() {
    return (
        <div
            style={{
                background: "#0E0F1A",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 14,
                padding: "18px 20px",
                display: "flex",
                flexDirection: "column",
                gap: 12,
            }}
        >
            <div style={{ display: "flex", gap: 12 }}>
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
                    <div style={{ width: "60%", height: 14, borderRadius: 6, background: "rgba(255,255,255,0.07)" }} />
                    <div style={{ width: "90%", height: 12, borderRadius: 6, background: "rgba(255,255,255,0.04)" }} />
                </div>
                <div style={{ width: 26, height: 26, borderRadius: 6, background: "rgba(255,255,255,0.04)", flexShrink: 0 }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ width: 120, height: 11, borderRadius: 6, background: "rgba(255,255,255,0.04)" }} />
                <div style={{ width: 80, height: 28, borderRadius: 8, background: "rgba(255,255,255,0.04)" }} />
            </div>
        </div>
    );
}

// ─── Form Card ────────────────────────────────────────────────────────────────

function FormCard({ form }: { form: { id: string; title: string; description?: string | null; status: FormStatus; updatedAt: string } }) {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <div
            style={{
                background: "#0E0F1A",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 14,
                padding: "18px 20px",
                display: "flex",
                flexDirection: "column",
                gap: 12,
                transition: "border-color 200ms, box-shadow 200ms",
                position: "relative",
            }}
            className="form-card-hover"
        >
            {/* Header */}
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
                <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 4 }}>
                        <span style={{ fontSize: 14, fontWeight: 600, color: "#FFFFFF", lineHeight: 1.4 }}>
                            {form.title}
                        </span>
                        <StatusBadge status={form.status} />
                    </div>
                    <p style={{ fontSize: 13, color: "#8B8FA8", lineHeight: 1.5, margin: 0 }}>
                        {form.description || "No description provided."}
                    </p>
                </div>

                {/* More menu */}
                <div style={{ position: "relative", flexShrink: 0 }}>
                    <button
                        onClick={() => setMenuOpen((p) => !p)}
                        style={{
                            background: "transparent",
                            border: "none",
                            color: "#4A4D65",
                            cursor: "pointer",
                            padding: "4px 6px",
                            borderRadius: 6,
                            display: "flex",
                            alignItems: "center",
                            transition: "background 150ms, color 150ms",
                        }}
                        className="more-btn-hover"
                        onBlur={() => setTimeout(() => setMenuOpen(false), 150)}
                    >
                        <MoreHorizontal size={16} />
                    </button>

                    {menuOpen && (
                        <div
                            style={{
                                position: "absolute",
                                top: "calc(100% + 6px)",
                                right: 0,
                                background: "#0E0F1A",
                                border: "1px solid rgba(255,255,255,0.1)",
                                borderRadius: 10,
                                boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
                                zIndex: 50,
                                overflow: "hidden",
                                minWidth: 160,
                            }}
                        >
                            {[
                                { icon: Eye,      label: "View Responses", href: `/dashboard/responses?formId=${form.id}` },
                                { icon: Pencil,   label: "Edit Form",       href: `/dashboard/form/${form.id}` },
                                { icon: BarChart2,label: "View Analytics",  href: `/dashboard/analytics` },
                            ].map(({ icon: Icon, label, href }) => (
                                <Link
                                    key={label}
                                    href={href}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 9,
                                        padding: "9px 14px",
                                        color: "#8B8FA8",
                                        fontSize: 13,
                                        textDecoration: "none",
                                        transition: "background 120ms, color 120ms",
                                    }}
                                    className="dropdown-item-hover"
                                >
                                    <Icon size={13} />
                                    {label}
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Footer */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "#4A4D65" }}>
                    <Clock size={12} />
                    {formatDistanceToNow(new Date(form.updatedAt), { addSuffix: true })}
                </span>
                <Link
                    href={`/dashboard/form/${form.id}`}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        padding: "6px 12px",
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        borderRadius: 8,
                        color: "#8B8FA8",
                        fontSize: 12,
                        fontWeight: 500,
                        textDecoration: "none",
                        transition: "background 150ms, color 150ms, border-color 150ms",
                    }}
                    className="edit-btn-hover"
                >
                    <Pencil size={11} />
                    {form.status === "draft" ? "Continue Editing" : "Edit"}
                </Link>
            </div>
        </div>
    );
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyState({ onFormCreated }: { onFormCreated: () => void }) {
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "64px 32px",
                background: "#0E0F1A",
                border: "1px dashed rgba(255,255,255,0.1)",
                borderRadius: 16,
                textAlign: "center",
                gap: 16,
            }}
        >
            <div
                style={{
                    width: 72,
                    height: 72,
                    borderRadius: 20,
                    background: "rgba(217,48,37,0.08)",
                    border: "1px solid rgba(217,48,37,0.15)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 4,
                }}
            >
                <FileText size={32} color="#D93025" strokeWidth={1.5} />
            </div>
            <div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: "#FFFFFF", margin: "0 0 8px" }}>
                    No forms yet
                </h3>
                <p style={{ fontSize: 14, color: "#8B8FA8", margin: 0, maxWidth: 320, lineHeight: 1.6 }}>
                    You haven't created any forms yet. Start building your first form to collect responses from your audience.
                </p>
            </div>
            <CreateFormModal onSuccess={onFormCreated}>
                <button
                    className="btn-primary"
                    style={{ marginTop: 4, display: "flex", alignItems: "center", gap: 7 }}
                >
                    <Plus size={15} />
                    Create New Form
                </button>
            </CreateFormModal>
        </div>
    );
}

// ─── Main Dashboard Page ──────────────────────────────────────────────────────

export default function DashboardPage() {
    const router = useRouter();

    // ── Real data hooks (follows the same refetch() pattern used across all dashboard pages) ──
    const { user, isLoading: isUserLoading } = useGetMe();
    const { analytics, isLoading: isAnalyticsLoading, refetch: refetchAnalytics } = useDashboardAnalytics();
    const { forms, isLoading: isFormsLoading, refetch: refetchForms } = useGetAllForms();

    // Callback fired after a new form is created — re-fetches both queries
    const handleFormCreated = () => {
        refetchForms();
        refetchAnalytics();
    };

    // ── Derived values ───────────────────────────────────────────────────────
    const firstName = isUserLoading ? "..." : user?.fullName?.split(" ")[0] || "there";

    // Show only the 5 most recently updated forms
    const recentForms = forms?.slice(0, 5) ?? [];

    // ── Stat card definitions — driven by live analytics data ────────────────
    const statsCards = [
        {
            id: "total",
            label: "Total Forms",
            value: analytics?.totalForms ?? 0,
            icon: FileText,
            color: "#6366f1",
            bgColor: "rgba(99,102,241,0.1)",
        },
        {
            id: "draft",
            label: "Draft Forms",
            value: analytics?.draftForms ?? 0,
            icon: FileEdit,
            color: "#f59e0b",
            bgColor: "rgba(245,158,11,0.1)",
        },
        {
            id: "published",
            label: "Published Forms",
            value: analytics?.activeForms ?? 0,
            icon: Send,
            color: "#10b981",
            bgColor: "rgba(16,185,129,0.1)",
        },
        {
            id: "responses",
            label: "Total Responses",
            value: analytics?.totalResponses ?? 0,
            icon: MessageSquare,
            color: "#D93025",
            bgColor: "rgba(217,48,37,0.1)",
        },
    ];

    // ── Quick actions definition ──────────────────────────────────────────────
    const quickActions = [
        {
            label: "Create Blank Form",
            desc: "Start from scratch",
            icon: Plus,
            color: "#D93025",
            bg: "rgba(217,48,37,0.1)",
            isCreate: true,
            href: null,
        },
        {
            label: "Browse Templates",
            desc: "Ready-made starters",
            icon: LayoutTemplate,
            color: "#6366f1",
            bg: "rgba(99,102,241,0.1)",
            isCreate: false,
            href: "/dashboard/drafts",
        },
        {
            label: "View Analytics",
            desc: "Check your metrics",
            icon: BarChart2,
            color: "#10b981",
            bg: "rgba(16,185,129,0.1)",
            isCreate: false,
            href: "/dashboard/analytics",
        },
        {
            label: "Manage Published",
            desc: "All live forms",
            icon: CheckCircle2,
            color: "#f59e0b",
            bg: "rgba(245,158,11,0.1)",
            isCreate: false,
            href: "/dashboard/published-forms",
        },
    ];

    return (
        <>
            <style>{`
                @keyframes pulse-bg {
                    0%, 100% { opacity: 1; }
                    50%       { opacity: 0.5; }
                }
                .skeleton { animation: pulse-bg 1.6s ease-in-out infinite; }
                .form-card-hover:hover {
                    border-color: rgba(255,255,255,0.14) !important;
                    box-shadow: 0 4px 24px rgba(0,0,0,0.25);
                }
                .more-btn-hover:hover {
                    background: rgba(255,255,255,0.06) !important;
                    color: #8B8FA8 !important;
                }
                .edit-btn-hover:hover {
                    background: rgba(255,255,255,0.08) !important;
                    color: #FFFFFF !important;
                    border-color: rgba(255,255,255,0.15) !important;
                }
                .dropdown-item-hover:hover {
                    background: rgba(255,255,255,0.05) !important;
                    color: #FFFFFF !important;
                }
                .quick-action-btn:hover {
                    background: rgba(255,255,255,0.06) !important;
                }
                .quick-action-btn:hover .qa-arrow {
                    transform: translateX(3px);
                    color: #FFFFFF;
                }
                .qa-arrow { transition: transform 200ms, color 200ms; }
                @media (max-width: 1100px) {
                    .dashboard-main-grid { grid-template-columns: 1fr !important; }
                }
                @media (max-width: 768px) {
                    .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
                    .welcome-actions { flex-direction: column !important; align-items: flex-start !important; }
                }
                @media (max-width: 480px) {
                    .stats-grid { grid-template-columns: 1fr !important; }
                }
            `}</style>

            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

                {/* ── 1. Welcome Section ──────────────────────────────────── */}
                <div
                    style={{
                        background: "#0E0F1A",
                        border: "1px solid rgba(255,255,255,0.07)",
                        borderRadius: 16,
                        padding: "28px 32px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 24,
                        position: "relative",
                        overflow: "hidden",
                    }}
                >
                    {/* Subtle glow */}
                    <div
                        style={{
                            position: "absolute",
                            top: -60, right: -60,
                            width: 220, height: 220,
                            background: "radial-gradient(circle, rgba(217,48,37,0.08) 0%, transparent 70%)",
                            pointerEvents: "none",
                        }}
                    />

                    <div style={{ minWidth: 0 }}>
                        <p style={{ fontSize: 13, color: "#D93025", fontWeight: 600, margin: "0 0 6px", letterSpacing: "0.04em", textTransform: "uppercase" }}>
                            Welcome back
                        </p>
                        <h1 style={{ fontSize: 24, fontWeight: 800, color: "#FFFFFF", margin: "0 0 6px", letterSpacing: "-0.02em" }}>
                            Hey, {firstName} 👋
                        </h1>
                        <p style={{ fontSize: 14, color: "#8B8FA8", margin: 0, lineHeight: 1.5 }}>
                            Build beautiful forms and collect responses effortlessly.
                        </p>
                    </div>

                    <div
                        className="welcome-actions"
                        style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}
                    >
                        <CreateFormModal onSuccess={handleFormCreated}>
                            <button
                                className="btn-primary"
                                style={{ display: "flex", alignItems: "center", gap: 7, whiteSpace: "nowrap" }}
                            >
                                <Plus size={15} />
                                Create New Form
                            </button>
                        </CreateFormModal>

                        <button
                            className="btn-secondary"
                            style={{ display: "flex", alignItems: "center", gap: 7, whiteSpace: "nowrap" }}
                            onClick={() => router.push("/dashboard/drafts")}
                        >
                            <LayoutTemplate size={15} />
                            Browse Templates
                        </button>
                    </div>
                </div>

                {/* ── 2. Statistics Cards ─────────────────────────────────── */}
                <div
                    className="stats-grid"
                    style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}
                >
                    {isAnalyticsLoading
                        ? Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="skeleton"><StatCardSkeleton /></div>
                        ))
                        : statsCards.map((stat) => {
                            const Icon = stat.icon;
                            return (
                                <div
                                    key={stat.id}
                                    style={{
                                        background: "#0E0F1A",
                                        border: "1px solid rgba(255,255,255,0.07)",
                                        borderRadius: 14,
                                        padding: "20px 22px",
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: 12,
                                        transition: "border-color 200ms",
                                    }}
                                    className="form-card-hover"
                                >
                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                        <span style={{ fontSize: 12, fontWeight: 500, color: "#8B8FA8", letterSpacing: "0.02em" }}>
                                            {stat.label}
                                        </span>
                                        <div
                                            style={{
                                                width: 34, height: 34,
                                                borderRadius: 10,
                                                background: stat.bgColor,
                                                display: "flex", alignItems: "center", justifyContent: "center",
                                            }}
                                        >
                                            <Icon size={16} color={stat.color} />
                                        </div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: 32, fontWeight: 800, color: "#FFFFFF", lineHeight: 1, letterSpacing: "-0.03em" }}>
                                            {stat.value}
                                        </div>
                                        <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 6, fontSize: 11, color: "#4A4D65", fontWeight: 500 }}>
                                            <TrendingUp size={11} />
                                            Live data
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    }
                </div>

                {/* ── 3. Recent Forms + Right Column ──────────────────────── */}
                <div
                    className="dashboard-main-grid"
                    style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 20, alignItems: "start" }}
                >
                    {/* Recent Forms */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <h2 style={{ fontSize: 15, fontWeight: 700, color: "#FFFFFF", margin: 0, letterSpacing: "-0.01em" }}>
                                Recent Forms
                            </h2>
                            <Link
                                href="/dashboard/drafts"
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 5,
                                    color: "#8B8FA8",
                                    fontSize: 12,
                                    textDecoration: "none",
                                    transition: "color 150ms",
                                }}
                                className="dropdown-item-hover"
                            >
                                View all <ChevronRight size={12} />
                            </Link>
                        </div>

                        {isFormsLoading ? (
                            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                                {Array.from({ length: 3 }).map((_, i) => (
                                    <div key={i} className="skeleton"><FormCardSkeleton /></div>
                                ))}
                            </div>
                        ) : recentForms.length === 0 ? (
                            <EmptyState onFormCreated={handleFormCreated} />
                        ) : (
                            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                                {recentForms.map((form) => (
                                    <FormCard key={form.id} form={form} />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right Column */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

                        {/* ── 4. Quick Actions ──────────────────────────────── */}
                        <div
                            style={{
                                background: "#0E0F1A",
                                border: "1px solid rgba(255,255,255,0.07)",
                                borderRadius: 14,
                                overflow: "hidden",
                            }}
                        >
                            <div style={{ padding: "16px 20px 12px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                    <Zap size={14} color="#D93025" />
                                    <h3 style={{ fontSize: 13, fontWeight: 700, color: "#FFFFFF", margin: 0, letterSpacing: "-0.01em" }}>
                                        Quick Actions
                                    </h3>
                                </div>
                            </div>

                            <div style={{ padding: "8px 0" }}>
                                {quickActions.map(({ label, desc, icon: Icon, color, bg, isCreate, href }) => {
                                    const inner = (
                                        <div
                                            className="quick-action-btn"
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 12,
                                                padding: "10px 20px",
                                                cursor: "pointer",
                                                transition: "background 150ms",
                                                width: "100%",
                                            }}
                                        >
                                            <div
                                                style={{
                                                    width: 34, height: 34,
                                                    borderRadius: 10,
                                                    background: bg,
                                                    display: "flex", alignItems: "center", justifyContent: "center",
                                                    flexShrink: 0,
                                                }}
                                            >
                                                <Icon size={15} color={color} />
                                            </div>
                                            <div style={{ minWidth: 0, flex: 1 }}>
                                                <div style={{ fontSize: 13, fontWeight: 600, color: "#FFFFFF", lineHeight: 1.3 }}>{label}</div>
                                                <div style={{ fontSize: 11, color: "#4A4D65", marginTop: 1 }}>{desc}</div>
                                            </div>
                                            <ChevronRight size={14} className="qa-arrow" style={{ color: "#4A4D65", flexShrink: 0 }} />
                                        </div>
                                    );

                                    if (isCreate) {
                                        return (
                                            <CreateFormModal key={label} onSuccess={handleFormCreated}>
                                                {inner}
                                            </CreateFormModal>
                                        );
                                    }

                                    return (
                                        <Link
                                            key={label}
                                            href={href!}
                                            style={{ display: "block", textDecoration: "none" }}
                                        >
                                            {inner}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>

                        {/* ── 5. Recent Activity ────────────────────────────── */}
                        <div
                            style={{
                                background: "#0E0F1A",
                                border: "1px solid rgba(255,255,255,0.07)",
                                borderRadius: 14,
                                overflow: "hidden",
                            }}
                        >
                            <div style={{ padding: "16px 20px 12px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                    <Activity size={14} color="#8B8FA8" />
                                    <h3 style={{ fontSize: 13, fontWeight: 700, color: "#FFFFFF", margin: 0, letterSpacing: "-0.01em" }}>
                                        Recent Activity
                                    </h3>
                                </div>
                            </div>

                            <div style={{ padding: "12px 0" }}>
                                {isFormsLoading ? (
                                    <div style={{ display: "flex", justifyContent: "center", padding: "24px 0" }}>
                                        <Loader2 size={20} color="#4A4D65" className="animate-spin" />
                                    </div>
                                ) : recentForms.length === 0 ? (
                                    <p style={{ fontSize: 12, color: "#4A4D65", padding: "16px 20px", margin: 0 }}>
                                        No activity yet.
                                    </p>
                                ) : (
                                    recentForms.map((form, idx) => {
                                        const cfg = statusConfig[form.status];
                                        const actionLabel =
                                            form.status === "active"   ? "was published"  :
                                            form.status === "archived" ? "was archived"   :
                                                                         "draft updated";
                                        const IconComp =
                                            form.status === "active"   ? Send    :
                                            form.status === "archived" ? Archive :
                                                                         FileEdit;
                                        return (
                                            <div key={form.id}>
                                                <div style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "10px 20px" }}>
                                                    <div
                                                        style={{
                                                            width: 30, height: 30,
                                                            borderRadius: 8,
                                                            background: `${cfg.bg}`,
                                                            display: "flex", alignItems: "center", justifyContent: "center",
                                                            flexShrink: 0, marginTop: 1,
                                                        }}
                                                    >
                                                        <IconComp size={13} color={cfg.color} />
                                                    </div>
                                                    <div style={{ minWidth: 0, flex: 1 }}>
                                                        <p style={{ fontSize: 12, color: "#C8CBD8", margin: "0 0 3px", lineHeight: 1.5 }}>
                                                            <strong style={{ color: "#FFFFFF", fontWeight: 600 }}>{form.title}</strong>{" "}
                                                            {actionLabel}
                                                        </p>
                                                        <span style={{ fontSize: 11, color: "#4A4D65" }}>
                                                            {formatDistanceToNow(new Date(form.updatedAt), { addSuffix: true })}
                                                        </span>
                                                    </div>
                                                </div>
                                                {idx < recentForms.length - 1 && (
                                                    <div style={{ height: 1, background: "rgba(255,255,255,0.04)", margin: "0 20px" }} />
                                                )}
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
