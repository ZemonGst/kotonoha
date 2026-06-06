"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { formatDistanceToNow, isPast } from "date-fns";
import { MoreVertical, Copy, Archive, FileIcon, Loader2, Link as LinkIcon, Check, Eye } from "lucide-react";
import { useGetAllForms } from "~/hooks/draft";
import { usePublishedForms, useEndPublishedForm } from "~/hooks/publish";
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuTrigger 
} from "~/components/ui/dropdown-menu";
import { 
    AlertDialog, 
    AlertDialogContent, 
    AlertDialogHeader, 
    AlertDialogTitle, 
    AlertDialogDescription, 
    AlertDialogFooter, 
    AlertDialogCancel, 
    AlertDialogAction 
} from "~/components/ui/alert-dialog";

export default function PublishedFormsPage() {
    const { forms: activeForms, isLoading: formsLoading, refetch: refetchForms } = useGetAllForms("active");
    const { forms: publishedForms, isLoading: publishedLoading, refetch: refetchPublished } = usePublishedForms();
    const { endForm, isPending: isEndPending } = useEndPublishedForm();
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [formToEnd, setFormToEnd] = useState<string | null>(null);

    const mergedForms = useMemo(() => {
        if (!activeForms || !publishedForms) return [];
        return activeForms.map(form => {
            const published = publishedForms.find(pf => pf.formId === form.id);
            return {
                ...form,
                publishedFormId: published?.id,
                publishedAt: published?.publishedAt,
                expiresAt: published?.expiresAt,
            };
        }).filter(f => f.publishedFormId); // Only keep those that have a published record
    }, [activeForms, publishedForms]);

    const handleCopyLink = async (publishedFormId: string) => {
        const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
        const url = `${baseUrl}/forms/${publishedFormId}`;
        await navigator.clipboard.writeText(url);
        setCopiedId(publishedFormId);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const confirmEndForm = () => {
        if (!formToEnd) return;
        endForm(
            { formId: formToEnd },
            {
                onSuccess: () => {
                    refetchForms();
                    refetchPublished();
                    setFormToEnd(null);
                },
                onError: () => {
                    setFormToEnd(null);
                }
            }
        );
    };

    const isLoading = formsLoading || publishedLoading;

    return (
        <div>
            <div className="page-header">
                <div className="page-header-left">
                    <h1 className="text-white text-2xl font-bold tracking-tight">Published Forms</h1>
                    <p className="text-[#A1A5B7] mt-1">Live forms that are currently accepting responses.</p>
                </div>
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center py-20">
                    <Loader2 className="animate-spin text-[#D93025]" size={32} />
                </div>
            ) : mergedForms.length === 0 ? (
                <div className="empty-state border border-dashed border-[rgba(255,255,255,0.07)] rounded-xl">
                    <FileIcon className="empty-state-icon" />
                    <h3>No published forms</h3>
                    <p>You don't have any active forms. Publish a draft to start collecting responses.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {mergedForms.map(form => {
                        const isExpired = form.expiresAt ? isPast(new Date(form.expiresAt)) : false;
                        return (
                            <div 
                                key={form.id} 
                                className="group relative flex flex-col rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#0C0D18] p-5 hover:bg-[#131422] hover:border-[rgba(255,255,255,0.15)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-300"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="w-10 h-10 rounded-lg bg-[rgba(217,48,37,0.1)] flex items-center justify-center shrink-0">
                                        <LinkIcon size={18} className="text-[#D93025]" />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={`text-[10px] font-semibold tracking-wider px-2.5 py-1 rounded-full uppercase border ${isExpired ? 'bg-[rgba(255,168,0,0.1)] text-[#FFA800] border-[rgba(255,168,0,0.2)]' : 'bg-[rgba(80,205,137,0.1)] text-[#50CD89] border-[rgba(80,205,137,0.2)]'}`}>
                                            {isExpired ? 'Expired' : 'Active'}
                                        </span>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <button className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-[rgba(255,255,255,0.08)] text-[#A1A5B7] hover:text-white transition-colors disabled:opacity-50 relative z-10" disabled={isEndPending}>
                                                    <MoreVertical size={16} />
                                                </button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-48 bg-[#131422] border-[rgba(255,255,255,0.1)] rounded-xl shadow-xl p-1">
                                                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleCopyLink(form.publishedFormId!); }} className="text-white focus:bg-[rgba(255,255,255,0.06)] rounded-lg cursor-pointer flex items-center gap-2.5 py-2 px-3 transition-colors">
                                                    {copiedId === form.publishedFormId ? <Check size={15} className="text-[#50CD89]" /> : <Copy size={15} className="opacity-70" />}
                                                    <span className="font-medium text-sm">{copiedId === form.publishedFormId ? "Copied!" : "Copy Link"}</span>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem asChild className="text-white focus:bg-[rgba(255,255,255,0.06)] rounded-lg cursor-pointer flex items-center gap-2.5 py-2 px-3 mt-1 transition-colors">
                                                    <a href={`/forms/${form.publishedFormId}`} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                                                        <Eye size={15} className="opacity-70" /> 
                                                        <span className="font-medium text-sm">Open Public Form</span>
                                                    </a>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); setFormToEnd(form.id); }} className="text-[#ff6b6b] focus:bg-[rgba(255,107,107,0.1)] focus:text-[#ff6b6b] rounded-lg cursor-pointer flex items-center gap-2.5 py-2 px-3 mt-1 transition-colors">
                                                    <Archive size={15} className="opacity-80" /> 
                                                    <span className="font-medium text-sm">End Form</span>
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>
                                
                                <Link href={`/dashboard/responses?formId=${form.id}`} className="absolute inset-0 z-0" aria-label={`View responses for ${form.title}`} />
                                
                                <div className="flex flex-col flex-1 relative z-0 pointer-events-none">
                                    <h3 className="text-base font-semibold text-white mb-2 line-clamp-1 group-hover:text-[#D93025] transition-colors">
                                        {form.title}
                                    </h3>
                                    <p className="text-sm text-[#A1A5B7] line-clamp-2 mb-5 flex-1 leading-relaxed">
                                        {form.description || "No description provided."}
                                    </p>
                                    
                                    <div className="mt-auto pt-4 border-t border-[rgba(255,255,255,0.06)] flex flex-col gap-1.5 text-xs font-medium text-[#8B8FA8]">
                                        <span>Published {form.publishedAt ? formatDistanceToNow(new Date(form.publishedAt)) : ''} ago</span>
                                        {form.expiresAt && (
                                            <span className={isExpired ? "text-[#FFA800]" : ""}>
                                                Expires: {new Date(form.expiresAt).toLocaleDateString()}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            <AlertDialog open={!!formToEnd} onOpenChange={(open) => !open && setFormToEnd(null)}>
                <AlertDialogContent className="bg-[#131422] border border-[rgba(255,255,255,0.1)] text-white">
                    <AlertDialogHeader>
                        <AlertDialogTitle>End Form</AlertDialogTitle>
                        <AlertDialogDescription className="text-[#8B8FA8]">
                            Are you sure you want to end this form? It will be archived and no longer accept responses.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isEndPending} className="bg-[rgba(255,255,255,0.05)] text-white hover:bg-[rgba(255,255,255,0.1)] hover:text-white border-none">Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                            onClick={(e) => {
                                e.preventDefault();
                                confirmEndForm();
                            }}
                            disabled={isEndPending}
                            className="bg-[#D93025] hover:bg-[#D93025]/90 text-white border-none"
                        >
                            {isEndPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                            End Form
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
