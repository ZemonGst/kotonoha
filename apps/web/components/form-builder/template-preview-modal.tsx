"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "~/components/ui/dialog";
import { useGetTemplatePreview, useCloneTemplate } from "~/hooks/default-template";
import { Loader2, ArrowRight, LayoutTemplate, Type, Hash, Mail, Phone, AlignLeft, ChevronDown, Circle, CheckSquare, ToggleLeft, Calendar, Clock, CalendarClock, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface TemplatePreviewModalProps {
    templateId: string | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const getFieldIcon = (type: string) => {
    switch (type) {
        case 'text': return <Type size={14} />;
        case 'textarea': return <AlignLeft size={14} />;
        case 'number': return <Hash size={14} />;
        case 'email': return <Mail size={14} />;
        case 'phone': return <Phone size={14} />;
        case 'select': return <ChevronDown size={14} />;
        case 'radio': return <Circle size={14} />;
        case 'checkbox': return <CheckSquare size={14} />;
        case 'yes_no': return <ToggleLeft size={14} />;
        case 'date': return <Calendar size={14} />;
        case 'time': return <Clock size={14} />;
        case 'datetime': return <CalendarClock size={14} />;
        case 'password': return <Lock size={14} />;
        default: return <Type size={14} />;
    }
};

export function TemplatePreviewModal({ templateId, open, onOpenChange }: TemplatePreviewModalProps) {
    const { previewData, isLoading, isError } = useGetTemplatePreview(templateId);
    const { cloneTemplateAsync, isPending: isCloning } = useCloneTemplate();
    const router = useRouter();

    const handleUseTemplate = async () => {
        if (!templateId) return;
        
        try {
            const result = await cloneTemplateAsync({ templateId });
            toast.success("Template cloned successfully!");
            onOpenChange(false);
            router.push(`/dashboard/form/${result.formId}`);
        } catch (error) {
            toast.error("Failed to clone template. Please try again.");
            console.error("Clone template error:", error);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl p-0 overflow-hidden bg-[#0C0D18] border-[rgba(255,255,255,0.1)] shadow-2xl h-[85vh] flex flex-col sm:flex-row">
                
                {isLoading ? (
                    <div className="flex-1 flex flex-col items-center justify-center">
                        <DialogTitle className="sr-only">Loading template</DialogTitle>
                        <Loader2 className="animate-spin text-[#D93025]" size={32} />
                    </div>
                ) : isError || !previewData ? (
                    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                        <DialogTitle className="sr-only">Error loading template</DialogTitle>
                        <p className="text-[#D93025] mb-2 font-medium">Failed to load template preview</p>
                        <p className="text-[#8B8FA8] text-sm">Please close and try again later.</p>
                    </div>
                ) : (
                    <>
                        {/* Left Sidebar - Template Info & Action */}
                        <div className="w-full sm:w-[320px] bg-[#131422] border-r border-[rgba(255,255,255,0.05)] p-8 flex flex-col">
                            <div className="flex-1">
                                <div className="w-12 h-12 bg-[rgba(255,255,255,0.05)] rounded-xl flex items-center justify-center mb-6">
                                    <LayoutTemplate className="text-[#A1A5B7]" size={24} />
                                </div>
                                <DialogHeader className="p-0 text-left mb-6">
                                    <DialogTitle className="text-2xl font-bold text-white mb-2">
                                        {previewData.template.name}
                                    </DialogTitle>
                                    <div className="inline-block px-2.5 py-1 bg-[rgba(255,255,255,0.06)] rounded-full text-xs font-medium text-[#A1A5B7] border border-[rgba(255,255,255,0.05)] mb-4">
                                        {previewData.template.category || "General"}
                                    </div>
                                    <DialogDescription className="text-[#8B8FA8] leading-relaxed">
                                        {previewData.template.description}
                                    </DialogDescription>
                                </DialogHeader>
                            </div>

                            <div className="mt-8 pt-6 border-t border-[rgba(255,255,255,0.05)]">
                                <button
                                    onClick={handleUseTemplate}
                                    disabled={isCloning}
                                    className="w-full bg-[#D93025] hover:bg-[#b8271e] text-white py-3.5 px-4 rounded-xl font-medium transition-all shadow-lg shadow-[rgba(217,48,37,0.2)] hover:shadow-[rgba(217,48,37,0.3)] flex items-center justify-center gap-2 disabled:opacity-70"
                                >
                                    {isCloning ? (
                                        <>
                                            <Loader2 className="animate-spin" size={18} />
                                            <span>Creating...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>Use this template</span>
                                            <ArrowRight size={18} />
                                        </>
                                    )}
                                </button>
                                <p className="text-center text-[11px] text-[#8B8FA8] mt-4">
                                    Creates a new draft form based on this template
                                </p>
                            </div>
                        </div>

                        {/* Right Area - Form Preview Scroll */}
                        <div className="flex-1 bg-[#080910] overflow-y-auto p-8 relative">
                            {/* Fade effects for scroll */}
                            <div className="sticky top-0 h-4 bg-gradient-to-b from-[#080910] to-transparent z-10 -mt-8 mx-[-2rem] mb-4 pointer-events-none" />
                            
                            <div className="max-w-xl mx-auto space-y-6 pb-20">
                                <div className="mb-10 text-center">
                                    <h2 className="text-xl font-semibold text-white mb-2">{previewData.form.title}</h2>
                                    {previewData.form.description && (
                                        <p className="text-[#8B8FA8] text-sm">{previewData.form.description}</p>
                                    )}
                                </div>

                                {previewData.fields.map((field) => (
                                    <div key={field.id} className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.07)] rounded-xl p-5 hover:border-[rgba(255,255,255,0.12)] transition-colors">
                                        <div className="flex flex-col gap-1.5 mb-4">
                                            <div className="flex items-center gap-2">
                                                <div className="text-[#8B8FA8]">
                                                    {getFieldIcon(field.type)}
                                                </div>
                                                <span className="text-white text-sm font-medium flex items-center gap-1.5">
                                                    {field.label}
                                                    {field.isRequired && <span className="text-[#D93025]">*</span>}
                                                </span>
                                            </div>
                                            {field.description && (
                                                <p className="text-[#8B8FA8] text-xs ml-6">{field.description}</p>
                                            )}
                                        </div>
                                        
                                        <div className="ml-6 opacity-60 pointer-events-none">
                                            {['text', 'number', 'email', 'phone', 'password', 'date', 'time', 'datetime'].includes(field.type) && (
                                                <div className="w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.07)] rounded-md p-3 h-11 text-sm text-[#8B8FA8] flex items-center">
                                                    {field.placeholder || "Enter value..."}
                                                </div>
                                            )}
                                            
                                            {field.type === 'textarea' && (
                                                <div className="w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.07)] rounded-md p-3 h-24 text-sm text-[#8B8FA8]">
                                                    {field.placeholder || "Enter long text..."}
                                                </div>
                                            )}

                                            {field.type === 'select' && (
                                                <div className="w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.07)] rounded-md p-3 h-11 text-sm text-[#8B8FA8] flex items-center justify-between">
                                                    <span>{field.placeholder || "Select option..."}</span>
                                                    <ChevronDown size={16} />
                                                </div>
                                            )}

                                            {(field.type === 'radio' || field.type === 'checkbox_group') && (
                                                <div className="flex flex-col gap-3">
                                                    {((field.config as any)?.options || [{ id: 1, label: 'Option 1' }, { id: 2, label: 'Option 2' }]).slice(0, 3).map((opt: any) => (
                                                        <div key={opt.id} className="flex items-center gap-3">
                                                            <div className={`w-4 h-4 rounded${field.type === 'radio' ? '-full' : ''} border border-[rgba(255,255,255,0.3)]`} />
                                                            <span className="text-sm text-[#8B8FA8]">{opt.label}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {field.type === 'checkbox' && (
                                                <div className="flex items-center gap-3">
                                                    <div className="w-4 h-4 rounded border border-[rgba(255,255,255,0.3)]" />
                                                    <span className="text-sm text-[#8B8FA8]">{field.placeholder || "Check here"}</span>
                                                </div>
                                            )}
                                            
                                            {field.type === 'yes_no' && (
                                                <div className="flex gap-3">
                                                    <div className="px-4 py-2 rounded-md border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.02)] flex items-center gap-2">
                                                        <div className="w-4 h-4 rounded-full border border-[rgba(255,255,255,0.3)]" />
                                                        <span className="text-sm text-[#8B8FA8]">Yes</span>
                                                    </div>
                                                    <div className="px-4 py-2 rounded-md border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.02)] flex items-center gap-2">
                                                        <div className="w-4 h-4 rounded-full border border-[rgba(255,255,255,0.3)]" />
                                                        <span className="text-sm text-[#8B8FA8]">No</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}
