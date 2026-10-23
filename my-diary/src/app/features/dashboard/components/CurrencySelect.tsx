import Select from 'react-select'

const customSelectStyles = {
  control: (base: any) => ({
    ...base,
    borderRadius: '9999px',
    border: 'none',
    backgroundColor: '#f3f4f6',
    boxShadow: 'none',
    padding: '4px 8px',
    minHeight: '48px',
  }),
  dropdownIndicator: (base: any) => ({
    ...base,
    color: '#6b7280',
  }),
  indicatorSeparator: () => ({
    display: 'none',
  }),
  menu: (base: any) => ({
    ...base,
    borderRadius: '12px',
    overflow: 'hidden',
  }),
}

type Props = {
  label: string
  value: any
  onChange: (val: any) => void
  options: any[]
}

export function CurrencySelect({ label, value, onChange, options }: Props) {
  return (
    <div className="flex-1">
      <label className="text-sm text-gray-500">{label}</label>

      <Select
        styles={customSelectStyles}
        options={options}
        value={value}
        onChange={onChange}
        className="mt-1"
        formatOptionLabel={(data, { context }) =>
          context === 'value'
            ? data.value // 👈 SOLO USD
            : data.label // 👈 USD - dólar
        }
      />
    </div>
  )
}