"use client";

import React from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { FileEdit, MoreVertical, Send, Loader2, FileIcon, Trash2 } from "lucide-react";
import { useGetAllForms } from "~/hooks/draft";
import { useUpdateFormStatus } from "~/hooks/form";
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuTrigger 
} from "~/components/ui/dropdown-menu";

export default function DraftsPage() {
    const { forms, isLoading, refetch } = useGetAllForms("draft");
    const { updateFormStatus, isPending } = useUpdateFormStatus({
        onSuccess: () => refetch()
    });

    const handlePublish = (formId: string) => {
        updateFormStatus({ formId, status: "active" });
    };

    const handleArchive = (formId: string) => {
        updateFormStatus({ formId, status: "archived" });
    };

    return (
        <div className="page-content" style={{ marginLeft: 0, marginTop: 0 }}>
            <div className="page-header">
                <div className="page-header-left">
                    <h1 className="text-white text-2xl font-bold tracking-tight">Drafts</h1>
                    <p className="text-[#A1A5B7] mt-1">Forms that are currently a work in progress and not yet published.</p>
                </div>
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center py-20">
                    <Loader2 className="animate-spin text-[#D93025]" size={32} />
                </div>
            ) : !forms || forms.length === 0 ? (
                <div className="empty-state border border-dashed border-[rgba(255,255,255,0.07)] rounded-xl">
                    <FileIcon className="empty-state-icon" />
                    <h3>No drafts found</h3>
                    <p>You don't have any drafts yet. Create a new form to get started.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {forms.map(form => (
                        <div 
                            key={form.id} 
                            className="group relative flex flex-col rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#0C0D18] p-5 hover:bg-[#131422] hover:border-[rgba(255,255,255,0.15)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-300"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-10 h-10 rounded-lg bg-[rgba(255,255,255,0.05)] flex items-center justify-center shrink-0 group-hover:bg-[rgba(217,48,37,0.1)] transition-colors">
                                    <FileEdit size={18} className="text-[#A1A5B7] group-hover:text-[#D93025] transition-colors" />
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="bg-[rgba(255,255,255,0.06)] text-[#A1A5B7] text-[10px] font-semibold tracking-wider px-2.5 py-1 rounded-full uppercase border border-[rgba(255,255,255,0.05)]">Draft</span>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <button className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-[rgba(255,255,255,0.08)] text-[#A1A5B7] hover:text-white transition-colors disabled:opacity-50 relative z-10" disabled={isPending}>
                                                <MoreVertical size={16} />
                                            </button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-44 bg-[#131422] border-[rgba(255,255,255,0.1)] rounded-xl shadow-xl p-1">
                                            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handlePublish(form.id); }} className="text-white focus:bg-[rgba(255,255,255,0.06)] rounded-lg cursor-pointer flex items-center gap-2.5 py-2 px-3 transition-colors">
                                                <Send size={15} className="opacity-70" /> 
                                                <span className="font-medium text-sm">Publish Form</span>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleArchive(form.id); }} className="text-[#ff6b6b] focus:bg-[rgba(255,107,107,0.1)] focus:text-[#ff6b6b] rounded-lg cursor-pointer flex items-center gap-2.5 py-2 px-3 mt-1 transition-colors">
                                                <Trash2 size={15} className="opacity-80" /> 
                                                <span className="font-medium text-sm">Archive Form</span>
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </div>
                            
                            <Link href={`/dashboard/form/${form.id}`} className="absolute inset-0 z-0" aria-label={`Edit ${form.title}`} />
                            
                            <div className="flex flex-col flex-1 relative z-0 pointer-events-none">
                                <h3 className="text-base font-semibold text-white mb-2 line-clamp-1 group-hover:text-[#D93025] transition-colors">
                                    {form.title}
                                </h3>
                                <p className="text-sm text-[#A1A5B7] line-clamp-2 mb-5 flex-1 leading-relaxed">
                                    {form.description || "No description provided."}
                                </p>
                                
                                <div className="mt-auto pt-4 border-t border-[rgba(255,255,255,0.06)] flex items-center justify-between text-xs font-medium text-[#8B8FA8]">
                                    <span>Updated {formatDistanceToNow(new Date(form.updatedAt))} ago</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
