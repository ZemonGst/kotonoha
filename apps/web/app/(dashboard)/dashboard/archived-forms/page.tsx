"use client";

import React from "react";
import { formatDistanceToNow } from "date-fns";
import { Archive, FileIcon, Loader2 } from "lucide-react";
import { useGetAllForms } from "~/hooks/draft";

export default function ArchivedFormsPage() {
    const { forms, isLoading } = useGetAllForms("archived");

    return (
        <div className="page-content" style={{ marginLeft: 0, marginTop: 0 }}>
            <div className="page-header">
                <div className="page-header-left">
                    <h1 className="text-white text-2xl font-bold tracking-tight">Archived Forms</h1>
                    <p className="text-[#A1A5B7] mt-1">Forms that have been ended or naturally expired.</p>
                </div>
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center py-20">
                    <Loader2 className="animate-spin text-[#D93025]" size={32} />
                </div>
            ) : !forms || forms.length === 0 ? (
                <div className="empty-state border border-dashed border-[rgba(255,255,255,0.07)] rounded-xl">
                    <FileIcon className="empty-state-icon" />
                    <h3>No archived forms</h3>
                    <p>You don't have any archived forms yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {forms.map(form => (
                        <div 
                            key={form.id} 
                            className="group relative flex flex-col rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#0C0D18] p-5 hover:bg-[#131422] hover:border-[rgba(255,255,255,0.15)] transition-all duration-300"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-10 h-10 rounded-lg bg-[rgba(255,255,255,0.05)] flex items-center justify-center shrink-0">
                                    <Archive size={18} className="text-[#A1A5B7]" />
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="bg-[rgba(255,255,255,0.06)] text-[#A1A5B7] text-[10px] font-semibold tracking-wider px-2.5 py-1 rounded-full uppercase border border-[rgba(255,255,255,0.05)]">
                                        Archived
                                    </span>
                                </div>
                            </div>
                            
                            <div className="flex flex-col flex-1">
                                <h3 className="text-base font-semibold text-white mb-2 line-clamp-1 group-hover:text-[#D93025] transition-colors">
                                    {form.title}
                                </h3>
                                <p className="text-sm text-[#A1A5B7] line-clamp-2 mb-5 flex-1 leading-relaxed">
                                    {form.description || "No description provided."}
                                </p>
                                
                                <div className="mt-auto pt-4 border-t border-[rgba(255,255,255,0.06)] flex items-center justify-between text-xs font-medium text-[#8B8FA8]">
                                    <span>Archived {formatDistanceToNow(new Date(form.updatedAt))} ago</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
