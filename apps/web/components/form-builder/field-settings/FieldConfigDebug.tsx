import React from "react";
import { FormBuilderField } from "~/stores/formBuilderStore";

interface FieldConfigDebugProps {
    selectedField: FormBuilderField;
}

export function FieldConfigDebug({ selectedField }: FieldConfigDebugProps) {
    if (!selectedField) return null;

    return (
        <div className="p-4 border-t border-[rgba(255,255,255,0.07)] bg-[#0A0B14]">
            <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8B8FA8]">
                    Field Config Debug
                </h4>
            </div>
            <div className="bg-[#131422] rounded-md p-3 overflow-x-auto text-xs text-[#8B8FA8] font-mono border border-[rgba(255,255,255,0.05)]">
                <pre>{JSON.stringify({
                    id: selectedField.id,
                    type: selectedField.type,
                    isRequired: selectedField.isRequired,
                    placeholder: selectedField.placeholder,
                    config: selectedField.config || {}
                }, null, 2)}</pre>
            </div>
        </div>
    );
}
