import React from "react";
import { FormBuilderField } from "~/stores/formBuilderStore";
import { useFormBuilderStore } from "~/stores/formBuilderStore";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { AccordionItem, AccordionTrigger, AccordionContent } from "~/components/ui/accordion";

interface TypographySectionProps {
    selectedField: FormBuilderField;
    target: string;
}

export function TypographySection({ selectedField, target }: TypographySectionProps) {
    const store = useFormBuilderStore();
    
    // Read typography from target, or fallback to 'all', or empty
    const globalTypography = (selectedField.config as any)?.typography || {};
    const targetTypography = target === 'all' ? globalTypography : (globalTypography[target] || {});

    const updateTypography = (changes: any) => {
        const currentConfig = (selectedField.config as any) || {};
        const currentGlobalTypography = currentConfig.typography || {};
        
        let newTypography = { ...currentGlobalTypography };
        
        if (target === 'all') {
            newTypography = { ...currentGlobalTypography, ...changes };
        } else {
            const currentTargetTypography = currentGlobalTypography[target] || {};
            newTypography[target] = { ...currentTargetTypography, ...changes };
        }
        
        store.updateField(selectedField.id, {
            config: {
                ...currentConfig,
                typography: newTypography
            }
        });
    };
    return (
        <AccordionItem value="typography" className="border-b-[rgba(255,255,255,0.07)] border-b pb-1 mb-2 last:border-b-0">
            <AccordionTrigger className="text-xs font-semibold uppercase tracking-wider text-[#8B8FA8] hover:text-white hover:no-underline py-2">
                Typography
            </AccordionTrigger>
            <AccordionContent className="pt-2 pb-4">
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-medium text-[#8B8FA8]">Font Family</label>
                        <Select 
                            value={targetTypography.fontFamily || "Inter"}
                            onValueChange={(val) => updateTypography({ fontFamily: val })}
                        >
                            <SelectTrigger className="w-full bg-[rgba(255,255,255,0.04)] border-[rgba(255,255,255,0.07)] text-white hover:bg-[rgba(255,255,255,0.08)] cursor-pointer outline-none focus:ring-1 focus:ring-[#D93025] focus:border-[#D93025]">
                                <SelectValue placeholder="Select font..." />
                            </SelectTrigger>
                            <SelectContent className="bg-[#131422] border-[rgba(255,255,255,0.1)] text-white">
                                <SelectItem value="Inter" className="cursor-pointer hover:bg-[rgba(255,255,255,0.05)] focus:bg-[rgba(255,255,255,0.05)] focus:text-white">Inter</SelectItem>
                                <SelectItem value="Roboto" className="cursor-pointer hover:bg-[rgba(255,255,255,0.05)] focus:bg-[rgba(255,255,255,0.05)] focus:text-white">Roboto</SelectItem>
                                <SelectItem value="Outfit" className="cursor-pointer hover:bg-[rgba(255,255,255,0.05)] focus:bg-[rgba(255,255,255,0.05)] focus:text-white">Outfit</SelectItem>
                                <SelectItem value="system-ui" className="cursor-pointer hover:bg-[rgba(255,255,255,0.05)] focus:bg-[rgba(255,255,255,0.05)] focus:text-white">System Default</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex gap-4">
                        <div className="flex flex-col gap-2 flex-1">
                            <label className="text-xs font-medium text-[#8B8FA8]">Size (px)</label>
                            <input 
                                type="number"
                                className="bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.07)] text-white rounded-md p-2 text-sm focus:outline-none focus:border-[#D93025] focus:ring-1 focus:ring-[#D93025] transition-all w-full placeholder:text-[#4A4D65] cursor-text"
                                placeholder="14"
                                value={targetTypography.fontSize || ""}
                                onChange={(e) => updateTypography({ fontSize: parseInt(e.target.value) || undefined })}
                            />
                        </div>
                        
                        <div className="flex flex-col gap-2 flex-1">
                            <label className="text-xs font-medium text-[#8B8FA8]">Weight</label>
                            <Select 
                                value={targetTypography.fontWeight || "normal"}
                                onValueChange={(val) => updateTypography({ fontWeight: val })}
                            >
                                <SelectTrigger className="w-full bg-[rgba(255,255,255,0.04)] border-[rgba(255,255,255,0.07)] text-white hover:bg-[rgba(255,255,255,0.08)] cursor-pointer outline-none focus:ring-1 focus:ring-[#D93025] focus:border-[#D93025]">
                                    <SelectValue placeholder="Weight..." />
                                </SelectTrigger>
                                <SelectContent className="bg-[#131422] border-[rgba(255,255,255,0.1)] text-white">
                                    <SelectItem value="normal" className="cursor-pointer hover:bg-[rgba(255,255,255,0.05)] focus:bg-[rgba(255,255,255,0.05)] focus:text-white">Normal</SelectItem>
                                    <SelectItem value="medium" className="cursor-pointer hover:bg-[rgba(255,255,255,0.05)] focus:bg-[rgba(255,255,255,0.05)] focus:text-white">Medium</SelectItem>
                                    <SelectItem value="semibold" className="cursor-pointer hover:bg-[rgba(255,255,255,0.05)] focus:bg-[rgba(255,255,255,0.05)] focus:text-white">Semibold</SelectItem>
                                    <SelectItem value="bold" className="cursor-pointer hover:bg-[rgba(255,255,255,0.05)] focus:bg-[rgba(255,255,255,0.05)] focus:text-white">Bold</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="flex gap-4 mt-1">
                        <label className="flex items-center gap-2 cursor-pointer group">
                            <div className={`w-8 h-8 rounded flex items-center justify-center border transition-all ${targetTypography.italic ? 'bg-[rgba(217,48,37,0.1)] border-[#D93025] text-[#D93025]' : 'bg-[rgba(255,255,255,0.04)] border-[rgba(255,255,255,0.07)] text-[#8B8FA8] group-hover:text-white hover:bg-[rgba(255,255,255,0.08)]'}`}>
                                <span className="italic font-serif">I</span>
                            </div>
                            <input 
                                type="checkbox" 
                                className="hidden"
                                checked={targetTypography.italic || false}
                                onChange={(e) => updateTypography({ italic: e.target.checked })}
                            />
                        </label>
                        
                        <label className="flex items-center gap-2 cursor-pointer group">
                            <div className={`w-8 h-8 rounded flex items-center justify-center border transition-all ${targetTypography.underline ? 'bg-[rgba(217,48,37,0.1)] border-[#D93025] text-[#D93025]' : 'bg-[rgba(255,255,255,0.04)] border-[rgba(255,255,255,0.07)] text-[#8B8FA8] group-hover:text-white hover:bg-[rgba(255,255,255,0.08)]'}`}>
                                <span className="underline font-serif">U</span>
                            </div>
                            <input 
                                type="checkbox" 
                                className="hidden"
                                checked={targetTypography.underline || false}
                                onChange={(e) => updateTypography({ underline: e.target.checked })}
                            />
                        </label>
                    </div>
                </div>
            </AccordionContent>
        </AccordionItem>
    );
}
