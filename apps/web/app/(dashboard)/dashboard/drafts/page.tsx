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
                    <h1>Drafts</h1>
                    <p>Forms that are currently a work in progress and not yet published.</p>
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
                <div className="flex flex-col gap-2">
                    {forms.map(form => (
                        <div key={form.id} className="table-row rounded-lg border border-[rgba(255,255,255,0.07)] bg-[#0E0F1A]">
                            <div className="w-10 h-10 rounded-lg bg-[rgba(255,255,255,0.04)] flex items-center justify-center shrink-0">
                                <FileEdit size={18} className="text-[#8B8FA8]" />
                            </div>
                            
                            <div className="flex flex-col flex-1 min-w-0">
                                <Link href={`/dashboard/form/${form.id}`} className="text-white font-medium truncate hover:text-[#D93025] transition-colors">
                                    {form.title}
                                </Link>
                                <span className="text-xs text-[#8B8FA8] truncate mt-1">
                                    Last updated {formatDistanceToNow(new Date(form.updatedAt))} ago
                                </span>
                            </div>

                            <div className="shrink-0 flex items-center gap-4">
                                <span className="badge badge-draft uppercase">Draft</span>
                                
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-[rgba(255,255,255,0.04)] text-[#8B8FA8] transition-colors disabled:opacity-50" disabled={isPending}>
                                            <MoreVertical size={16} />
                                        </button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-40 bg-[#0C0D18] border-[rgba(255,255,255,0.07)]">
                                        <DropdownMenuItem onClick={() => handlePublish(form.id)} className="text-white focus:bg-[rgba(255,255,255,0.04)] cursor-pointer flex items-center gap-2">
                                            <Send size={14} /> Publish Form
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleArchive(form.id)} className="text-[#D93025] focus:bg-[rgba(217,48,37,0.1)] focus:text-[#D93025] cursor-pointer flex items-center gap-2 mt-1">
                                            <Trash2 size={14} /> Archive Form
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
