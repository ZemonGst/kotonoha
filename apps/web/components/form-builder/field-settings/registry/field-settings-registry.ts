import { FieldSettingDefinition } from './field-setting-types';

export const FieldSettingsRegistry: Record<string, FieldSettingDefinition[]> = {
  text: [
    { id: 'minLength', label: 'Minimum Length', type: 'number', path: 'validation.minLength', placeholder: 'e.g. 2' },
    { id: 'maxLength', label: 'Maximum Length', type: 'number', path: 'validation.maxLength', placeholder: 'e.g. 50' },
    { id: 'defaultValue', label: 'Default Value', type: 'text', path: 'validation.defaultValue', placeholder: 'Default text' }
  ],
  textarea: [
    { id: 'minLength', label: 'Minimum Length', type: 'number', path: 'validation.minLength', placeholder: 'e.g. 10' },
    { id: 'maxLength', label: 'Maximum Length', type: 'number', path: 'validation.maxLength', placeholder: 'e.g. 500' },
    { id: 'defaultValue', label: 'Default Value', type: 'text', path: 'validation.defaultValue', placeholder: 'Default text' }
  ],
  email: [
    { id: 'minLength', label: 'Minimum Length', type: 'number', path: 'validation.minLength' },
    { id: 'maxLength', label: 'Maximum Length', type: 'number', path: 'validation.maxLength' },
    { id: 'defaultValue', label: 'Default Value', type: 'text', path: 'validation.defaultValue', placeholder: 'example@email.com' }
  ],
  phone: [
    { id: 'minLength', label: 'Minimum Length', type: 'number', path: 'validation.minLength' },
    { id: 'maxLength', label: 'Maximum Length', type: 'number', path: 'validation.maxLength' },
    { id: 'defaultValue', label: 'Default Value', type: 'text', path: 'validation.defaultValue' }
  ],
  number: [
    { id: 'min', label: 'Minimum Value', type: 'number', path: 'validation.min' },
    { id: 'max', label: 'Maximum Value', type: 'number', path: 'validation.max' },
    { id: 'step', label: 'Step', type: 'number', path: 'validation.step', placeholder: 'e.g. 1' },
    { id: 'defaultValue', label: 'Default Value', type: 'number', path: 'validation.defaultValue' }
  ],
  select: [
    { id: 'options', label: 'Options List', type: 'option-list', path: 'options' },
    { id: 'defaultOption', label: 'Default Option', type: 'text', path: 'validation.defaultValue' }
  ],
  radio: [
    { id: 'options', label: 'Options List', type: 'option-list', path: 'options' },
    { id: 'defaultOption', label: 'Default Option', type: 'text', path: 'validation.defaultValue' },
    { id: 'layout', label: 'Layout', type: 'select', path: 'layout', options: [{label: 'Horizontal', value: 'horizontal'}, {label: 'Vertical', value: 'vertical'}], defaultValue: 'vertical' }
  ],
  checkbox: [
    { id: 'defaultChecked', label: 'Default Checked', type: 'toggle', path: 'validation.defaultValue' }
  ],
  checkbox_group: [
    { id: 'options', label: 'Options List', type: 'option-list', path: 'options' }
  ],
  yes_no: [
    { id: 'yesLabel', label: 'Yes Label', type: 'text', path: 'yesLabel', defaultValue: 'Yes' },
    { id: 'noLabel', label: 'No Label', type: 'text', path: 'noLabel', defaultValue: 'No' },
    { id: 'defaultValue', label: 'Default Value', type: 'text', path: 'validation.defaultValue' },
    { id: 'layout', label: 'Layout', type: 'select', path: 'layout', options: [{label: 'Horizontal', value: 'horizontal'}, {label: 'Vertical', value: 'vertical'}], defaultValue: 'horizontal' }
  ],
  date: [
    { id: 'dateFormat', label: 'Date Format', type: 'select', path: 'dateFormat', options: [{label: 'DD/MM/YYYY', value: 'DD/MM/YYYY'}, {label: 'MM/DD/YYYY', value: 'MM/DD/YYYY'}, {label: 'YYYY-MM-DD', value: 'YYYY-MM-DD'}], defaultValue: 'YYYY-MM-DD' },
    { id: 'minDate', label: 'Minimum Date', type: 'text', path: 'validation.minDate', placeholder: 'YYYY-MM-DD' },
    { id: 'maxDate', label: 'Maximum Date', type: 'text', path: 'validation.maxDate', placeholder: 'YYYY-MM-DD' },
    { id: 'defaultValue', label: 'Default Date', type: 'text', path: 'validation.defaultValue', placeholder: 'YYYY-MM-DD' }
  ],
  time: [
    { id: 'timeFormat', label: 'Format', type: 'select', path: 'timeFormat', options: [{label: '12 Hour', value: '12h'}, {label: '24 Hour', value: '24h'}], defaultValue: '12h' },
    { id: 'minTime', label: 'Minimum Time', type: 'text', path: 'validation.minTime', placeholder: 'e.g. 09:00' },
    { id: 'maxTime', label: 'Maximum Time', type: 'text', path: 'validation.maxTime', placeholder: 'e.g. 17:00' },
    { id: 'step', label: 'Step Interval', type: 'select', path: 'validation.step', options: [{label: '5 min', value: '5'}, {label: '10 min', value: '10'}, {label: '15 min', value: '15'}, {label: '30 min', value: '30'}], defaultValue: '15' },
    { id: 'defaultValue', label: 'Default Time', type: 'text', path: 'validation.defaultValue', placeholder: 'e.g. 12:00' }
  ],
  datetime: [
    { id: 'dateFormat', label: 'Date Format', type: 'select', path: 'dateFormat', options: [{label: 'DD/MM/YYYY', value: 'DD/MM/YYYY'}, {label: 'MM/DD/YYYY', value: 'MM/DD/YYYY'}, {label: 'YYYY-MM-DD', value: 'YYYY-MM-DD'}], defaultValue: 'YYYY-MM-DD' },
    { id: 'timeFormat', label: 'Time Format', type: 'select', path: 'timeFormat', options: [{label: '12 Hour', value: '12h'}, {label: '24 Hour', value: '24h'}], defaultValue: '12h' },
    { id: 'minDateTime', label: 'Minimum DateTime', type: 'text', path: 'validation.minDateTime' },
    { id: 'maxDateTime', label: 'Maximum DateTime', type: 'text', path: 'validation.maxDateTime' },
    { id: 'defaultValue', label: 'Default DateTime', type: 'text', path: 'validation.defaultValue' }
  ],
  password: [
    { id: 'minLength', label: 'Minimum Length', type: 'number', path: 'validation.minLength' },
    { id: 'maxLength', label: 'Maximum Length', type: 'number', path: 'validation.maxLength' },
    { id: 'requireUppercase', label: 'Require Uppercase', type: 'toggle', path: 'validation.requireUppercase' },
    { id: 'requireLowercase', label: 'Require Lowercase', type: 'toggle', path: 'validation.requireLowercase' },
    { id: 'requireNumber', label: 'Require Number', type: 'toggle', path: 'validation.requireNumber' },
    { id: 'requireSpecial', label: 'Require Special Character', type: 'toggle', path: 'validation.requireSpecial' },
    { id: 'showToggle', label: 'Show Password Toggle', type: 'toggle', path: 'showToggle', defaultValue: true }
  ]
};
