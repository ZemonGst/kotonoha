import React from "react";
import { AccordionItem, AccordionTrigger, AccordionContent } from "~/components/ui/accordion";

interface SectionProps {
    id: string;
    title: string;
    children: React.ReactNode;
}

export function Section({ id, title, children }: SectionProps) {
    return (
        <AccordionItem value={id} className="border-b-[rgba(255,255,255,0.07)] border-b pb-1 mb-2 last:border-b-0">
            <AccordionTrigger className="text-xs font-semibold uppercase tracking-wider text-[#8B8FA8] hover:text-white hover:no-underline py-2">
                {title}
            </AccordionTrigger>
            <AccordionContent className="pt-2 pb-4">
                <div className="flex flex-col gap-4">
                    {children}
                </div>
            </AccordionContent>
        </AccordionItem>
    );
}
