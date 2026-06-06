"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "~/components/ui/dialog";
import { usePublishForm } from "~/hooks/publish";
import { Loader2, Copy, Check, Link as LinkIcon } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

interface PublishModalProps {
    isOpen: boolean;
    onClose: () => void;
    formId: string;
    formTitle: string;
}

export function PublishModal({ isOpen, onClose, formId, formTitle }: PublishModalProps) {
    const { publishAsync, isPending } = usePublishForm();
    const [expirationDate, setExpirationDate] = useState<string>("");
    const [expirationTime, setExpirationTime] = useState<string>("");
    const [publishedUrl, setPublishedUrl] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handlePublish = async () => {
        try {
            setError(null);
            let expiresAt: Date | undefined = undefined;

            if (expirationDate) {
                const dateStr = expirationTime ? `${expirationDate}T${expirationTime}` : `${expirationDate}T23:59:59`;
                expiresAt = new Date(dateStr);
            }

            const result = await publishAsync({ formId, expiresAt });
            
            // Assuming result contains url or publishedFormId
            // The schema says output has { ...publishedForm, url: string }
            if (result && 'url' in result) {
                setPublishedUrl(result.url as string);
            } else {
                // fallback if url is not returned from backend directly but publishedFormId is
                const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
                setPublishedUrl(`${baseUrl}/forms/${(result as any).id}`);
            }
        } catch (err: any) {
            setError(err.message || "Failed to publish form. Please try again.");
        }
    };

    const handleCopy = async () => {
        if (!publishedUrl) return;
        await navigator.clipboard.writeText(publishedUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleResetAndClose = () => {
        setPublishedUrl(null);
        setExpirationDate("");
        setExpirationTime("");
        setError(null);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && handleResetAndClose()}>
            <DialogContent className="sm:max-w-[425px] bg-[#131422] border-[rgba(255,255,255,0.1)] text-white">
                <DialogHeader>
                    <DialogTitle>{publishedUrl ? "Form Published!" : "Publish Form"}</DialogTitle>
                    <DialogDescription className="text-[#8B8FA8]">
                        {publishedUrl 
                            ? "Your form is now live and ready to accept responses." 
                            : `Publishing "${formTitle}". You can set an optional expiration date.`}
                    </DialogDescription>
                </DialogHeader>

                {publishedUrl ? (
                    <div className="flex flex-col gap-4 py-4">
                        <div className="flex items-center justify-center">
                            <div className="bg-white p-4 rounded-xl">
                                <QRCodeSVG value={publishedUrl} size={160} />
                            </div>
                        </div>
                        <div className="flex items-center gap-2 bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.07)] rounded-md p-3">
                            <LinkIcon size={16} className="text-[#8B8FA8] shrink-0" />
                            <input 
                                type="text" 
                                value={publishedUrl} 
                                readOnly 
                                className="bg-transparent border-none outline-none flex-1 text-sm text-white"
                            />
                            <button 
                                onClick={handleCopy}
                                className="p-1.5 hover:bg-[rgba(255,255,255,0.1)] rounded-md transition-colors shrink-0"
                                title="Copy link"
                            >
                                {copied ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} className="text-[#8B8FA8]" />}
                            </button>
                        </div>
                        <div className="flex gap-2">
                            <a 
                                href={publishedUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="btn-secondary flex-1 text-center py-2"
                            >
                                Open Link
                            </a>
                        </div>
                    </div>
                ) : (
                    <div className="grid gap-4 py-4">
                        {error && (
                            <div className="bg-[rgba(217,48,37,0.1)] border border-[rgba(217,48,37,0.2)] text-[#D93025] text-sm p-3 rounded-md">
                                {error}
                            </div>
                        )}
                        <div className="grid gap-2">
                            <label htmlFor="expiration-date" className="text-sm font-medium text-white">
                                Expiration Date (Optional)
                            </label>
                            <input
                                id="expiration-date"
                                type="date"
                                value={expirationDate}
                                onChange={(e) => setExpirationDate(e.target.value)}
                                className="w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.07)] rounded-md p-2.5 text-white focus:outline-none focus:border-[rgba(255,255,255,0.2)] [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert"
                            />
                        </div>
                        {expirationDate && (
                            <div className="grid gap-2">
                                <label htmlFor="expiration-time" className="text-sm font-medium text-white">
                                    Expiration Time (Optional)
                                </label>
                                <input
                                    id="expiration-time"
                                    type="time"
                                    value={expirationTime}
                                    onChange={(e) => setExpirationTime(e.target.value)}
                                    className="w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.07)] rounded-md p-2.5 text-white focus:outline-none focus:border-[rgba(255,255,255,0.2)] [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert"
                                />
                            </div>
                        )}
                    </div>
                )}

                <DialogFooter>
                    {publishedUrl ? (
                        <button onClick={handleResetAndClose} className="btn-primary">
                            Done
                        </button>
                    ) : (
                        <>
                            <button onClick={handleResetAndClose} className="btn-secondary" disabled={isPending}>
                                Cancel
                            </button>
                            <button onClick={handlePublish} className="btn-primary" disabled={isPending}>
                                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Publish
                            </button>
                        </>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
