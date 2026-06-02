import React from "react";
import { FormBuilderField } from "~/stores/formBuilderStore";
import { useFormBuilderStore } from "~/stores/formBuilderStore";

interface TypographySectionProps {
    selectedField: FormBuilderField;
}

export function TypographySection({ selectedField }: TypographySectionProps) {
    const store = useFormBuilderStore();
    
    // Fallback to empty object if config or typography doesn't exist yet
    const typography = (selectedField.config as any)?.typography || {};

    const updateTypography = (changes: any) => {
        const currentConfig = (selectedField.config as any) || {};
        const currentTypography = currentConfig.typography || {};
        
        store.updateField(selectedField.id, {
            config: {
                ...currentConfig,
                typography: {
                    ...currentTypography,
                    ...changes,
                }
            }
        });
    };

    return (
        <div className="flex flex-col gap-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8B8FA8] border-b border-[rgba(255,255,255,0.07)] pb-2 mb-1">
                Typography
            </h4>
            
            <div className="flex flex-col gap-2">
                <label className="text-xs font-medium text-[#8B8FA8]">Font Family</label>
                <select 
                    className="bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.07)] text-white rounded-md p-2 text-sm focus:outline-none focus:border-[#D93025] focus:ring-1 focus:ring-[#D93025] transition-all"
                    value={typography.fontFamily || "Inter"}
                    onChange={(e) => updateTypography({ fontFamily: e.target.value })}
                >
                    <option value="Inter">Inter</option>
                    <option value="Roboto">Roboto</option>
                    <option value="Outfit">Outfit</option>
                    <option value="system-ui">System Default</option>
                </select>
            </div>

            <div className="flex gap-4">
                <div className="flex flex-col gap-2 flex-1">
                    <label className="text-xs font-medium text-[#8B8FA8]">Size (px)</label>
                    <input 
                        type="number"
                        className="bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.07)] text-white rounded-md p-2 text-sm focus:outline-none focus:border-[#D93025] focus:ring-1 focus:ring-[#D93025] transition-all w-full"
                        value={typography.fontSize || 14}
                        onChange={(e) => updateTypography({ fontSize: parseInt(e.target.value) || 14 })}
                    />
                </div>
                
                <div className="flex flex-col gap-2 flex-1">
                    <label className="text-xs font-medium text-[#8B8FA8]">Weight</label>
                    <select 
                        className="bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.07)] text-white rounded-md p-2 text-sm focus:outline-none focus:border-[#D93025] focus:ring-1 focus:ring-[#D93025] transition-all w-full"
                        value={typography.fontWeight || "normal"}
                        onChange={(e) => updateTypography({ fontWeight: e.target.value })}
                    >
                        <option value="normal">Normal</option>
                        <option value="medium">Medium</option>
                        <option value="semibold">Semibold</option>
                        <option value="bold">Bold</option>
                    </select>
                </div>
            </div>

            <div className="flex gap-4 mt-1">
                <label className="flex items-center gap-2 cursor-pointer group">
                    <div className={`w-8 h-8 rounded flex items-center justify-center border transition-all ${typography.italic ? 'bg-[rgba(217,48,37,0.1)] border-[#D93025] text-[#D93025]' : 'bg-[rgba(255,255,255,0.04)] border-[rgba(255,255,255,0.07)] text-[#8B8FA8] group-hover:text-white'}`}>
                        <span className="italic font-serif">I</span>
                    </div>
                    <input 
                        type="checkbox" 
                        className="hidden"
                        checked={typography.italic || false}
                        onChange={(e) => updateTypography({ italic: e.target.checked })}
                    />
                </label>
                
                <label className="flex items-center gap-2 cursor-pointer group">
                    <div className={`w-8 h-8 rounded flex items-center justify-center border transition-all ${typography.underline ? 'bg-[rgba(217,48,37,0.1)] border-[#D93025] text-[#D93025]' : 'bg-[rgba(255,255,255,0.04)] border-[rgba(255,255,255,0.07)] text-[#8B8FA8] group-hover:text-white'}`}>
                        <span className="underline font-serif">U</span>
                    </div>
                    <input 
                        type="checkbox" 
                        className="hidden"
                        checked={typography.underline || false}
                        onChange={(e) => updateTypography({ underline: e.target.checked })}
                    />
                </label>
            </div>
        </div>
    );
}
