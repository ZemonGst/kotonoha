export type FieldSettingControlType = 
  | 'text' 
  | 'number' 
  | 'toggle' 
  | 'select' 
  | 'option-list';

export interface FieldSettingDefinition {
  id: string; // The unique ID of the setting in the registry
  label: string;
  type: FieldSettingControlType;
  path: string; // E.g., 'validation.minLength' or 'options'
  placeholder?: string;
  defaultValue?: any;
  options?: { label: string; value: string }[]; // For 'select' type
}

export type FieldSettingsConfig = FieldSettingDefinition[];
