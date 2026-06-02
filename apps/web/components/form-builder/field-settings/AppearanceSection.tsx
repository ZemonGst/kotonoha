import React from "react";
import { FormBuilderField } from "~/stores/formBuilderStore";
import { useFormBuilderStore } from "~/stores/formBuilderStore";

interface AppearanceSectionProps {
    selectedField: FormBuilderField;
}

export function AppearanceSection({ selectedField }: AppearanceSectionProps) {
    const store = useFormBuilderStore();
    
    const appearance = (selectedField.config as any)?.appearance || {};

    const updateAppearance = (changes: any) => {
        const currentConfig = (selectedField.config as any) || {};
        const currentAppearance = currentConfig.appearance || {};
        
        store.updateField(selectedField.id, {
            config: {
                ...currentConfig,
                appearance: {
                    ...currentAppearance,
                    ...changes,
                }
            }
        });
    };

    return (
        <div className="flex flex-col gap-4 mt-6">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8B8FA8] border-b border-[rgba(255,255,255,0.07)] pb-2 mb-1">
                Appearance
            </h4>
            
            <div className="flex flex-col gap-2">
                <label className="text-xs font-medium text-[#8B8FA8]">Text Color</label>
                <div className="flex gap-3 items-center">
                    <input 
                        type="color"
                        className="w-8 h-8 rounded cursor-pointer bg-transparent border-0 p-0"
                        value={appearance.textColor || "#ffffff"}
                        onChange={(e) => updateAppearance({ textColor: e.target.value })}
                    />
                    <input 
                        type="text"
                        className="flex-1 bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.07)] text-white rounded-md p-2 text-sm focus:outline-none focus:border-[#D93025] focus:ring-1 focus:ring-[#D93025] transition-all uppercase"
                        value={appearance.textColor || "#ffffff"}
                        onChange={(e) => updateAppearance({ textColor: e.target.value })}
                        placeholder="#FFFFFF"
                    />
                </div>
            </div>
        </div>
    );
}
