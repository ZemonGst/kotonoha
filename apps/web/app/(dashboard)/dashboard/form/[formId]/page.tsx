"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { 
    ArrowLeft, Loader2, AlertTriangle, Type, AlignLeft, Hash, Mail, 
    Phone, ChevronDown, Circle, CheckSquare, ToggleLeft, Calendar, 
    Clock, CalendarClock, Lock, GripVertical, Trash2 
} from "lucide-react";
import { useGetFormById, useGetFields, useSaveDelta } from "~/hooks/form";
import { useFormBuilderStore } from "~/stores/formBuilderStore";
import { 
    DndContext, DragEndEvent, useDraggable, useDroppable, closestCenter, 
    DragOverlay, useSensor, useSensors, PointerSensor, KeyboardSensor,
    useDndContext
} from "@dnd-kit/core";
import { 
    SortableContext, useSortable, arrayMove, verticalListSortingStrategy, 
    sortableKeyboardCoordinates 
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { SettingsTab, StylingTab, FieldConfigDebug } from "~/components/form-builder/field-settings";

const fieldTypes = [
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
];

function SidebarField({ type, label, icon: Icon }: any) {
    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
        id: `sidebar-${type}`,
        data: { isSidebarField: true, type, label }
    });

    return (
        <div 
            ref={setNodeRef}
            {...attributes}
            {...listeners}
            className={`select-none flex items-center gap-3 p-2 rounded-md hover:bg-[rgba(255,255,255,0.04)] cursor-grab active:cursor-grabbing text-sm text-[#8B8FA8] hover:text-white transition-colors border border-transparent hover:border-[rgba(255,255,255,0.07)] ${isDragging ? 'opacity-50' : ''}`}
        >
            <span className="select-none w-6 h-6 rounded bg-[rgba(255,255,255,0.05)] flex items-center justify-center">
                <Icon size={14} />
            </span>
            <span className="select-none">{label}</span>
        </div>
    );
}

