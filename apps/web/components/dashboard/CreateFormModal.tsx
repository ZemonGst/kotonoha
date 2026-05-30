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

export function CreateFormModal({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const { createFormAsync, isPending } = useCreateForm();
    const router = useRouter();

    const handleCreate = async () => {
        if (!title.trim()) return;
        
        try {
            const form = await createFormAsync({
                title: title.trim(),
                description: description.trim() || undefined,
            });
            
            setOpen(false);
            setTitle("");
            setDescription("");
            
            // Redirect to the form builder page
            router.push(`/dashboard/form/${form.id}`);
        } catch (error) {
            console.error("Failed to create form", error);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create new form</DialogTitle>
                    <DialogDescription>
                        Give your form a title and an optional description to get started.
                    </DialogDescription>
                </DialogHeader>
                
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <label htmlFor="title" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Title <span className="text-destructive">*</span>
                        </label>
                        <Input
                            id="title"
                            placeholder="e.g., Customer Feedback Survey"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>
                    <div className="grid gap-2">
                        <label htmlFor="description" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Description (Optional)
                        </label>
                        <Textarea
                            id="description"
                            placeholder="Describe what this form is for..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>
                </div>
                
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)} disabled={isPending}>
                        Cancel
                    </Button>
                    <Button onClick={handleCreate} disabled={!title.trim() || isPending}>
                        {isPending ? "Creating..." : "Next"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
