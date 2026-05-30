import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function FormBuilderPage({ params }: { params: { formId: string } }) {
    return (
        <div className="flex flex-col h-full w-full">
            {/* Builder Topbar */}
            <div className="builder-topbar">
                <Link href="/dashboard" className="text-muted-foreground hover:text-foreground flex items-center gap-2 text-sm font-medium">
                    <ArrowLeft size={16} />
                    Back
                </Link>
                <input 
                    className="builder-form-title" 
                    placeholder="Form Title" 
                    defaultValue={`Form ${params.formId}`}
                />
                <div className="ml-auto flex items-center gap-2">
                    <button className="btn-secondary">Save Draft</button>
                    <button className="btn-primary">Publish</button>
                </div>
            </div>

            {/* Main Builder Area */}
            <div className="flex flex-1">
                {/* Left Panel */}
                <div className="field-palette">
                    <div className="palette-section-title">Form Elements</div>
                    <div className="palette-item">
                        <span className="palette-item-icon">T</span>
                        Short Text
                    </div>
                    <div className="palette-item">
                        <span className="palette-item-icon">☰</span>
                        Long Text
                    </div>
                    {/* Add more palette items as needed */}
                </div>

                {/* Canvas */}
                <div className="builder-canvas w-full">
                    <div className="canvas-empty">
                        Start building your form by dragging elements here.
                        <br />
                        <span className="text-muted-foreground/70 text-xs mt-2 block">
                            Form ID: {params.formId}
                        </span>
                    </div>
                </div>

                {/* Right Panel */}
                <div className="field-settings">
                    <div className="settings-section">
                        <div className="settings-section-title">Form Settings</div>
                        <div className="settings-field">
                            <span className="settings-label">Description</span>
                            <textarea className="settings-input h-20 py-2 resize-none" placeholder="Form description..." />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
