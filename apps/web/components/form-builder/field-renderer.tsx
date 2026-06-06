"use client";

import React from "react";
import { 
    Type, AlignLeft, Hash, Mail, Phone, ChevronDown, Circle, 
    CheckSquare, ToggleLeft, Calendar, Clock, CalendarClock, Lock, Star, GitBranch
} from "lucide-react";

export const fieldTypes = [
    { type: "text", label: "Short Text", icon: Type },
    { type: "textarea", label: "Long Text", icon: AlignLeft },
    { type: "number", label: "Number", icon: Hash },
    { type: "email", label: "Email", icon: Mail },
    { type: "phone", label: "Phone", icon: Phone },
    { type: "select", label: "Select", icon: ChevronDown },
    { type: "radio", label: "Radio", icon: Circle },
    { type: "checkbox", label: "Checkbox", icon: CheckSquare },
    { type: "yes_no", label: "Yes/No", icon: ToggleLeft },
    { type: "date", label: "Date", icon: Calendar },
    { type: "time", label: "Time", icon: Clock },
    { type: "datetime", label: "Date & Time", icon: CalendarClock },
    { type: "password", label: "Password", icon: Lock },
    { type: "rating", label: "Rating", icon: Star },
];

export function FieldRenderer({ field, isPreview, previewValue, onPreviewChange, isPublic = false }: any) {
    const Icon = fieldTypes.find(f => f.type === field.type)?.icon || Type;

    const globalTypography = field.config?.typography || {};
    const globalAppearance = field.config?.appearance || {};
    
    const getTargetStyle = (targetName: string): React.CSSProperties => {
        const targetTypography = { ...globalTypography, ...(globalTypography[targetName] || {}) };
        const targetAppearance = { ...globalAppearance, ...(globalAppearance[targetName] || {}) };

        return {
            fontFamily: targetTypography.fontFamily,
            fontSize: targetTypography.fontSize ? `${targetTypography.fontSize}px` : undefined,
            fontWeight: targetTypography.fontWeight,
            fontStyle: targetTypography.italic ? 'italic' : 'normal',
            textDecoration: targetTypography.underline ? 'underline' : 'none',
            color: targetAppearance.textColor || undefined,
        };
    };

    const labelStyle = getTargetStyle('label');
    const descriptionStyle = getTargetStyle('description');
    const inputStyle = getTargetStyle('input');
    const placeholderStyle = getTargetStyle('placeholder');

    return (
        <div className="select-none flex-1 flex flex-col gap-3 w-full">
            <style>{`
                .preview-input-${field.id}::placeholder {
                    font-family: ${placeholderStyle.fontFamily || 'inherit'} !important;
                    font-size: ${placeholderStyle.fontSize || 'inherit'} !important;
                    font-weight: ${placeholderStyle.fontWeight || 'inherit'} !important;
                    font-style: ${placeholderStyle.fontStyle || 'inherit'} !important;
                    text-decoration: ${placeholderStyle.textDecoration || 'inherit'} !important;
                    color: ${placeholderStyle.color || '#8B8FA8'} !important;
                }
            `}</style>
            <div className="flex flex-col">
                <div className="flex items-center gap-2">
                    {!isPublic && (
                        <div className="select-none w-5 h-5 rounded bg-[rgba(255,255,255,0.05)] flex items-center justify-center text-[#8B8FA8]">
                            <Icon size={12} />
                        </div>
                    )}
                    <p className="select-none text-white text-sm font-medium flex items-center gap-1" style={labelStyle}>
                        {field.label}
                        {field.isRequired && <span className="text-[#D93025]">*</span>}
                    </p>
                    {!isPreview && !isPublic && field.config?.logic?.rules?.length > 0 && (
                        <div className="flex items-center gap-1 bg-[rgba(217,48,37,0.1)] text-[#D93025] px-1.5 py-0.5 rounded text-[10px] ml-2" title="Conditional Logic attached">
                            <GitBranch size={10} />
                            Logic
                        </div>
                    )}
                </div>
                {field.description && <p className={`select-none text-[#8B8FA8] text-xs mt-1.5 ${!isPublic ? 'ml-7' : ''}`} style={descriptionStyle}>{field.description}</p>}
            </div>
            
            <div className={!isPublic ? 'ml-7' : ''}>
                {field.type === 'textarea' ? (
                    <textarea 
                        className={`w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.07)] rounded-md p-3 focus:outline-none resize-none h-20 preview-input-${field.id} ${isPreview ? 'focus:border-[rgba(255,255,255,0.2)] text-white' : 'pointer-events-none'}`}
                        placeholder={field.placeholder || "Placeholder..."}
                        style={inputStyle}
                        readOnly={!isPreview}
                        tabIndex={isPreview ? 0 : -1}
                        value={isPreview ? previewValue || '' : ''}
                        onChange={(e) => isPreview && onPreviewChange(e.target.value)}
                    />
                ) : field.type === 'select' ? (
                    <div 
                        className={`w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.07)] rounded-md p-3 focus:outline-none flex justify-between items-center preview-input-${field.id} ${isPreview ? 'cursor-pointer hover:bg-[rgba(255,255,255,0.06)]' : 'pointer-events-none'}`}
                        style={inputStyle}
                    >
                        {isPreview ? (
                            <select 
                                className="w-full bg-transparent outline-none appearance-none text-white cursor-pointer"
                                value={previewValue || ''}
                                onChange={(e) => onPreviewChange(e.target.value)}
                            >
                                <option value="" disabled className="text-[#8B8FA8] bg-[#131422]">{field.placeholder || "Select option..."}</option>
                                {field.config?.options?.map((opt: any) => (
                                    <option key={opt.value} value={opt.value} className="text-white bg-[#131422]">{opt.label}</option>
                                ))}
                            </select>
                        ) : (
                            <>
                                <span className={!inputStyle.color ? "text-[#8B8FA8]" : "opacity-70"}>{field.placeholder || "Select option..."}</span>
                                <ChevronDown size={16} className={!inputStyle.color ? "text-[#8B8FA8] opacity-50" : "opacity-50"} />
                            </>
                        )}
                    </div>
                ) : field.type === 'radio' ? (
                    <div className={`flex ${field.config?.layout === 'horizontal' ? 'flex-row gap-6' : 'flex-col gap-3'} ${!isPreview && 'pointer-events-none'}`}>
                        {field.config?.options?.length ? field.config.options.map((opt: any) => (
                            <label key={opt.id} className={`flex items-center gap-2 ${isPreview && 'cursor-pointer group'}`}>
                                <input 
                                    type="radio" 
                                    name={`radio-${field.id}`}
                                    value={opt.value}
                                    checked={previewValue === opt.value}
                                    onChange={() => isPreview && onPreviewChange(opt.value)}
                                    className="hidden"
                                    disabled={!isPreview}
                                />
                                <div className={`w-4 h-4 flex items-center justify-center border transition-colors rounded-full ${previewValue === opt.value ? 'border-[#D93025] bg-[rgba(217,48,37,0.1)]' : 'border-[rgba(255,255,255,0.3)] group-hover:border-[rgba(255,255,255,0.5)]'}`}>
                                    {previewValue === opt.value && <div className="w-2 h-2 rounded-full bg-[#D93025]" />}
                                </div>
                                <span style={inputStyle} className={!inputStyle.color ? "text-white group-hover:text-[#A1A5B7] transition-colors" : ""}>{opt.label}</span>
                            </label>
                        )) : (
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded-full border border-[rgba(255,255,255,0.3)]" />
                                <span style={inputStyle} className={!inputStyle.color ? "text-white" : ""}>Option 1</span>
                            </div>
                        )}
                    </div>
                ) : field.type === 'checkbox_group' ? (
                    <div className={`flex flex-col gap-3 ${!isPreview && 'pointer-events-none'}`}>
                        {field.config?.options?.length ? field.config.options.map((opt: any) => {
                            const checkedValues = Array.isArray(previewValue) ? previewValue : [];
                            const isChecked = checkedValues.includes(opt.value);
                            return (
                                <label key={opt.id} className={`flex items-center gap-2 ${isPreview && 'cursor-pointer group'}`}>
                                    <input 
                                        type="checkbox"
                                        checked={isChecked}
                                        onChange={(e) => {
                                            if (!isPreview) return;
                                            if (e.target.checked) {
                                                onPreviewChange([...checkedValues, opt.value]);
                                            } else {
                                                onPreviewChange(checkedValues.filter((v: string) => v !== opt.value));
                                            }
                                        }}
                                        className="hidden"
                                        disabled={!isPreview}
                                    />
                                    <div className={`w-4 h-4 flex items-center justify-center border transition-colors rounded ${isChecked ? 'border-[#D93025] bg-[rgba(217,48,37,0.1)]' : 'border-[rgba(255,255,255,0.3)] group-hover:border-[rgba(255,255,255,0.5)]'}`}>
                                        {isChecked && <CheckSquare size={12} className="text-[#D93025]" />}
                                    </div>
                                    <span style={inputStyle} className={!inputStyle.color ? "text-white group-hover:text-[#A1A5B7] transition-colors" : ""}>{opt.label}</span>
                                </label>
                            );
                        }) : (
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded border border-[rgba(255,255,255,0.3)]" />
                                <span style={inputStyle} className={!inputStyle.color ? "text-white" : ""}>Option 1</span>
                            </div>
                        )}
                    </div>
                ) : field.type === 'checkbox' ? (
                    <label className={`flex items-center gap-2 ${isPreview ? 'cursor-pointer group' : 'pointer-events-none'}`}>
                        <input 
                            type="checkbox"
                            checked={previewValue || false}
                            onChange={(e) => isPreview && onPreviewChange(e.target.checked)}
                            className="hidden"
                            disabled={!isPreview}
                        />
                        <div className={`w-4 h-4 flex items-center justify-center border transition-colors rounded ${(previewValue || false) ? 'border-[#D93025] bg-[rgba(217,48,37,0.1)]' : 'border-[rgba(255,255,255,0.3)] group-hover:border-[rgba(255,255,255,0.5)]'}`}>
                            {(previewValue || false) && <CheckSquare size={12} className="text-[#D93025]" />}
                        </div>
                        <span style={inputStyle} className={!inputStyle.color ? "text-white group-hover:text-[#A1A5B7] transition-colors" : ""}>{field.placeholder || "Check me"}</span>
                    </label>
                ) : field.type === 'yes_no' ? (
                    <div className={`flex ${field.config?.layout === 'horizontal' ? 'flex-row gap-4' : 'flex-col gap-2'} ${!isPreview && 'pointer-events-none'}`}>
                        <label className={`px-4 py-2 rounded-md border flex items-center gap-2 ${isPreview ? 'cursor-pointer transition-colors' : ''} ${previewValue === (field.config?.yesLabel || 'Yes') ? 'border-[#D93025] bg-[rgba(217,48,37,0.1)]' : 'border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.02)]'}`}>
                            <input 
                                type="radio"
                                name={`yesno-${field.id}`}
                                value={field.config?.yesLabel || "Yes"}
                                checked={previewValue === (field.config?.yesLabel || "Yes")}
                                onChange={(e) => isPreview && onPreviewChange(e.target.value)}
                                className="hidden"
                                disabled={!isPreview}
                            />
                            <div className={`w-4 h-4 rounded-full border ${previewValue === (field.config?.yesLabel || 'Yes') ? 'border-[#D93025] border-4' : 'border-[rgba(255,255,255,0.3)]'}`} />
                            <span style={inputStyle} className={previewValue === (field.config?.yesLabel || 'Yes') ? 'text-white' : (!inputStyle.color ? 'text-[#8B8FA8]' : '')}>{field.config?.yesLabel || "Yes"}</span>
                        </label>
                        <label className={`px-4 py-2 rounded-md border flex items-center gap-2 ${isPreview ? 'cursor-pointer transition-colors' : ''} ${previewValue === (field.config?.noLabel || 'No') ? 'border-[#D93025] bg-[rgba(217,48,37,0.1)]' : 'border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.02)]'}`}>
                            <input 
                                type="radio"
                                name={`yesno-${field.id}`}
                                value={field.config?.noLabel || "No"}
                                checked={previewValue === (field.config?.noLabel || "No")}
                                onChange={(e) => isPreview && onPreviewChange(e.target.value)}
                                className="hidden"
                                disabled={!isPreview}
                            />
                            <div className={`w-4 h-4 rounded-full border ${previewValue === (field.config?.noLabel || 'No') ? 'border-[#D93025] border-4' : 'border-[rgba(255,255,255,0.3)]'}`} />
                            <span style={inputStyle} className={previewValue === (field.config?.noLabel || 'No') ? 'text-white' : (!inputStyle.color ? 'text-[#8B8FA8]' : '')}>{field.config?.noLabel || "No"}</span>
                        </label>
                    </div>
                ) : field.type === 'rating' ? (
                    <div className={`flex items-center gap-1 ${!isPreview && 'pointer-events-none'}`}>
                        {Array.from({ length: field.config?.maxStars || 5 }).map((_, i) => {
                            const starValue = i + 1;
                            const isFilled = previewValue ? starValue <= previewValue : false;
                            return (
                                <button
                                    key={i}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        if (isPreview) onPreviewChange(starValue);
                                    }}
                                    className={`p-1 transition-colors ${isPreview ? 'cursor-pointer hover:scale-110' : ''} ${isFilled ? 'text-yellow-400' : 'text-[rgba(255,255,255,0.2)] hover:text-[rgba(255,255,255,0.4)]'}`}
                                >
                                    <Star size={24} fill={isFilled ? 'currentColor' : 'transparent'} />
                                </button>
                            );
                        })}
                    </div>
                ) : (
                    <input 
                        type={field.type === 'password' ? 'password' : 'text'}
                        className={`w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.07)] rounded-md p-3 focus:outline-none preview-input-${field.id} ${isPreview ? 'focus:border-[rgba(255,255,255,0.2)] text-white' : 'pointer-events-none'}`}
                        placeholder={field.placeholder || "Placeholder..."}
                        style={inputStyle}
                        readOnly={!isPreview}
                        tabIndex={isPreview ? 0 : -1}
                        value={isPreview ? previewValue || '' : ''}
                        onChange={(e) => isPreview && onPreviewChange(e.target.value)}
                    />
                )}
            </div>
        </div>
    );
}
