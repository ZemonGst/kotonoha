import React from "react";
import { FormBuilderField } from "~/stores/formBuilderStore";
import { useFormBuilderStore } from "~/stores/formBuilderStore";

interface BasicSettingsPanelProps {
    selectedField: FormBuilderField;
}

export function BasicSettingsPanel({ selectedField }: BasicSettingsPanelProps) {
    const store = useFormBuilderStore();

    return (
        <div className="flex-1 p-4 flex flex-col gap-4 overflow-y-auto">
            <div className="flex flex-col gap-2">
                <label className="text-xs font-medium text-[#8B8FA8]">Field Label</label>
                <input 
                    className="bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.07)] text-white rounded-md p-3 text-sm focus:outline-none focus:border-[#D93025] focus:ring-1 focus:ring-[#D93025] transition-all" 
                    placeholder="Label..." 
                    value={selectedField.label}
                    onChange={(e) => store.updateField(selectedField.id, { label: e.target.value })}
                />
            </div>
            <div className="flex flex-col gap-2">
                <label className="text-xs font-medium text-[#8B8FA8]">Description</label>
                <textarea 
                    className="bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.07)] text-white rounded-md p-3 text-sm h-24 resize-none focus:outline-none focus:border-[#D93025] focus:ring-1 focus:ring-[#D93025] transition-all" 
                    placeholder="Field description..." 
                    value={selectedField.description || ""}
                    onChange={(e) => store.updateField(selectedField.id, { description: e.target.value })}
                />
            </div>
            <div className="flex flex-col gap-2">
                <label className="text-xs font-medium text-[#8B8FA8]">Placeholder</label>
                <input 
                    className="bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.07)] text-white rounded-md p-3 text-sm focus:outline-none focus:border-[#D93025] focus:ring-1 focus:ring-[#D93025] transition-all" 
                    placeholder="Placeholder text..." 
                    value={selectedField.placeholder || ""}
                    onChange={(e) => store.updateField(selectedField.id, { placeholder: e.target.value })}
                />
            </div>
            <div className="flex items-center gap-2 mt-2">
                <input 
                    type="checkbox" 
                    id="isRequired"
                    checked={selectedField.isRequired || false}
                    onChange={(e) => store.updateField(selectedField.id, { isRequired: e.target.checked })}
                    className="rounded border-[rgba(255,255,255,0.07)] bg-[rgba(255,255,255,0.04)] text-[#D93025]"
                />
                <label htmlFor="isRequired" className="text-sm text-[#8B8FA8]">Required field</label>
            </div>
        </div>
    );
}
