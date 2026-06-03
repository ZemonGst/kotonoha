import React from "react";
import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "~/components/ui/tooltip";
import { cn } from "~/lib/utils";

interface HelpTooltipProps {
    content: React.ReactNode | string;
    className?: string;
}

export function HelpTooltip({ content, className }: HelpTooltipProps) {
    return (
        <Tooltip delayDuration={200}>
            <TooltipTrigger type="button" className={cn("text-[#8B8FA8] hover:text-white transition-colors outline-none cursor-help flex items-center justify-center shrink-0", className)}>
                <Info size={14} />
            </TooltipTrigger>
            <TooltipContent side="top" sideOffset={6} className="max-w-[250px] bg-[#1A1B2D] border border-[rgba(255,255,255,0.1)] text-[#E2E4EB] p-3 text-xs leading-relaxed shadow-xl break-words whitespace-pre-wrap rounded-lg">
                {content}
            </TooltipContent>
        </Tooltip>
    );
}
