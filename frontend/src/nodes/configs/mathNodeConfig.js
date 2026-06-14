export const mathNodeConfig = {
  title:       'Math',
  type:        'math',
  width:       210,
  bgColor:     '#fdf4ff',
  borderColor: '#c026d3',
  titleColor:  '#a21caf',
 
  fields: [
    {
      name:         'operation',
      label:        'Operation',
      type:         'select',
      defaultValue: 'add',
      options:      ['add', 'subtract', 'multiply', 'divide', 'power', 'sqrt'],
    },
    {
      name:         'decimalPlaces',
      label:        'Decimal Places',
      type:         'text',
      defaultValue: '2',
      placeholder:  '0 – 10',
    },
  ],
 
  inputHandles: [
    { id: 'a', label: 'A', color: '#c026d3' },
    { id: 'b', label: 'B', color: '#c026d3' },
  ],
  outputHandles: [
    { id: 'result', label: 'Result', color: '#c026d3' },
  ],
};