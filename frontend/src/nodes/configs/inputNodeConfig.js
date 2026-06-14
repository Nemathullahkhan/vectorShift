export const inputNodeConfig = {
  title:       'Input',
  type:        'customInput',
  width:       210,
  bgColor:     '#eff6ff',
  borderColor: '#3b82f6',
  titleColor:  '#1d4ed8',

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
    { id: 'value', label: 'Value', color: '#3b82f6' },
  ],
};