import React from "react";
import { FieldSettingDefinition } from "../registry/field-setting-types";

interface NumberInputSettingProps {
    def: FieldSettingDefinition;
    value: any;
    onChange: (val: number | undefined) => void;
}

export function NumberInputSetting({ def, value, onChange }: NumberInputSettingProps) {
    return (
        <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-[#8B8FA8]">{def.label}</label>
            <input 
                type="number"
                className="bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.07)] text-white rounded-md p-2 text-sm focus:outline-none focus:border-[#D93025] focus:ring-1 focus:ring-[#D93025] transition-all w-full placeholder:text-[#4A4D65]"
                placeholder={def.placeholder || ""}
                value={value ?? ""}
                onChange={(e) => {
                    const val = e.target.value;
                    onChange(val === "" ? undefined : Number(val));
                }}
            />
        </div>
    );
}
