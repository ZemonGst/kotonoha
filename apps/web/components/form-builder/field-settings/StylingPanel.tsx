import React from "react";
import { FormBuilderField } from "~/stores/formBuilderStore";
import { TypographySection } from "./TypographySection";
import { AppearanceSection } from "./AppearanceSection";

interface StylingPanelProps {
    selectedField: FormBuilderField;
}

export function StylingPanel({ selectedField }: StylingPanelProps) {
    return (
        <div className="flex-1 p-4 flex flex-col overflow-y-auto">
            <TypographySection selectedField={selectedField} />
            <AppearanceSection selectedField={selectedField} />
        </div>
    );
}
