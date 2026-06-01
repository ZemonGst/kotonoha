import { create } from "zustand";
import { FormDeltaTracker, FormFieldBase, SaveDeltaFunction } from "~/hooks/utils/form-delta-tracker";

export type FormBuilderField = FormFieldBase & {
    id: string;
    isNew?: boolean;
    formId?: string;
    labelKey?: string;
    createdAt?: Date;
    updatedAt?: Date;
};

interface FormBuilderState {
    formId: string | null;
    title: string;
    description: string;
    fields: FormBuilderField[];
    selectedFieldId: string | null;
    isDirty: boolean;
    isSaving: boolean;
    lastSavedAt: Date | null;
    tracker: FormDeltaTracker | null;

    initStore: (
        formId: string,
        title: string,
        description: string,
        existingFields: FormBuilderField[],
        saveFn: SaveDeltaFunction
    ) => void;
    addField: (type: string, defaultLabel: string, insertOrder?: number) => void;
    removeField: (fieldId: string) => void;
    selectField: (fieldId: string | null) => void;
    updateField: (fieldId: string, changes: Partial<FormFieldBase>) => void;
    reorderField: (fieldId: string, newOrder: number) => void;
    updateMeta: (title: string, description: string) => void;
    markClean: () => void;
    setIsSaving: (value: boolean) => void;
    updateNewIds: (newIds: Record<string, string>) => void;
}

export const useFormBuilderStore = create<FormBuilderState>((set, get) => ({
    formId: null,
    title: "",
    description: "",
    fields: [],
    selectedFieldId: null,
    isDirty: false,
    isSaving: false,
    lastSavedAt: null,
    tracker: null,

    initStore: (formId, title, description, existingFields, saveFn) => {
        const currentTracker = get().tracker;
        if (currentTracker) {
            currentTracker.destroy();
        }

        const wrappedSaveFn: SaveDeltaFunction = async (payload) => {
            get().setIsSaving(true);
            try {
                const res = await saveFn(payload);
                return res || {};
            } catch (error) {
                get().setIsSaving(false);
                throw error;
            }
        };

        const newTracker = new FormDeltaTracker(formId, wrappedSaveFn, 10000, (newIds) => {
            get().updateNewIds(newIds);
            get().setIsSaving(false);
            if (!get().tracker?.isDirty) {
                get().markClean();
            }
        });

        set({
            formId,
            title,
            description: description || "",
            fields: existingFields,
            selectedFieldId: null,
            isDirty: false,
            tracker: newTracker,
        });
    },

    addField: (type, defaultLabel, insertOrder) => {
        const { fields, tracker } = get();
        if (!tracker) return;

        const tempId = crypto.randomUUID();
        const lastField = fields[fields.length - 1];
        const newOrder = insertOrder !== undefined ? insertOrder : (lastField ? lastField.order + 1.0 : 1.0);

        const newField: FormBuilderField = {
            id: tempId,
            type,
            label: defaultLabel,
            isRequired: false,
            order: newOrder,
            config: {},
            isNew: true,
        };

        tracker.trackNewField(tempId, {
            type: newField.type,
            label: newField.label,
            isRequired: newField.isRequired,
            order: newField.order,
            config: newField.config,
        });

        set({
            fields: [...fields, newField].sort((a, b) => a.order - b.order),
            isDirty: true,
        });
    },

    removeField: (fieldId) => {
        const { fields, tracker, selectedFieldId } = get();
        if (!tracker) return;

        const fieldToRemove = fields.find((f) => f.id === fieldId);
        if (!fieldToRemove) return;

        tracker.trackDeletedField(fieldId, fieldToRemove.isNew);

        set({
            fields: fields.filter((f) => f.id !== fieldId),
            selectedFieldId: selectedFieldId === fieldId ? null : selectedFieldId,
            isDirty: true,
        });
    },

    selectField: (fieldId) => {
        set({ selectedFieldId: fieldId });
    },

    updateField: (fieldId, changes) => {
        const { fields, tracker } = get();
        if (!tracker) return;

        const fieldToUpdate = fields.find((f) => f.id === fieldId);
        if (!fieldToUpdate) return;

        tracker.trackUpdatedField(fieldId, changes, fieldToUpdate.isNew);

        set({
            fields: fields.map((f) => (f.id === fieldId ? { ...f, ...changes } : f)),
            isDirty: true,
        });
    },

    reorderField: (fieldId, newOrder) => {
        const { fields, tracker } = get();
        
        const fieldToUpdate = fields.find((f) => f.id === fieldId);
        if (!fieldToUpdate) return;

        tracker?.trackUpdatedField(fieldId, { order: newOrder }, fieldToUpdate.isNew);

        set({
            fields: fields.map((f) => (f.id === fieldId ? { ...f, order: newOrder } : f)).sort((a, b) => a.order - b.order),
            isDirty: true,
        });
    },

    updateMeta: (title, description) => {
        const { tracker } = get();
        if (!tracker) return;

        tracker.trackMetaChange({ title, description });

        set({
            title,
            description,
            isDirty: true,
        });
    },

    markClean: () => {
        set({
            isDirty: false,
            lastSavedAt: new Date(),
        });
    },

    setIsSaving: (value) => {
        set({ isSaving: value });
    },

    updateNewIds: (newIds) => {
        const { fields } = get();
        set({
            fields: fields.map(f => {
                const realId = newIds[f.id];
                if (f.isNew && realId) {
                    return { ...f, id: realId, isNew: false };
                }
                return f;
            }),
            lastSavedAt: new Date(),
        });
    },
}));
