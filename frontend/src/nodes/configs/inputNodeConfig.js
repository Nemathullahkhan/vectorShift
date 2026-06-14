import { Keyboard } from 'lucide-react';

export const inputNodeConfig = {
  title:       'Input',
  type:        'customInput',
  icon:        Keyboard,
  width:       210,

  fields: [
    {
      name:         'inputName',
      label:        'Name',
      type:         'text',
      defaultValue: 'input_1',
      placeholder:  'Variable name',
    },
    {
      name:         'inputType',
      label:        'Type',
      type:         'select',
      defaultValue: 'Text',
      options:      ['Text', 'File', 'Number', 'Boolean'],
    },
  ],

  inputHandles:  [],
  outputHandles: [
    { id: 'value', label: 'Value' },
  ],
};