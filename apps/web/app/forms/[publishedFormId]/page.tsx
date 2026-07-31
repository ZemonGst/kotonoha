"use client";

import React, { useEffect } from "react";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useGetPublicFormWithFields } from "~/hooks/publish";
import { PublicFormClient } from "./public-form-client";

export default function PublicFormPage() {
    const params = useParams();
    const publishedFormId = params.publishedFormId as string;

    const { form, isLoading, isError } = useGetPublicFormWithFields(publishedFormId);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#080910] flex items-center justify-center p-4">
                <Loader2 className="animate-spin text-[#D93025]" size={32} />
            </div>
        );
    }

    if (isError || !form) {
        return (
            <div className="min-h-screen bg-[#080910] flex items-center justify-center p-4">
                <div className="bg-[#131422] border border-[rgba(255,255,255,0.08)] p-8 rounded-2xl max-w-md w-full text-center">
                    <h1 className="text-xl font-bold text-white mb-2">Form Not Found</h1>
                    <p className="text-[#8B8FA8]">This form does not exist or the link is invalid.</p>
                </div>
            </div>
        );
    }

    if (form.expiresAt && new Date(form.expiresAt) < new Date()) {
        return (
            <div className="min-h-screen bg-[#080910] flex items-center justify-center p-4">
                <div className="bg-[#131422] border border-[rgba(255,255,255,0.08)] p-8 rounded-2xl max-w-md w-full text-center">
                    <h1 className="text-xl font-bold text-white mb-2">Form Expired</h1>
                    <p className="text-[#8B8FA8]">This form is no longer accepting responses because it has expired.</p>
                </div>
            </div>
        );
    }

    if (form.status !== "active") {
        return (
            <div className="min-h-screen bg-[#080910] flex items-center justify-center p-4">
                <div className="bg-[#131422] border border-[rgba(255,255,255,0.08)] p-8 rounded-2xl max-w-md w-full text-center">
                    <h1 className="text-xl font-bold text-white mb-2">Form Unavailable</h1>
                    <p className="text-[#8B8FA8]">This form is currently not active and cannot accept responses.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#080910] py-6 sm:py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-2xl mx-auto">
                <div className="bg-[#131422] border border-[rgba(255,255,255,0.08)] rounded-2xl shadow-2xl overflow-hidden">
                    <div className="p-6 sm:p-10 border-b border-[rgba(255,255,255,0.05)]">
                        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3">{form.title}</h1>
                        {form.description && (
                            <p className="text-[#8B8FA8] leading-relaxed">{form.description}</p>
                        )}
                    </div>
                    
                    <div className="p-6 sm:p-10">
                        <PublicFormClient 
                            publishedFormId={publishedFormId}
                            fields={form.fields as any[]} 
                        />
                    </div>
                </div>
                
                <div className="mt-8 text-center">
                    <p className="text-xs text-[#4A4D65]">Powered by <span className="font-semibold text-[#8B8FA8]">Kotonoha</span></p>
                </div>
            </div>
        </div>
    );
}
