import React from "react";
import { FormBuilderField, useFormBuilderStore } from "~/stores/formBuilderStore";
import { FieldSettingsRegistry } from "../registry/field-settings-registry";
import { FieldSettingDefinition } from "../registry/field-setting-types";
import { TextInputSetting } from "../controls/TextInputSetting";
import { NumberInputSetting } from "../controls/NumberInputSetting";
import { ToggleSetting } from "../controls/ToggleSetting";
import { SelectSetting } from "../controls/SelectSetting";
import { OptionListSetting } from "../controls/OptionListSetting";

interface SettingsTabProps {
    selectedField: FormBuilderField;
}

// Helpers for nested paths
const getValueByPath = (obj: any, path: string) => {
    if (!obj) return undefined;
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
};

const updateValueByPath = (obj: any, path: string, value: any) => {
    const parts = path.split('.');
    const newObj = { ...obj };
    let current = newObj;
    for (let i = 0; i < parts.length - 1; i++) {
        const part = parts[i] as string;
        if (!current[part]) {
            current[part] = {};
        } else {
            current[part] = { ...current[part] };
        }
        current = current[part];
    }
    const lastPart = parts[parts.length - 1] as string;
    current[lastPart] = value;
    return newObj;
};

export function SettingsTab({ selectedField }: SettingsTabProps) {
    const store = useFormBuilderStore();
    const specificSettings = FieldSettingsRegistry[selectedField.type] || [];

    const handleConfigChange = (path: string, value: any) => {
        const currentConfig = selectedField.config || {};
        const newConfig = updateValueByPath(currentConfig, path, value);
        store.updateField(selectedField.id, { config: newConfig });
    };

    const renderControl = (def: FieldSettingDefinition) => {
        const value = getValueByPath(selectedField.config, def.path);

        switch (def.type) {
            case 'text':
                return <TextInputSetting key={def.id} def={def} value={value} onChange={(v) => handleConfigChange(def.path, v)} />;
            case 'number':
                return <NumberInputSetting key={def.id} def={def} value={value} onChange={(v) => handleConfigChange(def.path, v)} />;
            case 'toggle':
                return <ToggleSetting key={def.id} def={def} value={value} onChange={(v) => handleConfigChange(def.path, v)} />;
            case 'select':
                return <SelectSetting key={def.id} def={def} value={value} onChange={(v) => handleConfigChange(def.path, v)} />;
            case 'option-list':
                return <OptionListSetting key={def.id} def={def} value={value} onChange={(v) => handleConfigChange(def.path, v)} />;
            default:
                return null;
        }
    };

    return (
        <div className="flex-1 p-4 flex flex-col gap-6 overflow-y-auto">
            {/* Common Settings */}
            <div className="flex flex-col gap-4">
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
                        className="rounded border-[rgba(255,255,255,0.07)] bg-[rgba(255,255,255,0.04)] text-[#D93025] cursor-pointer"
                    />
                    <label htmlFor="isRequired" className="text-sm text-[#8B8FA8] cursor-pointer hover:text-white transition-colors">Required field</label>
                </div>
            </div>

            {/* Field Specific Settings from Registry */}
            {specificSettings.length > 0 && (
                <div className="flex flex-col gap-4 border-t border-[rgba(255,255,255,0.07)] pt-4">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8B8FA8]">Field Options</h4>
                    {specificSettings.map(renderControl)}
                </div>
            )}
        </div>
    );
}
