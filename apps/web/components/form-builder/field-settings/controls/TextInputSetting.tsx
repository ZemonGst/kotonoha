import React from "react";
import { FieldSettingDefinition } from "../registry/field-setting-types";

interface TextInputSettingProps {
    def: FieldSettingDefinition;
    value: any;
    onChange: (val: string) => void;
}

export function TextInputSetting({ def, value, onChange }: TextInputSettingProps) {
    return (
        <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-[#8B8FA8]">{def.label}</label>
            <input 
                type="text"
                className="bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.07)] text-white rounded-md p-2 text-sm focus:outline-none focus:border-[#D93025] focus:ring-1 focus:ring-[#D93025] transition-all w-full placeholder:text-[#4A4D65]"
                placeholder={def.placeholder || ""}
                value={value || ""}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    );
}
