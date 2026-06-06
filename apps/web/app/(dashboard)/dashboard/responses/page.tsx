"use client";

import React, { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { Loader2, MessageSquare, Inbox, Calendar } from "lucide-react";
import { useGetAllForms } from "~/hooks/draft";
import { usePublishedForms } from "~/hooks/publish";
import { useGetResponsesByPublishedForm } from "~/hooks/response";
import { useGetFields } from "~/hooks/form";

function ResponsesContent() {
    const searchParams = useSearchParams();
    const defaultFormId = searchParams.get("formId");

    const { forms: activeForms } = useGetAllForms("active");
    const { forms: archivedForms } = useGetAllForms("archived");
    const { forms: publishedForms, isLoading: publishedLoading } = usePublishedForms();

    const [selectedPublishedFormId, setSelectedPublishedFormId] = useState<string | null>(null);

    const mergedForms = useMemo(() => {
        if (!publishedForms) return [];
        const allBaseForms = [...(activeForms || []), ...(archivedForms || [])];
        return publishedForms.map(pf => {
            const baseForm = allBaseForms.find(f => f.id === pf.formId);
            return {
                ...pf,
                title: baseForm?.title || "Unknown Form",
                description: baseForm?.description || "",
                status: baseForm?.status || "unknown"
            };
        });
    }, [publishedForms, activeForms, archivedForms]);

    // Set default selected form if provided in URL
    useEffect(() => {
        if (defaultFormId && mergedForms.length > 0 && !selectedPublishedFormId) {
            const target = mergedForms.find(f => f.formId === defaultFormId);
            if (target) {
                setSelectedPublishedFormId(target.id);
            }
        } else if (!selectedPublishedFormId && mergedForms.length > 0) {
            setSelectedPublishedFormId(mergedForms[0]!.id);
        }
    }, [defaultFormId, mergedForms, selectedPublishedFormId]);

    const { responses, isLoading: responsesLoading } = useGetResponsesByPublishedForm(
        selectedPublishedFormId || "",
        !!selectedPublishedFormId
    );

    const selectedFormDetails = mergedForms.find(f => f.id === selectedPublishedFormId);

    // Also fetch fields for the base form so we know the labels for the responseData
    const { fields } = useGetFields(selectedFormDetails?.formId || "");

    const fieldMap = useMemo(() => {
        if (!fields) return {};
        const map: Record<string, string> = {};
        fields.forEach(f => {
            map[f.id] = f.label;
        });
        return map;
    }, [fields]);

    const renderResponseValue = (value: unknown) => {
        if (value === null || value === undefined) return <span className="text-[#A1A5B7] italic">Empty</span>;
        if (Array.isArray(value)) return value.join(", ");
        if (typeof value === "boolean") return value ? "Yes" : "No";
        if (typeof value === "object") return JSON.stringify(value);
        return String(value);
    };

    return (
        <div className="flex flex-col h-[calc(100vh-60px-64px)]">
            <div className="page-header mb-8 shrink-0">
                <div className="page-header-left">
                    <h1 className="text-white text-2xl font-bold tracking-tight">Responses</h1>
                    <p className="text-[#A1A5B7] mt-1">View submissions for your published forms.</p>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
                {/* Sidebar with forms list */}
                <div className="w-full lg:w-80 flex flex-col bg-[#0C0D18] border border-[rgba(255,255,255,0.08)] rounded-xl overflow-hidden shrink-0">
                    <div className="p-4 border-b border-[rgba(255,255,255,0.08)]">
                        <h2 className="text-sm font-semibold uppercase tracking-wider text-[#8B8FA8]">Select Form</h2>
                    </div>
                    <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-1">
                        {publishedLoading ? (
                            <div className="flex justify-center p-4">
                                <Loader2 className="animate-spin text-[#D93025]" size={20} />
                            </div>
                        ) : mergedForms.length === 0 ? (
                            <div className="p-4 text-center text-[#A1A5B7] text-sm">
                                No published forms available.
                            </div>
                        ) : (
                            mergedForms.map(form => (
                                <button
                                    key={form.id}
                                    onClick={() => setSelectedPublishedFormId(form.id)}
                                    className={`text-left p-3 rounded-lg transition-colors flex flex-col gap-1 ${selectedPublishedFormId === form.id ? 'bg-[rgba(217,48,37,0.1)] border border-[rgba(217,48,37,0.2)]' : 'hover:bg-[rgba(255,255,255,0.04)] border border-transparent'}`}
                                >
                                    <span className={`font-medium text-sm line-clamp-1 ${selectedPublishedFormId === form.id ? 'text-white' : 'text-[#A1A5B7]'}`}>
                                        {form.title}
                                    </span>
                                    <div className="flex items-center gap-2 text-xs text-[#8B8FA8]">
                                        <span className={`px-1.5 py-0.5 rounded text-[10px] uppercase font-semibold ${form.status === 'active' ? 'bg-[rgba(80,205,137,0.1)] text-[#50CD89]' : 'bg-[rgba(255,255,255,0.05)] text-[#A1A5B7]'}`}>
                                            {form.status}
                                        </span>
                                    </div>
                                </button>
                            ))
                        )}
                    </div>
                </div>

                {/* Main responses area */}
                <div className="flex-1 flex flex-col bg-[#0C0D18] border border-[rgba(255,255,255,0.08)] rounded-xl overflow-hidden">
                    {selectedPublishedFormId ? (
                        <>
                            <div className="p-5 border-b border-[rgba(255,255,255,0.08)] flex justify-between items-center">
                                <div>
                                    <h2 className="text-lg font-semibold text-white">{selectedFormDetails?.title}</h2>
                                    <p className="text-sm text-[#A1A5B7] mt-1 flex items-center gap-2">
                                        <MessageSquare size={14} />
                                        {responses?.length || 0} Responses
                                    </p>
                                </div>
                            </div>
                            
                            <div className="flex-1 overflow-y-auto p-5">
                                {responsesLoading ? (
                                    <div className="flex justify-center items-center h-full">
                                        <Loader2 className="animate-spin text-[#D93025]" size={32} />
                                    </div>
                                ) : !responses || responses.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-full text-[#A1A5B7]">
                                        <Inbox size={48} className="mb-4 opacity-20" />
                                        <p>No responses yet for this form.</p>
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-4">
                                        {responses.map((response, index) => (
                                            <div key={response.id} className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] rounded-lg p-5">
                                                <div className="flex items-center justify-between mb-4 pb-3 border-b border-[rgba(255,255,255,0.05)]">
                                                    <span className="font-semibold text-white">Submission #{responses.length - index}</span>
                                                    <span className="text-xs text-[#8B8FA8] flex items-center gap-1.5">
                                                        <Calendar size={12} />
                                                        {new Date(response.submittedAt).toLocaleString()}
                                                    </span>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                                                    {Object.entries(response.responseData as Record<string, unknown>).map(([fieldId, value]) => (
                                                        <div key={fieldId} className="flex flex-col gap-1">
                                                            <span className="text-xs font-medium text-[#8B8FA8] uppercase tracking-wider">
                                                                {fieldMap[fieldId] || `Field ${fieldId.substring(0, 8)}...`}
                                                            </span>
                                                            <span className="text-sm text-white bg-[rgba(255,255,255,0.03)] px-3 py-2 rounded">
                                                                {renderResponseValue(value)}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-[#A1A5B7]">
                            <MessageSquare size={48} className="mb-4 opacity-20" />
                            <p>Select a form to view its responses.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function ResponsesPage() {
    return (
        <React.Suspense fallback={
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="animate-spin text-[#D93025]" size={32} />
            </div>
        }>
            <ResponsesContent />
        </React.Suspense>
    );
}
