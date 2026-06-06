"use client";

import React, { useState } from "react";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { FieldRenderer } from "~/components/form-builder/field-renderer";
import { evaluateLogic } from "~/lib/logic-evaluator";
import { useSubmitResponse } from "~/hooks/response";

interface PublicFormClientProps {
    publishedFormId: string;
    fields: any[];
}

export function PublicFormClient({ publishedFormId, fields }: PublicFormClientProps) {
    const [values, setValues] = useState<Record<string, any>>({});
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitted, setIsSubmitted] = useState(false);
    
    const { submitAsync, isPending, error: submitError } = useSubmitResponse();

    const handleChange = (fieldId: string, value: any) => {
        setValues(prev => ({ ...prev, [fieldId]: value }));
        // Clear error when user types
        if (errors[fieldId]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[fieldId];
                return newErrors;
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const newErrors: Record<string, string> = {};
        
        // Validate required fields (only visible ones)
        visibleFields.forEach(field => {
            if (field.isRequired) {
                const val = values[field.id];
                if (val === undefined || val === null || val === "" || (Array.isArray(val) && val.length === 0)) {
                    newErrors[field.id] = "This field is required";
                }
            }
        });

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            
            // Scroll to first error
            const firstErrorId = Object.keys(newErrors)[0];
            const el = document.getElementById(`field-${firstErrorId}`);
            if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
        }

        try {
            await submitAsync({
                publishedFormId,
                responseData: values
            });
            setIsSubmitted(true);
        } catch (err) {
            console.error("Failed to submit form", err);
        }
    };

    // Filter fields based on logic
    const visibleFields = fields.filter(field => {
        return evaluateLogic(field.config?.logic, values);
    });

    if (isSubmitted) {
        return (
            <div className="flex flex-col items-center justify-center py-10 text-center animate-in fade-in zoom-in duration-500">
                <div className="w-16 h-16 bg-[rgba(80,205,137,0.1)] rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 className="text-[#50CD89]" size={32} />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Thank You!</h2>
                <p className="text-[#8B8FA8]">Your response has been submitted successfully.</p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {submitError && (
                <div className="bg-[rgba(217,48,37,0.1)] border border-[rgba(217,48,37,0.2)] rounded-xl p-4 flex items-start gap-3">
                    <AlertCircle className="text-[#D93025] shrink-0 mt-0.5" size={18} />
                    <div>
                        <h3 className="text-sm font-semibold text-white">Submission Failed</h3>
                        <p className="text-sm text-[#D93025] mt-1">{(submitError as any)?.message || "Something went wrong. Please try again."}</p>
                    </div>
                </div>
            )}

            <div className="space-y-6">
                {visibleFields.map(field => (
                    <div 
                        key={field.id} 
                        id={`field-${field.id}`}
                        className={`bg-[rgba(255,255,255,0.02)] border rounded-xl p-6 transition-colors ${errors[field.id] ? 'border-[#D93025]' : 'border-[rgba(255,255,255,0.05)] hover:border-[rgba(255,255,255,0.1)]'}`}
                    >
                        <FieldRenderer 
                            field={field} 
                            isPreview={true} 
                            isPublic={true}
                            previewValue={values[field.id]} 
                            onPreviewChange={(val: any) => handleChange(field.id, val)} 
                        />
                        {errors[field.id] && (
                            <p className="text-[#D93025] text-xs font-medium mt-3 ml-[28px] animate-in slide-in-from-top-1">
                                {errors[field.id]}
                            </p>
                        )}
                    </div>
                ))}
            </div>

            <div className="pt-4 flex justify-end">
                <button
                    type="submit"
                    disabled={isPending}
                    className="bg-[#D93025] hover:bg-[#b8271e] text-white px-8 py-3 rounded-xl font-medium transition-all shadow-lg shadow-[rgba(217,48,37,0.2)] hover:shadow-[rgba(217,48,37,0.3)] disabled:opacity-70 disabled:pointer-events-none flex items-center justify-center gap-2 min-w-[140px]"
                >
                    {isPending ? (
                        <>
                            <Loader2 className="animate-spin" size={18} />
                            <span>Submitting...</span>
                        </>
                    ) : (
                        <span>Submit Response</span>
                    )}
                </button>
            </div>
        </form>
    );
}
