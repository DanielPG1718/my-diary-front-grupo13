import { getFlagUrl } from '../../currency/util/currencyFlags'
import Select from 'react-select'

const customSelectStyles = {
  control: (base: any) => ({
    ...base,
    borderRadius: '14px',
    border: '1px solid #e8e8f2',
    backgroundColor: '#fafafe',
    boxShadow: 'none',
    padding: '4px 8px',
    minHeight: '48px',
  }),
  dropdownIndicator: (base: any) => ({
    ...base,
    color: '#77769a',
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
    <div className="currency-select">
      <span className="studio-field-label">{label}</span>

      <Select
        aria-label={label === 'De' ? 'Moneda de origen' : 'Moneda de destino'}
        styles={customSelectStyles}
        options={options}
        value={value}
        onChange={onChange}
        className="mt-1"
        formatOptionLabel={(data, { context }) =>
          context === 'value'
            ? <span className="currency-value"><img src={getFlagUrl(data.value)} alt="" />{data.value}</span>
            : data.label // 👈 USD - dólar
        }
      />
    </div>
  )
}
