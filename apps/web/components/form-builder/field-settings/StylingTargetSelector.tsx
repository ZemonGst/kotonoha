import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";

interface StylingTargetSelectorProps {
    target: string;
    setTarget: (val: string) => void;
}

export function StylingTargetSelector({ target, setTarget }: StylingTargetSelectorProps) {
    return (
        <div className="flex flex-col gap-2 mb-4">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#8B8FA8]">Apply Styling To</label>
            <Select value={target} onValueChange={setTarget}>
                <SelectTrigger className="w-full bg-[rgba(255,255,255,0.04)] border-[rgba(255,255,255,0.07)] text-white hover:bg-[rgba(255,255,255,0.08)] cursor-pointer outline-none focus:ring-1 focus:ring-[#D93025] focus:border-[#D93025]">
                    <SelectValue placeholder="Select target..." />
                </SelectTrigger>
                <SelectContent className="bg-[#131422] border-[rgba(255,255,255,0.1)] text-white shadow-xl rounded-md">
                    <SelectItem value="all" className="cursor-pointer hover:bg-[rgba(255,255,255,0.05)] focus:bg-[rgba(255,255,255,0.05)] focus:text-white">All Elements</SelectItem>
                    <SelectItem value="label" className="cursor-pointer hover:bg-[rgba(255,255,255,0.05)] focus:bg-[rgba(255,255,255,0.05)] focus:text-white">Label</SelectItem>
                    <SelectItem value="description" className="cursor-pointer hover:bg-[rgba(255,255,255,0.05)] focus:bg-[rgba(255,255,255,0.05)] focus:text-white">Description</SelectItem>
                    <SelectItem value="placeholder" className="cursor-pointer hover:bg-[rgba(255,255,255,0.05)] focus:bg-[rgba(255,255,255,0.05)] focus:text-white">Placeholder</SelectItem>
                    <SelectItem value="input" className="cursor-pointer hover:bg-[rgba(255,255,255,0.05)] focus:bg-[rgba(255,255,255,0.05)] focus:text-white">Input Text</SelectItem>
                </SelectContent>
            </Select>
        </div>
    );
}
