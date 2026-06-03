import React, { useState } from "react";
import { FormBuilderField, useFormBuilderStore } from "~/stores/formBuilderStore";
import { FieldLogic, LogicRule, LogicOperator } from "~/lib/logic-evaluator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { HelpTooltip } from "~/components/ui/help-tooltip";
import { Trash2, Plus } from "lucide-react";

interface LogicSettingProps {
    selectedField: FormBuilderField;
}

const OPERATORS: { value: LogicOperator; label: string }[] = [
    { value: 'equals', label: 'Equals' },
    { value: 'not_equals', label: 'Does not equal' },
    { value: 'contains', label: 'Contains' },
    { value: 'greater_than', label: 'Greater than' },
    { value: 'less_than', label: 'Less than' },
    { value: 'is_empty', label: 'Is empty' },
    { value: 'is_not_empty', label: 'Is not empty' },
];

export function LogicSetting({ selectedField }: LogicSettingProps) {
    const store = useFormBuilderStore();
    const allFields = store.fields.filter(f => f.id !== selectedField.id);
    
    const configLogic = selectedField.config?.logic as Partial<FieldLogic>;
    const currentLogic: FieldLogic = {
        action: configLogic?.action || 'show',
        conditionType: configLogic?.conditionType || 'all',
        rules: configLogic?.rules || []
    };

    const updateLogic = (newLogic: FieldLogic) => {
        const newConfig = { ...selectedField.config, logic: newLogic };
        store.updateField(selectedField.id, { config: newConfig });
    };

    const addRule = () => {
        if (allFields.length === 0) return;
        
        const newRule: LogicRule = {
            id: crypto.randomUUID(),
            sourceFieldId: allFields[0]!.id,
            operator: 'equals',
            value: ''
        };
        
        updateLogic({
            ...currentLogic,
            rules: [...currentLogic.rules, newRule]
        });
    };

    const removeRule = (ruleId: string) => {
        updateLogic({
            ...currentLogic,
            rules: currentLogic.rules.filter(r => r.id !== ruleId)
        });
    };

    const updateRule = (ruleId: string, updates: Partial<LogicRule>) => {
        updateLogic({
            ...currentLogic,
            rules: currentLogic.rules.map(r => r.id === ruleId ? { ...r, ...updates } : r)
        });
    };

    const renderValueInput = (rule: LogicRule) => {
        const sourceField = allFields.find(f => f.id === rule.sourceFieldId);
        
        if (!sourceField) return null;

        // No value needed for empty checks
        if (rule.operator === 'is_empty' || rule.operator === 'is_not_empty') {
            return null;
        }

        // Dropdown for fields with predefined options
        if (['select', 'radio', 'checkbox_group'].includes(sourceField.type)) {
            const options = (sourceField.config?.options as any[]) || [];
            return (
                <Select 
                    value={rule.value?.toString() || ""} 
                    onValueChange={(val) => updateRule(rule.id, { value: val })}
                >
                    <SelectTrigger className="w-full bg-[rgba(255,255,255,0.04)] border-[rgba(255,255,255,0.07)] text-white hover:bg-[rgba(255,255,255,0.08)] cursor-pointer outline-none focus:ring-1 focus:ring-[#D93025] focus:border-[#D93025] h-9 text-xs">
                        <SelectValue placeholder="Select value..." />
                    </SelectTrigger>
                    <SelectContent className="bg-[#131422] border-[rgba(255,255,255,0.1)] text-white">
                        {options.map((opt: any) => (
                            <SelectItem 
                                key={opt.value} 
                                value={opt.value} 
                                className="cursor-pointer hover:bg-[rgba(255,255,255,0.05)] focus:bg-[rgba(255,255,255,0.05)] focus:text-white text-xs"
                            >
                                {opt.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            );
        }

        // Dropdown for yes/no
        if (sourceField.type === 'yes_no') {
            const yesLabel = (sourceField.config?.yesLabel as string) || "Yes";
            const noLabel = (sourceField.config?.noLabel as string) || "No";
            return (
                <Select 
                    value={rule.value?.toString() || ""} 
                    onValueChange={(val) => updateRule(rule.id, { value: val })}
                >
                    <SelectTrigger className="w-full bg-[rgba(255,255,255,0.04)] border-[rgba(255,255,255,0.07)] text-white hover:bg-[rgba(255,255,255,0.08)] cursor-pointer outline-none focus:ring-1 focus:ring-[#D93025] focus:border-[#D93025] h-9 text-xs">
                        <SelectValue placeholder="Select value..." />
                    </SelectTrigger>
                    <SelectContent className="bg-[#131422] border-[rgba(255,255,255,0.1)] text-white">
                        <SelectItem value={yesLabel} className="cursor-pointer hover:bg-[rgba(255,255,255,0.05)] focus:bg-[rgba(255,255,255,0.05)] focus:text-white text-xs">{yesLabel}</SelectItem>
                        <SelectItem value={noLabel} className="cursor-pointer hover:bg-[rgba(255,255,255,0.05)] focus:bg-[rgba(255,255,255,0.05)] focus:text-white text-xs">{noLabel}</SelectItem>
                    </SelectContent>
                </Select>
            );
        }

        // Text input for others
        return (
            <input 
                type="text"
                className="w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.07)] text-white rounded-md p-2 text-xs focus:outline-none focus:border-[#D93025] focus:ring-1 focus:ring-[#D93025] transition-all h-9" 
                placeholder="Enter value..."
                value={rule.value || ""}
                onChange={(e) => updateRule(rule.id, { value: e.target.value })}
            />
        );
    };

    return (
        <div className="flex flex-col gap-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8B8FA8]">Conditional Logic</h4>
            
            <div className="flex flex-col gap-3">
                {currentLogic.rules.length > 0 ? (
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-2">
                            <Select 
                                value={currentLogic.action} 
                                onValueChange={(val: any) => updateLogic({ ...currentLogic, action: val })}
                            >
                                <SelectTrigger className="w-[100px] bg-[rgba(255,255,255,0.04)] border-[rgba(255,255,255,0.07)] text-white hover:bg-[rgba(255,255,255,0.08)] cursor-pointer outline-none focus:ring-1 focus:ring-[#D93025] focus:border-[#D93025] h-8 text-xs">
                                    <SelectValue placeholder="Action" />
                                </SelectTrigger>
                                <SelectContent className="bg-[#131422] border-[rgba(255,255,255,0.1)] text-white">
                                    <SelectItem value="show" className="cursor-pointer hover:bg-[rgba(255,255,255,0.05)] focus:bg-[rgba(255,255,255,0.05)] focus:text-white text-xs">Show</SelectItem>
                                    <SelectItem value="hide" className="cursor-pointer hover:bg-[rgba(255,255,255,0.05)] focus:bg-[rgba(255,255,255,0.05)] focus:text-white text-xs">Hide</SelectItem>
                                </SelectContent>
                            </Select>
                            <HelpTooltip content={
                                currentLogic.action === 'show' 
                                    ? "Field starts hidden.\nThe field becomes visible when the condition is true." 
                                    : "Field starts visible.\nThe field becomes hidden when the condition is true."
                            } />
                            <span className="text-xs text-[#8B8FA8]">this field if</span>
                            <Select 
                                value={currentLogic.conditionType} 
                                onValueChange={(val: any) => updateLogic({ ...currentLogic, conditionType: val })}
                            >
                                <SelectTrigger className="w-[100px] bg-[rgba(255,255,255,0.04)] border-[rgba(255,255,255,0.07)] text-white hover:bg-[rgba(255,255,255,0.08)] cursor-pointer outline-none focus:ring-1 focus:ring-[#D93025] focus:border-[#D93025] h-8 text-xs">
                                    <SelectValue placeholder="Match" />
                                </SelectTrigger>
                                <SelectContent className="bg-[#131422] border-[rgba(255,255,255,0.1)] text-white">
                                    <SelectItem value="all" className="cursor-pointer hover:bg-[rgba(255,255,255,0.05)] focus:bg-[rgba(255,255,255,0.05)] focus:text-white text-xs">All rules</SelectItem>
                                    <SelectItem value="any" className="cursor-pointer hover:bg-[rgba(255,255,255,0.05)] focus:bg-[rgba(255,255,255,0.05)] focus:text-white text-xs">Any rule</SelectItem>
                                </SelectContent>
                            </Select>
                            <span className="text-xs text-[#8B8FA8]">are met:</span>
                        </div>

                        <div className="flex flex-col gap-3 border-l-2 border-[rgba(255,255,255,0.1)] pl-3 ml-1">
                            {currentLogic.rules.map((rule, index) => (
                                <div key={rule.id} className="flex flex-col gap-2 bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] p-3 rounded-lg relative group">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-[10px] font-semibold text-[#8B8FA8] uppercase tracking-wider">Rule {index + 1}</span>
                                        <button 
                                            onClick={() => removeRule(rule.id)}
                                            className="text-[#8B8FA8] hover:text-[#D93025] transition-colors p-1"
                                            title="Remove rule"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                    
                                    <div className="flex items-center gap-2">
                                        <Select 
                                            value={rule.sourceFieldId} 
                                            onValueChange={(val) => updateRule(rule.id, { sourceFieldId: val, value: '' })}
                                        >
                                            <SelectTrigger className="w-full bg-[rgba(255,255,255,0.04)] border-[rgba(255,255,255,0.07)] text-white hover:bg-[rgba(255,255,255,0.08)] cursor-pointer outline-none focus:ring-1 focus:ring-[#D93025] focus:border-[#D93025] h-9 text-xs">
                                                <SelectValue placeholder="Select field..." />
                                            </SelectTrigger>
                                            <SelectContent className="bg-[#131422] border-[rgba(255,255,255,0.1)] text-white">
                                                {allFields.length === 0 && <SelectItem value="none" disabled className="text-xs">No other fields available</SelectItem>}
                                                {allFields.map(f => (
                                                    <SelectItem 
                                                        key={f.id} 
                                                        value={f.id} 
                                                        className="cursor-pointer hover:bg-[rgba(255,255,255,0.05)] focus:bg-[rgba(255,255,255,0.05)] focus:text-white text-xs"
                                                    >
                                                        {f.label || 'Untitled Field'}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <HelpTooltip content="The field whose value will be used to evaluate the condition." />
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Select 
                                            value={rule.operator} 
                                            onValueChange={(val: any) => updateRule(rule.id, { operator: val, value: '' })}
                                        >
                                            <SelectTrigger className="w-full bg-[rgba(255,255,255,0.04)] border-[rgba(255,255,255,0.07)] text-white hover:bg-[rgba(255,255,255,0.08)] cursor-pointer outline-none focus:ring-1 focus:ring-[#D93025] focus:border-[#D93025] h-9 text-xs">
                                                <SelectValue placeholder="Select operator..." />
                                            </SelectTrigger>
                                            <SelectContent className="bg-[#131422] border-[rgba(255,255,255,0.1)] text-white">
                                                {OPERATORS.map(op => (
                                                    <SelectItem 
                                                        key={op.value} 
                                                        value={op.value} 
                                                        className="cursor-pointer hover:bg-[rgba(255,255,255,0.05)] focus:bg-[rgba(255,255,255,0.05)] focus:text-white text-xs"
                                                    >
                                                        {op.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <HelpTooltip content="Determines how the selected value is compared." />
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <div className="flex-1">
                                            {renderValueInput(rule)}
                                        </div>
                                        {rule.operator !== 'is_empty' && rule.operator !== 'is_not_empty' && (
                                            <HelpTooltip content="The value that must match for the condition to be triggered." />
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <p className="text-xs text-[#8B8FA8] leading-relaxed">
                        This field is always visible. Add rules to show or hide it conditionally.
                    </p>
                )}

                <button 
                    onClick={addRule}
                    disabled={allFields.length === 0}
                    className="flex items-center gap-2 text-xs font-medium text-[#D93025] hover:text-[#FF4D4D] transition-colors mt-1 py-2 w-fit disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Plus size={14} />
                    Add Rule
                </button>
            </div>
        </div>
    );
}
