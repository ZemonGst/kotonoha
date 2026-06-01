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
    DragOverlay, useSensor, useSensors, PointerSensor, KeyboardSensor 
} from "@dnd-kit/core";
import { 
    SortableContext, useSortable, arrayMove, verticalListSortingStrategy, 
    sortableKeyboardCoordinates 
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

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
            className={`flex items-center gap-3 p-2 rounded-md hover:bg-[rgba(255,255,255,0.04)] cursor-grab text-sm text-[#8B8FA8] hover:text-white transition-colors border border-transparent hover:border-[rgba(255,255,255,0.07)] ${isDragging ? 'opacity-50' : ''}`}
        >
            <span className="w-6 h-6 rounded bg-[rgba(255,255,255,0.05)] flex items-center justify-center">
                <Icon size={14} />
            </span>
            {label}
        </div>
    );
}

function CanvasField({ field, isSelected, onSelect, onRemove }: any) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: field.id,
        data: { isCanvasField: true, field }
    });
    
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };
    
    const Icon = fieldTypes.find(f => f.type === field.type)?.icon || Type;

    return (
        <div 
            ref={setNodeRef} 
            style={style} 
            className={`relative group bg-[rgba(255,255,255,0.02)] border ${isSelected ? 'border-[#D93025]' : 'border-[rgba(255,255,255,0.07)]'} rounded-xl p-4 flex items-center gap-4 hover:border-[rgba(255,255,255,0.15)] transition-colors cursor-pointer`}
            onClick={(e) => {
                e.stopPropagation();
                onSelect(field.id);
            }}
        >
            <div 
                {...attributes} 
                {...listeners} 
                className="cursor-grab text-[#4A4D65] hover:text-white px-1"
            >
                <GripVertical size={20} />
            </div>
            
            <div className="w-8 h-8 rounded bg-[rgba(255,255,255,0.05)] flex items-center justify-center text-[#8B8FA8]">
                <Icon size={16} />
            </div>
            
            <div className="flex-1">
                <p className="text-white text-sm font-medium">{field.label}</p>
                {field.description && <p className="text-[#8B8FA8] text-xs mt-1">{field.description}</p>}
                {!field.description && <p className="text-[#4A4D65] text-xs mt-1 italic">No description</p>}
            </div>
            
            <button 
                onClick={(e) => {
                    e.stopPropagation();
                    onRemove(field.id);
                }}
                className="opacity-0 group-hover:opacity-100 p-2 text-[#8B8FA8] hover:text-[#D93025] transition-all"
            >
                <Trash2 size={16} />
            </button>
        </div>
    );
}

