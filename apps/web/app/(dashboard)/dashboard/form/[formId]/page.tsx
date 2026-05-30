"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Loader2, AlertTriangle } from "lucide-react";
import { useGetFormById } from "~/hooks/form";

export default function FormBuilderPage() {
    const params = useParams();
    const formId = params.formId as string;

    const { form, isLoading, isError, error } = useGetFormById(formId);

    if (isLoading) {
        return (
            <div className="flex h-full w-full items-center justify-center">
                <Loader2 className="animate-spin text-[#D93025]" size={32} />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex flex-col h-full w-full items-center justify-center gap-4 text-center px-4">
                <div className="h-12 w-12 rounded-full bg-[rgba(217,48,37,0.1)] flex items-center justify-center mb-2">
                    <AlertTriangle className="text-[#D93025]" size={24} />
                </div>
                <h2 className="text-xl font-semibold text-white">Form Not Found</h2>
                <p className="text-[#8B8FA8] max-w-md">
                    {error?.message || "The form you are trying to access does not exist or you do not have permission to view it."}
                </p>
                <Link href="/dashboard" className="btn-secondary mt-4">
                    Return to Dashboard
                </Link>
            </div>
        );
    }

    if (!form) return null;

    return (
        <div className="flex flex-col h-full w-full bg-[#080910]">
            {/* Builder Topbar */}
            <div className="builder-topbar border-b border-[rgba(255,255,255,0.07)] h-14 px-4 flex items-center justify-between bg-[#0E0F1A]">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard" className="text-[#8B8FA8] hover:text-white transition-colors flex items-center gap-2 text-sm font-medium">
                        <ArrowLeft size={16} />
                        Back
                    </Link>
                    <div className="h-4 w-px bg-[rgba(255,255,255,0.1)] mx-2" />
                    <input 
                        className="bg-transparent border-none text-white font-medium text-sm focus:outline-none placeholder:text-[#4A4D65]" 
                        placeholder="Form Title" 
                        defaultValue={form.title}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <button className="btn-secondary text-sm h-8 px-3">Save Draft</button>
                    <button className="btn-primary text-sm h-8 px-3">Publish</button>
                </div>
            </div>

            {/* Main Builder Area */}
            <div className="flex flex-1 overflow-hidden">
                {/* Left Panel */}
                <div className="w-64 border-r border-[rgba(255,255,255,0.07)] bg-[#0C0D18] flex flex-col">
                    <div className="p-4 border-b border-[rgba(255,255,255,0.07)]">
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-[#8B8FA8]">Form Elements</h3>
                    </div>
                    <div className="p-3 flex flex-col gap-2 overflow-y-auto">
                        <div className="flex items-center gap-3 p-2 rounded-md hover:bg-[rgba(255,255,255,0.04)] cursor-grab text-sm text-[#8B8FA8] hover:text-white transition-colors border border-transparent hover:border-[rgba(255,255,255,0.07)]">
                            <span className="w-6 h-6 rounded bg-[rgba(255,255,255,0.05)] flex items-center justify-center text-xs font-serif">T</span>
                            Short Text
                        </div>
                        <div className="flex items-center gap-3 p-2 rounded-md hover:bg-[rgba(255,255,255,0.04)] cursor-grab text-sm text-[#8B8FA8] hover:text-white transition-colors border border-transparent hover:border-[rgba(255,255,255,0.07)]">
                            <span className="w-6 h-6 rounded bg-[rgba(255,255,255,0.05)] flex items-center justify-center text-xs">☰</span>
                            Long Text
                        </div>
                    </div>
                </div>

                {/* Canvas */}
                <div className="flex-1 overflow-y-auto p-8 flex flex-col items-center">
                    <div className="w-full max-w-3xl flex flex-col gap-6">
                        
                        {/* Form Header on Canvas */}
                        <div className="bg-[#0E0F1A] border border-[rgba(255,255,255,0.07)] rounded-xl p-8 shadow-sm">
                            <h1 className="text-3xl font-bold text-white mb-3">{form.title}</h1>
                            {form.description && (
                                <p className="text-[#8B8FA8] leading-relaxed">{form.description}</p>
                            )}
                        </div>
                        
                        {/* Empty Builder Canvas */}
                        <div className="border-2 border-dashed border-[rgba(255,255,255,0.07)] rounded-xl p-16 text-center flex flex-col items-center justify-center bg-[rgba(255,255,255,0.01)]">
                            <p className="text-[#8B8FA8] mb-2">Drag and drop elements here to build your form</p>
                            <span className="text-[#4A4D65] text-xs font-mono">
                                ID: {formId}
                            </span>
                        </div>
                        
                    </div>
                </div>

                {/* Right Panel */}
                <div className="w-72 border-l border-[rgba(255,255,255,0.07)] bg-[#0C0D18] flex flex-col">
                    <div className="p-4 border-b border-[rgba(255,255,255,0.07)]">
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-[#8B8FA8]">Form Settings</h3>
                    </div>
                    <div className="p-4 flex flex-col gap-4 overflow-y-auto">
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-medium text-[#8B8FA8]">Description</label>
                            <textarea 
                                className="bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.07)] text-white rounded-md p-3 text-sm h-24 resize-none focus:outline-none focus:border-[#D93025] focus:ring-1 focus:ring-[#D93025] transition-all" 
                                placeholder="Form description..." 
                                defaultValue={form.description || ""}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