function CanvasField({ field, isSelected, onSelect, onRemove }: any) {
    const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging, isOver } = useSortable({
        id: field.id,
        data: { isCanvasField: true, field }
    });
    
    const { active } = useDndContext();
    const isSidebarFieldDragging = active?.data?.current?.isSidebarField;
    
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 50 : 'auto',
    };
    
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
        <div 
            ref={setNodeRef} 
            style={style} 
            className={`select-none relative group bg-[rgba(255,255,255,0.02)] border ${isSelected ? 'border-[#D93025]' : 'border-[rgba(255,255,255,0.07)]'} rounded-xl p-4 flex gap-4 hover:border-[rgba(255,255,255,0.15)] transition-colors cursor-pointer`}
            onClick={(e) => {
                e.stopPropagation();
                onSelect(field.id);
            }}
        >
            {isOver && isSidebarFieldDragging && (
                <div className="absolute -top-6 left-0 right-0 h-20 rounded-xl border-2 border-[#D93025] border-dashed bg-[#131422] z-20 pointer-events-none flex items-center justify-center opacity-95 shadow-[0_0_20px_rgba(217,48,37,0.15)]">
                    <span className="text-[#D93025] font-medium text-sm tracking-wide">Drop to insert</span>
                </div>
            )}
            <div 
                ref={setActivatorNodeRef}
                {...attributes}
                {...listeners} 
                className="touch-none select-none cursor-grab active:cursor-grabbing text-[#4A4D65] hover:text-white px-1 mt-2"
                onClick={(e) => e.stopPropagation()}
            >
                <GripVertical size={20} />
            </div>
            
            <div className="select-none flex-1 flex flex-col gap-3">
                <style>{`
                    .preview-input-${field.id}::placeholder {
                        font-family: ${placeholderStyle.fontFamily || 'inherit'} !important;
                        font-size: ${placeholderStyle.fontSize || 'inherit'} !important;
                        font-weight: ${placeholderStyle.fontWeight || 'inherit'} !important;
                        font-style: ${placeholderStyle.fontStyle || 'inherit'} !important;
                        text-decoration: ${placeholderStyle.textDecoration || 'inherit'} !important;
                        color: ${placeholderStyle.color || 'inherit'} !important;
                    }
                `}</style>
                <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                        <div className="select-none w-5 h-5 rounded bg-[rgba(255,255,255,0.05)] flex items-center justify-center text-[#8B8FA8]">
                            <Icon size={12} />
                        </div>
                        <p className="select-none text-white text-sm font-medium flex items-center gap-1" style={labelStyle}>
                            {field.label}
                            {field.isRequired && <span className="text-[#D93025]">*</span>}
                        </p>
                    </div>
                    {field.description && <p className="select-none text-[#8B8FA8] text-xs mt-1.5 ml-7" style={descriptionStyle}>{field.description}</p>}
                </div>
                
                <div className="ml-7">
                    {field.type === 'textarea' ? (
                        <textarea 
                            className={`w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.07)] rounded-md p-3 focus:outline-none pointer-events-none resize-none h-20 preview-input-${field.id}`}
                            placeholder={field.placeholder || "Placeholder..."}
                            style={inputStyle}
                            readOnly
                            tabIndex={-1}
                        />
                    ) : field.type === 'select' ? (
                        <div 
                            className={`w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.07)] rounded-md p-3 focus:outline-none pointer-events-none flex justify-between items-center preview-input-${field.id}`}
                            style={inputStyle}
                        >
                            <span className="opacity-70">{field.placeholder || "Select option..."}</span>
                            <ChevronDown size={16} className="opacity-50" />
                        </div>
                    ) : field.type === 'radio' ? (
                        <div className={`flex ${field.config?.layout === 'horizontal' ? 'flex-row gap-6' : 'flex-col gap-3'} pointer-events-none`}>
                            {field.config?.options?.length ? field.config.options.map((opt: any) => (
                                <div key={opt.id} className="flex items-center gap-2">
                                    <div className="w-4 h-4 rounded-full border border-[rgba(255,255,255,0.3)]" />
                                    <span style={inputStyle}>{opt.label}</span>
                                </div>
                            )) : (
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 rounded-full border border-[rgba(255,255,255,0.3)]" />
                                    <span style={inputStyle}>Option 1</span>
                                </div>
                            )}
                        </div>
                    ) : field.type === 'checkbox_group' ? (
                        <div className="flex flex-col gap-3 pointer-events-none">
                            {field.config?.options?.length ? field.config.options.map((opt: any) => (
                                <div key={opt.id} className="flex items-center gap-2">
                                    <div className="w-4 h-4 rounded border border-[rgba(255,255,255,0.3)]" />
                                    <span style={inputStyle}>{opt.label}</span>
                                </div>
                            )) : (
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 rounded border border-[rgba(255,255,255,0.3)]" />
                                    <span style={inputStyle}>Option 1</span>
                                </div>
                            )}
                        </div>
                    ) : field.type === 'checkbox' ? (
                        <div className="flex items-center gap-2 pointer-events-none">
                            <div className={`w-4 h-4 rounded border ${field.config?.validation?.defaultValue ? 'border-[#D93025] bg-[#D93025]' : 'border-[rgba(255,255,255,0.3)]'}`} />
                            <span style={inputStyle}>{field.placeholder || "Check me"}</span>
                        </div>
                    ) : field.type === 'yes_no' ? (
                        <div className={`flex ${field.config?.layout === 'horizontal' ? 'flex-row gap-4' : 'flex-col gap-2'} pointer-events-none`}>
                            <div className="px-4 py-2 rounded-md border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.02)] flex items-center gap-2">
                                <div className="w-4 h-4 rounded-full border border-[rgba(255,255,255,0.3)]" />
                                <span style={inputStyle}>{field.config?.yesLabel || "Yes"}</span>
                            </div>
                            <div className="px-4 py-2 rounded-md border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.02)] flex items-center gap-2">
                                <div className="w-4 h-4 rounded-full border border-[rgba(255,255,255,0.3)]" />
                                <span style={inputStyle}>{field.config?.noLabel || "No"}</span>
                            </div>
                        </div>
                    ) : (
                        <input 
                            type={field.type === 'password' ? 'password' : 'text'}
                            className={`w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.07)] rounded-md p-3 focus:outline-none pointer-events-none preview-input-${field.id}`}
                            placeholder={field.placeholder || "Placeholder..."}
                            style={inputStyle}
                            readOnly
                            tabIndex={-1}
                        />
                    )}
                </div>
            </div>
            
            <button 
                onClick={(e) => {
                    e.stopPropagation();
                    onRemove(field.id);
                }}
                className="select-none opacity-0 group-hover:opacity-100 p-2 text-[#8B8FA8] hover:text-[#D93025] transition-all"
            >
                <Trash2 size={16} />
            </button>
        </div>
    );
}

