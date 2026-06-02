import React from "react";
import { FieldSettingDefinition } from "../registry/field-setting-types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";

interface SelectSettingProps {
    def: FieldSettingDefinition;
    value: any;
    onChange: (val: string) => void;
}

export function SelectSetting({ def, value, onChange }: SelectSettingProps) {
    const currentValue = value || def.defaultValue || "";

    return (
        <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-[#8B8FA8]">{def.label}</label>
            <Select value={currentValue} onValueChange={onChange}>
                <SelectTrigger className="w-full bg-[rgba(255,255,255,0.04)] border-[rgba(255,255,255,0.07)] text-white hover:bg-[rgba(255,255,255,0.08)] cursor-pointer outline-none focus:ring-1 focus:ring-[#D93025] focus:border-[#D93025]">
                    <SelectValue placeholder={def.placeholder || "Select option..."} />
                </SelectTrigger>
                <SelectContent className="bg-[#131422] border-[rgba(255,255,255,0.1)] text-white">
                    {def.options?.map((opt) => (
                        <SelectItem 
                            key={opt.value} 
                            value={opt.value} 
                            className="cursor-pointer hover:bg-[rgba(255,255,255,0.05)] focus:bg-[rgba(255,255,255,0.05)] focus:text-white"
                        >
                            {opt.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}
