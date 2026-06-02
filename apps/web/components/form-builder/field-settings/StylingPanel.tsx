import React, { useState } from "react";
import { FormBuilderField } from "~/stores/formBuilderStore";
import { TypographySection } from "./TypographySection";
import { AppearanceSection } from "./AppearanceSection";
import { StylingTargetSelector } from "./StylingTargetSelector";
import { Accordion } from "~/components/ui/accordion";

interface StylingPanelProps {
    selectedField: FormBuilderField;
}

export function StylingPanel({ selectedField }: StylingPanelProps) {
    const [target, setTarget] = useState("all");

    return (
        <div className="flex-1 p-4 flex flex-col overflow-y-auto">
            <StylingTargetSelector target={target} setTarget={setTarget} />
            <Accordion type="multiple" defaultValue={["typography", "appearance"]} className="w-full">
                <TypographySection selectedField={selectedField} target={target} />
                <AppearanceSection selectedField={selectedField} target={target} />
            </Accordion>
        </div>
    );
}