function BottomDropZone() {
    const { setNodeRef, isOver } = useDroppable({ id: "bottom-dropzone" });
    const { active } = useDndContext();
    const isSidebarFieldDragging = active?.data?.current?.isSidebarField;

    return (
        <div ref={setNodeRef} className="h-24 w-full relative shrink-0 mt-2">
            {isOver && isSidebarFieldDragging && (
                <div className="absolute inset-0 rounded-xl border-2 border-[#D93025] border-dashed bg-[#131422] z-20 pointer-events-none flex items-center justify-center opacity-95 shadow-[0_0_20px_rgba(217,48,37,0.15)]">
                    <span className="text-[#D93025] font-medium text-sm tracking-wide">Drop at end</span>
                </div>
            )}
        </div>
    );
}

function Canvas({ fields, selectedFieldId, onSelect, onRemove }: any) {
    const { setNodeRef, isOver, over } = useDroppable({
        id: "canvas",
    });

    const { active } = useDndContext();
    const isSidebarFieldDragging = active?.data?.current?.isSidebarField;

    const sortedFields = [...fields].sort((a, b) => a.order - b.order);

    return (
        <div 
            ref={setNodeRef}
            className={`flex-1 overflow-y-auto p-8 flex flex-col items-center ${isOver ? 'bg-[rgba(255,255,255,0.02)]' : ''}`}
            onClick={() => onSelect(null)}
        >
            <div className="w-full max-w-3xl flex flex-col gap-6">
                <div className={`min-h-[400px] border-2 border-dashed rounded-xl p-8 flex flex-col gap-4 ${isOver ? 'border-[#D93025] bg-[rgba(217,48,37,0.02)]' : 'border-[rgba(255,255,255,0.07)] bg-[rgba(255,255,255,0.01)]'} transition-colors relative`}>
                    {sortedFields.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center py-20 relative">
                            {isSidebarFieldDragging && isOver ? (
                                <div className="w-full max-w-md h-20 rounded-xl border-2 border-[#D93025] border-dashed bg-[#131422] flex items-center justify-center opacity-95 shadow-[0_0_20px_rgba(217,48,37,0.15)]">
                                    <span className="text-[#D93025] font-medium text-sm tracking-wide">Drop to add first field</span>
                                </div>
                            ) : (
                                <p className="text-[#8B8FA8] mb-2">Drag and drop elements here to build your form</p>
                            )}
                        </div>
                    ) : (
                        <>
                            {sortedFields.map(field => (
                                <CanvasField 
                                    key={field.id} 
                                    field={field} 
                                    isSelected={field.id === selectedFieldId} 
                                    onSelect={onSelect}
                                    onRemove={onRemove}
                                />
                            ))}
                            <BottomDropZone />
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function FormBuilderPage() {
    const params = useParams();
    const formId = params.formId as string;

    const { form, isLoading: isFormLoading, isError, error } = useGetFormById(formId);
    const { fields: initialFields, isLoading: isFieldsLoading } = useGetFields(formId);
    const { saveDeltaAsync } = useSaveDelta();
    
    const store = useFormBuilderStore();
    const [activeId, setActiveId] = React.useState<string | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    useEffect(() => {
        if (form && initialFields !== undefined) {
            const mappedFields = initialFields.map(field => ({
                ...field,
                createdAt: field.createdAt ? new Date(field.createdAt) : undefined,
                updatedAt: field.updatedAt ? new Date(field.updatedAt) : undefined
            }));
            store.initStore(formId, form.title, form.description || "", mappedFields as any, saveDeltaAsync as any);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [form, initialFields, formId, saveDeltaAsync]);

    if (isFormLoading || isFieldsLoading) {
        return (
            <div className="flex h-full w-full items-center justify-center">
                <Loader2 className="animate-spin text-[#D93025]" size={32} />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex flex-col h-full w-full items-center justify-center gap-4 text-center px-4">
                <div className="h-12 w-12 rounded-full bg-[rgba(217,48,37,0.1)] flex items-center justify-center mb-2">
                    <AlertTriangle className="text-[#D93025]" size={24} />
                </div>
                <h2 className="text-xl font-semibold text-white">Form Not Found</h2>
                <p className="text-[#8B8FA8] max-w-md">
                    {error?.message || "The form you are trying to access does not exist or you do not have permission to view it."}
                </p>
                <Link href="/dashboard" className="btn-secondary mt-4">
                    Return to Dashboard
                </Link>
            </div>
        );
    }

    if (!store.formId) {
        return (
            <div className="flex h-full w-full items-center justify-center">
                <Loader2 className="animate-spin text-[#D93025]" size={32} />
            </div>
        );
    }

    const selectedField = store.fields.find(f => f.id === store.selectedFieldId);

    const handleDragStart = (event: any) => {
        setActiveId(event.active.id);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        setActiveId(null);
        const { active, over } = event;
        
        if (!over) return;
        
        if (active.data.current?.isSidebarField) {
            const sortedFields = [...store.fields].sort((a, b) => a.order - b.order);
            const overIndex = sortedFields.findIndex(f => f.id === over.id);
            
            let insertOrder: number;
            
            if (overIndex === -1 || over.id === 'canvas' || over.id === 'bottom-dropzone') {
                // Drop at end
                const last = sortedFields[sortedFields.length - 1];
                insertOrder = last ? last.order + 1.0 : 1.0;
            } else if (overIndex === 0) {
                // Drop at very top
                insertOrder = sortedFields[0]!.order - 1.0;
            } else {
                // Drop between two fields
                const prev = sortedFields[overIndex - 1];
                const curr = sortedFields[overIndex];
                insertOrder = (prev!.order + curr!.order) / 2.0;
            }
            
            store.addField(
                active.data.current.type,
                active.data.current.label,
                insertOrder
            );
            return;
        }

        if (active.data.current?.isCanvasField && active.id !== over.id) {
            const sortedFields = [...store.fields].sort((a, b) => a.order - b.order);
            const activeIndex = sortedFields.findIndex(f => f.id === active.id);
            const overIndex = sortedFields.findIndex(f => f.id === over.id);
            
            if (over.id === "canvas" || over.id === "bottom-dropzone" || overIndex === -1) {
                const lastField = sortedFields[sortedFields.length - 1];
                if (lastField && lastField.id !== active.id) {
                    store.reorderField(active.id as string, lastField.order + 1.0);
                }
                return;
            }

            if (activeIndex === -1) return;

            // Use arrayMove to simulate the new order, then find neighbors!
            const reordered = arrayMove(sortedFields, activeIndex, overIndex);
            const newIndex = reordered.findIndex(f => f.id === active.id);
            
            const prevField = reordered[newIndex - 1];
            const nextField = reordered[newIndex + 1];

            let newOrder: number;

            if (!prevField && nextField) {
                // Moved to the very top
                newOrder = nextField.order - 1.0;
            } else if (!nextField && prevField) {
                // Moved to the very bottom
                newOrder = prevField.order + 1.0;
            } else if (prevField && nextField) {
                // Moved between two fields
                newOrder = (prevField.order + nextField.order) / 2.0;
            } else {
                return;
            }

            store.reorderField(active.id as string, newOrder);
        }
    };

    const activeSidebarItem = activeId?.toString().startsWith('sidebar-') 
        ? fieldTypes.find(f => f.type === activeId.toString().replace('sidebar-', ''))
        : null;

    return (
        <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd} collisionDetection={closestCenter}>
            <SortableContext items={[...store.fields].sort((a, b) => a.order - b.order).map(f => f.id)} strategy={verticalListSortingStrategy}>
                <div className="flex flex-col h-full w-full bg-[#080910]">
                {/* Builder Topbar */}
                <div className="builder-topbar border-b border-[rgba(255,255,255,0.07)] h-14 px-4 flex items-center justify-between bg-[#0E0F1A]">
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard" className="text-[#8B8FA8] hover:text-white transition-colors flex items-center gap-2 text-sm font-medium">
                            <ArrowLeft size={16} />
                            Back
                        </Link>
                        <div className="h-4 w-px bg-[rgba(255,255,255,0.1)] mx-2" />
                        <input 
                            className="bg-transparent border-none text-white font-medium text-sm focus:outline-none placeholder:text-[#4A4D65]" 
                            placeholder="Form Title" 
                            value={store.title}
                            onChange={(e) => store.updateMeta(e.target.value, store.description)}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="flex items-center text-xs mr-2 transition-all">
                            {store.isSaving ? (
                                <span className="text-[#8B8FA8] flex items-center gap-1.5">
                                    <Loader2 className="w-3 h-3 animate-spin" />
                                    Saving...
                                </span>
                            ) : store.isDirty ? (
                                <span className="text-[#8B8FA8]">Unsaved Changes</span>
                            ) : store.lastSavedAt ? (
                                <span className="text-emerald-500">Saved</span>
                            ) : null}
                        </div>
                        <button className="btn-secondary text-sm h-8 px-3" onClick={() => store.tracker?.forceSave()}>Save Draft</button>
                        <button className="btn-primary text-sm h-8 px-3" onClick={() => store.tracker?.forceSave()}>Publish</button>
                    </div>
                </div>

                {/* Main Builder Area */}
                <div className="flex flex-1 overflow-hidden">
                    {/* Left Panel */}
                    <div className="w-64 border-r border-[rgba(255,255,255,0.07)] bg-[#0C0D18] flex flex-col">
                        <div className="p-4 border-b border-[rgba(255,255,255,0.07)]">
                            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#8B8FA8]">Form Elements</h3>
                        </div>
                        <div className="flex-1 p-3 flex flex-col gap-2 overflow-y-auto">
                            {fieldTypes.map(f => (
                                <SidebarField key={f.type} type={f.type} label={f.label} icon={f.icon} />
                            ))}
                        </div>
                    </div>

                    {/* Canvas */}
                    <Canvas 
                        fields={store.fields} 
                        selectedFieldId={store.selectedFieldId}
                        onSelect={store.selectField}
                        onRemove={store.removeField}
                    />

                    {/* Right Panel */}
                    <div className="w-72 border-l border-[rgba(255,255,255,0.07)] bg-[#0C0D18] flex flex-col">
                        <div className="p-4 border-b border-[rgba(255,255,255,0.07)]">
                            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#8B8FA8]">
                                {selectedField ? 'Field Settings' : 'Form Settings'}
                            </h3>
                        </div>
                        
                        {selectedField ? (
                            <Tabs defaultValue="settings" className="flex-1 flex flex-col w-full overflow-hidden mt-2">
                                <div className="px-4">
                                    <TabsList className="w-full bg-[rgba(255,255,255,0.04)] p-1 rounded-md grid grid-cols-2">
                                        <TabsTrigger value="settings" className="text-xs data-[state=active]:bg-[#1A1B2D] data-[state=active]:text-white text-[#8B8FA8] rounded">Settings</TabsTrigger>
                                        <TabsTrigger value="styling" className="text-xs data-[state=active]:bg-[#1A1B2D] data-[state=active]:text-white text-[#8B8FA8] rounded">Styling</TabsTrigger>
                                    </TabsList>
                                </div>
                                <TabsContent value="settings" className="flex-1 flex flex-col m-0 outline-none overflow-hidden data-[state=active]:flex data-[state=inactive]:hidden">
                                    <SettingsTab selectedField={selectedField} />
                                </TabsContent>
                                <TabsContent value="styling" className="flex-1 flex flex-col m-0 outline-none overflow-hidden data-[state=active]:flex data-[state=inactive]:hidden">
                                    <StylingTab selectedField={selectedField} />
                                </TabsContent>
                            </Tabs>
                        ) : (
                            <div className="flex-1 p-4 flex flex-col gap-4 overflow-y-auto">
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-medium text-[#8B8FA8]">Form Title</label>
                                    <input 
                                        className="bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.07)] text-white rounded-md p-3 text-sm focus:outline-none focus:border-[#D93025] focus:ring-1 focus:ring-[#D93025] transition-all" 
                                        placeholder="Title..." 
                                        value={store.title}
                                        onChange={(e) => store.updateMeta(e.target.value, store.description)}
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-medium text-[#8B8FA8]">Description</label>
                                    <textarea 
                                        className="bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.07)] text-white rounded-md p-3 text-sm h-24 resize-none focus:outline-none focus:border-[#D93025] focus:ring-1 focus:ring-[#D93025] transition-all" 
                                        placeholder="Form description..." 
                                        value={store.description || ""}
                                        onChange={(e) => store.updateMeta(store.title, e.target.value)}
                                    />
                                </div>
                            </div>
                        )}
                        {selectedField && <FieldConfigDebug selectedField={selectedField} />}
                    </div>
                </div>
            </div>
                <DragOverlay>
                    {activeSidebarItem ? (
                        <div className="select-none cursor-grabbing flex items-center gap-3 p-2 rounded-md bg-[rgba(255,255,255,0.08)] text-sm text-white border border-[rgba(255,255,255,0.15)] shadow-xl w-60">
                            <span className="select-none w-6 h-6 rounded bg-[rgba(255,255,255,0.05)] flex items-center justify-center">
                                <activeSidebarItem.icon size={14} />
                            </span>
                            <span className="select-none">{activeSidebarItem.label}</span>
                        </div>
                    ) : (() => {
                        const activeCanvasField = activeId && !activeSidebarItem
                            ? store.fields.find(f => f.id === activeId)
                            : null;
                        if (!activeCanvasField) return null;
                        return (
                            <div className="select-none cursor-grabbing bg-[#131422] border border-[rgba(255,255,255,0.15)] rounded-xl p-4 flex items-center gap-4 shadow-2xl opacity-90 w-[700px] ring-1 ring-[rgba(217,48,37,0.3)]">
                                <div className="text-[#4A4D65] px-1"><GripVertical size={20} /></div>
                                <div className="flex-1">
                                    <div className="text-white font-medium mb-1">{activeCanvasField.label}</div>
                                    <div className="text-[#8B8FA8] text-sm flex items-center gap-2">
                                        <span className="capitalize">{activeCanvasField.type}</span>
                                        {activeCanvasField.isRequired && (
                                            <>
                                                <span className="w-1 h-1 rounded-full bg-[rgba(255,255,255,0.2)]" />
                                                <span className="text-[#D93025] font-medium">Required</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })()}
                </DragOverlay>
            </SortableContext>
        </DndContext>
    );
}
