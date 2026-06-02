import React from "react";
import { FormBuilderField } from "~/stores/formBuilderStore";
import { useFormBuilderStore } from "~/stores/formBuilderStore";
import { AccordionItem, AccordionTrigger, AccordionContent } from "~/components/ui/accordion";

interface AppearanceSectionProps {
    selectedField: FormBuilderField;
    target: string;
}

export function AppearanceSection({ selectedField, target }: AppearanceSectionProps) {
    const store = useFormBuilderStore();
    
    const globalAppearance = (selectedField.config as any)?.appearance || {};
    const targetAppearance = target === 'all' ? globalAppearance : (globalAppearance[target] || {});

    const updateAppearance = (changes: any) => {
        const currentConfig = (selectedField.config as any) || {};
        const currentGlobalAppearance = currentConfig.appearance || {};
        
        let newAppearance = { ...currentGlobalAppearance };
        
        if (target === 'all') {
            newAppearance = { ...currentGlobalAppearance, ...changes };
        } else {
            const currentTargetAppearance = currentGlobalAppearance[target] || {};
            newAppearance[target] = { ...currentTargetAppearance, ...changes };
        }
        
        store.updateField(selectedField.id, {
            config: {
                ...currentConfig,
                appearance: newAppearance
            }
        });
    };
    return (
        <AccordionItem value="appearance" className="border-b-[rgba(255,255,255,0.07)] border-b pb-1 mb-2 last:border-b-0">
            <AccordionTrigger className="text-xs font-semibold uppercase tracking-wider text-[#8B8FA8] hover:text-white hover:no-underline py-2">
                Appearance
            </AccordionTrigger>
            <AccordionContent className="pt-2 pb-4">
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-medium text-[#8B8FA8]">Text Color</label>
                        <div className="flex gap-3 items-center">
                            <input 
                                type="color"
                                className="w-8 h-8 rounded cursor-pointer bg-transparent border-0 p-0"
                                value={targetAppearance.textColor || "#ffffff"}
                                onChange={(e) => updateAppearance({ textColor: e.target.value })}
                            />
                            <input 
                                type="text"
                                className="flex-1 bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.07)] text-white rounded-md p-2 text-sm focus:outline-none focus:border-[#D93025] focus:ring-1 focus:ring-[#D93025] transition-all uppercase cursor-text"
                                value={targetAppearance.textColor || "#ffffff"}
                                onChange={(e) => updateAppearance({ textColor: e.target.value })}
                                placeholder="#FFFFFF"
                            />
                        </div>
                    </div>
                </div>
            </AccordionContent>
        </AccordionItem>
    );
}
