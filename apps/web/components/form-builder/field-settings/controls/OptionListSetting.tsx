import React from "react";
import { FieldSettingDefinition } from "../registry/field-setting-types";
import { Plus, X, GripVertical } from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface OptionListSettingProps {
    def: FieldSettingDefinition;
    value: any[];
    onChange: (val: any[]) => void;
}

// Ensure the option list always exists as an array
function getValidOptions(val: any): any[] {
    if (Array.isArray(val)) return val;
    return [{ id: 'opt_1', label: 'Option 1', value: 'Option 1' }];
}

export function OptionListSetting({ def, value, onChange }: OptionListSettingProps) {
    const options = getValidOptions(value);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = options.findIndex((item) => item.id === active.id);
            const newIndex = options.findIndex((item) => item.id === over.id);
            onChange(arrayMove(options, oldIndex, newIndex));
        }
    };

    const addOption = () => {
        const newId = `opt_${Date.now()}`;
        onChange([...options, { id: newId, label: `Option ${options.length + 1}`, value: `Option ${options.length + 1}` }]);
    };

    const removeOption = (id: string) => {
        onChange(options.filter(o => o.id !== id));
    };

    const updateOption = (id: string, newLabel: string) => {
        onChange(options.map(o => o.id === id ? { ...o, label: newLabel, value: newLabel } : o));
    };

    return (
        <div className="flex flex-col gap-3">
            <label className="text-xs font-medium text-[#8B8FA8]">{def.label}</label>
            
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={options.map(o => o.id)} strategy={verticalListSortingStrategy}>
                    <div className="flex flex-col gap-2">
                        {options.map((option) => (
                            <SortableOptionItem 
                                key={option.id} 
                                option={option} 
                                onUpdate={updateOption} 
                                onRemove={removeOption} 
                                canRemove={options.length > 1}
                            />
                        ))}
                    </div>
                </SortableContext>
            </DndContext>

            <button 
                className="flex items-center gap-2 text-xs text-[#8B8FA8] hover:text-white transition-colors bg-[rgba(255,255,255,0.02)] hover:bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.05)] rounded p-2 justify-center mt-1"
                onClick={addOption}
            >
                <Plus size={14} /> Add Option
            </button>
        </div>
    );
}

function SortableOptionItem({ option, onUpdate, onRemove, canRemove }: any) {
    const {
        attributes,
        listeners,
        setNodeRef,
        setActivatorNodeRef,
        transform,
        transition,
    } = useSortable({ id: option.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div ref={setNodeRef} style={style} className="flex items-center gap-2 group">
            <div 
                ref={setActivatorNodeRef}
                {...attributes}
                {...listeners}
                className="cursor-grab text-[#4A4D65] hover:text-white"
            >
                <GripVertical size={16} />
            </div>
            <input 
                type="text"
                className="flex-1 bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.07)] text-white rounded-md p-2 text-sm focus:outline-none focus:border-[#D93025] focus:ring-1 focus:ring-[#D93025] transition-all"
                value={option.label}
                onChange={(e) => onUpdate(option.id, e.target.value)}
            />
            {canRemove && (
                <button 
                    className="text-[#4A4D65] hover:text-[#D93025] p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => onRemove(option.id)}
                >
                    <X size={16} />
                </button>
            )}
        </div>
    );
}
