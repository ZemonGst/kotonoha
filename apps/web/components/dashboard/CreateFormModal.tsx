"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCreateForm } from "~/hooks/form";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Button } from "~/components/ui/button";

export function CreateFormModal({
    children,
    onSuccess: onSuccessCallback,
}: {
    children: React.ReactNode;
    onSuccess?: () => void;
}) {
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const router = useRouter();

    const { createForm, isPending } = useCreateForm({
        onSuccess: (form) => {
            setOpen(false);
            setTitle("");
            setDescription("");

            // Notify parent so it can refresh its data (e.g. invalidate queries)
            onSuccessCallback?.();

            // Redirect to the form builder page
            router.push(`/dashboard/form/${form.id}`);
        }
    });

    const handleCreate = () => {
        if (!title.trim()) return;
        
        createForm({
            title: title.trim(),
            description: description.trim() || undefined,
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-[#0E0F1A] border-[rgba(255,255,255,0.07)] text-white">
                <DialogHeader>
                    <DialogTitle className="text-white">Create new form</DialogTitle>
                    <DialogDescription className="text-[#8B8FA8]">
                        Give your form a title and an optional description to get started.
                    </DialogDescription>
                </DialogHeader>
                
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <label htmlFor="title" className="text-sm font-medium leading-none text-[#8B8FA8]">
                            Title <span className="text-[#D93025]">*</span>
                        </label>
                        <Input
                            id="title"
                            placeholder="e.g., Customer Feedback Survey"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="bg-[rgba(255,255,255,0.04)] border-[rgba(255,255,255,0.07)] text-white focus-visible:border-[#D93025] focus-visible:ring-1 focus-visible:ring-[#D93025]"
                        />
                    </div>
                    <div className="grid gap-2">
                        <label htmlFor="description" className="text-sm font-medium leading-none text-[#8B8FA8]">
                            Description (Optional)
                        </label>
                        <Textarea
                            id="description"
                            placeholder="Describe what this form is for..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="bg-[rgba(255,255,255,0.04)] border-[rgba(255,255,255,0.07)] text-white focus-visible:border-[#D93025] focus-visible:ring-1 focus-visible:ring-[#D93025]"
                        />
                    </div>
                </div>
                
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)} disabled={isPending} className="border-[rgba(255,255,255,0.07)] text-[#8B8FA8] hover:bg-[rgba(255,255,255,0.04)] hover:text-white bg-transparent">
                        Cancel
                    </Button>
                    <Button onClick={handleCreate} disabled={!title.trim() || isPending} className="bg-[#D93025] text-white hover:bg-[#E8352A]">
                        {isPending ? "Creating..." : "Next"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