function Canvas({ fields, selectedFieldId, onSelect, onRemove }: any) {
    const { setNodeRef, isOver } = useDroppable({
        id: "canvas",
    });

    const sortedFields = [...fields].sort((a, b) => a.order - b.order);

    return (
        <div 
            ref={setNodeRef}
            className={`flex-1 overflow-y-auto p-8 flex flex-col items-center ${isOver ? 'bg-[rgba(255,255,255,0.02)]' : ''}`}
            onClick={() => onSelect(null)}
        >
            <div className="w-full max-w-3xl flex flex-col gap-6">
                <div className={`min-h-[400px] border-2 border-dashed rounded-xl p-8 flex flex-col gap-4 ${isOver ? 'border-[#D93025] bg-[rgba(217,48,37,0.02)]' : 'border-[rgba(255,255,255,0.07)] bg-[rgba(255,255,255,0.01)]'} transition-colors`}>
                    {sortedFields.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center py-20">
                            <p className="text-[#8B8FA8] mb-2">Drag and drop elements here to build your form</p>
                        </div>
                    ) : (
                        <SortableContext items={sortedFields.map(f => f.id)} strategy={verticalListSortingStrategy}>
                            {sortedFields.map(field => (
                                <CanvasField 
                                    key={field.id} 
                                    field={field} 
                                    isSelected={field.id === selectedFieldId} 
                                    onSelect={onSelect}
                                    onRemove={onRemove}
                                />
                            ))}
                        </SortableContext>
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
            store.addField(active.data.current.type);
            return;
        }

        if (active.data.current?.isCanvasField && active.id !== over.id) {
            const sortedFields = [...store.fields].sort((a, b) => a.order - b.order);
            const activeIndex = sortedFields.findIndex(f => f.id === active.id);
            
            if (activeIndex === -1) return;

            let overIndex = sortedFields.findIndex(f => f.id === over.id);
            if (over.id === "canvas") {
                overIndex = sortedFields.length - 1;
            }
            
            if (overIndex !== -1) {
                const reordered = arrayMove(sortedFields, activeIndex, overIndex);
                const newIndexInReordered = reordered.findIndex(f => f.id === active.id);
                
                let newOrder = 0;
                if (newIndexInReordered === 0) {
                    newOrder = reordered.length > 1 ? reordered[1]!.order - 1.0 : 1.0;
                } else if (newIndexInReordered === reordered.length - 1) {
                    newOrder = reordered[reordered.length - 2]!.order + 1.0;
                } else {
                    newOrder = (reordered[newIndexInReordered - 1]!.order + reordered[newIndexInReordered + 1]!.order) / 2.0;
                }
                
                store.reorderField(active.id as string, newOrder);
            }
        }
    };

    const activeSidebarItem = activeId?.toString().startsWith('sidebar-') 
        ? fieldTypes.find(f => f.type === activeId.toString().replace('sidebar-', ''))
        : null;

    return (
        <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd} collisionDetection={closestCenter}>
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
                        {store.isDirty && <span className="text-xs text-[#8B8FA8] mr-2">Unsaved changes...</span>}
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
                            <div className="flex-1 p-4 flex flex-col gap-4 overflow-y-auto">
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-medium text-[#8B8FA8]">Field Label</label>
                                    <input 
                                        className="bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.07)] text-white rounded-md p-3 text-sm focus:outline-none focus:border-[#D93025] focus:ring-1 focus:ring-[#D93025] transition-all" 
                                        placeholder="Label..." 
                                        value={selectedField.label}
                                        onChange={(e) => store.updateField(selectedField.id, { label: e.target.value })}
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-medium text-[#8B8FA8]">Description</label>
                                    <textarea 
                                        className="bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.07)] text-white rounded-md p-3 text-sm h-24 resize-none focus:outline-none focus:border-[#D93025] focus:ring-1 focus:ring-[#D93025] transition-all" 
                                        placeholder="Field description..." 
                                        value={selectedField.description || ""}
                                        onChange={(e) => store.updateField(selectedField.id, { description: e.target.value })}
                                    />
                                </div>
                                <div className="flex items-center gap-2 mt-2">
                                    <input 
                                        type="checkbox" 
                                        id="isRequired"
                                        checked={selectedField.isRequired || false}
                                        onChange={(e) => store.updateField(selectedField.id, { isRequired: e.target.checked })}
                                        className="rounded border-[rgba(255,255,255,0.07)] bg-[rgba(255,255,255,0.04)] text-[#D93025]"
                                    />
                                    <label htmlFor="isRequired" className="text-sm text-[#8B8FA8]">Required field</label>
                                </div>
                            </div>
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
                    </div>
                </div>
            </div>
            <DragOverlay>
                {activeSidebarItem ? (
                    <div className="flex items-center gap-3 p-2 rounded-md bg-[rgba(255,255,255,0.08)] text-sm text-white border border-[rgba(255,255,255,0.15)] shadow-xl w-60">
                        <span className="w-6 h-6 rounded bg-[rgba(255,255,255,0.05)] flex items-center justify-center">
                            <activeSidebarItem.icon size={14} />
                        </span>
                        {activeSidebarItem.label}
                    </div>
                ) : null}
            </DragOverlay>
        </DndContext>
    );
}
