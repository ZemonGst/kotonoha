import React from "react";
import { FieldSettingDefinition } from "../registry/field-setting-types";

interface ToggleSettingProps {
    def: FieldSettingDefinition;
    value: any;
    onChange: (val: boolean) => void;
}

export function ToggleSetting({ def, value, onChange }: ToggleSettingProps) {
    const isChecked = value === true || (value === undefined && def.defaultValue === true);
    
    return (
        <div className="flex items-center gap-2">
            <input 
                type="checkbox" 
                id={`toggle-${def.id}`}
                checked={isChecked}
                onChange={(e) => onChange(e.target.checked)}
                className="rounded border-[rgba(255,255,255,0.07)] bg-[rgba(255,255,255,0.04)] text-[#D93025]"
            />
            <label htmlFor={`toggle-${def.id}`} className="text-sm text-[#8B8FA8] cursor-pointer hover:text-white transition-colors">{def.label}</label>
        </div>
    );
}
