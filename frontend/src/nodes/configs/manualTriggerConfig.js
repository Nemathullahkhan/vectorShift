export const manualTriggerConfig = {
  title:       'Manual Trigger',
  type:        'manualTrigger',
  width:       210,
  bgColor:     '#f0fdf4',
  borderColor: '#16a34a',
  titleColor:  '#15803d',
 
  fields: [
    {
      name:         'triggerName',
      label:        'Trigger Name',
      type:         'text',
      defaultValue: 'trigger_1',
      placeholder:  'Name this trigger',
    },
  ],
 
  inputHandles:  [
    
  ],
  outputHandles: [
    { id: 'trigger', label: 'Trigger', color: '#16a34a' },
  ],
};