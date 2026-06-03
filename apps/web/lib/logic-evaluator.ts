export type LogicOperator = 
    | 'equals' 
    | 'not_equals' 
    | 'contains' 
    | 'greater_than' 
    | 'less_than' 
    | 'is_empty' 
    | 'is_not_empty';

export interface LogicRule {
    id: string;
    sourceFieldId: string;
    operator: LogicOperator;
    value?: any;
}

export interface FieldLogic {
    action: 'show' | 'hide';
    conditionType: 'all' | 'any';
    rules: LogicRule[];
}

export function evaluateLogicRule(rule: LogicRule, fieldValue: any): boolean {
    const { operator, value } = rule;

    // Handle undefined/null as empty string for comparisons unless specifically checking for empty
    const normalizedFieldValue = fieldValue === undefined || fieldValue === null ? '' : fieldValue;

    switch (operator) {
        case 'equals':
            return String(normalizedFieldValue).toLowerCase() === String(value).toLowerCase();
        case 'not_equals':
            return String(normalizedFieldValue).toLowerCase() !== String(value).toLowerCase();
        case 'contains':
            return String(normalizedFieldValue).toLowerCase().includes(String(value).toLowerCase());
        case 'greater_than':
            return Number(normalizedFieldValue) > Number(value);
        case 'less_than':
            return Number(normalizedFieldValue) < Number(value);
        case 'is_empty':
            return normalizedFieldValue === '' || (Array.isArray(normalizedFieldValue) && normalizedFieldValue.length === 0);
        case 'is_not_empty':
            return normalizedFieldValue !== '' && (!Array.isArray(normalizedFieldValue) || normalizedFieldValue.length > 0);
        default:
            return false;
    }
}

export function evaluateLogic(logic: FieldLogic | undefined | null, formValues: Record<string, any>): boolean {
    // If no logic is defined, the field is visible by default
    if (!logic || !logic.rules || logic.rules.length === 0) {
        return true;
    }

    const { action, conditionType, rules } = logic;

    // Evaluate all rules
    const results = rules.map(rule => {
        const fieldValue = formValues[rule.sourceFieldId];
        return evaluateLogicRule(rule, fieldValue);
    });

    // Combine results based on conditionType
    const isConditionMet = conditionType === 'all' 
        ? results.every(res => res) 
        : results.some(res => res);

    // Return visibility based on action
    if (action === 'show') {
        return isConditionMet;
    } else if (action === 'hide') {
        return !isConditionMet;
    }

    return true;
}
