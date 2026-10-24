import { UiIcon } from '../../../shared/components/UiIcon'
import { useState, useEffect } from 'react'
import { API_LIMITS } from '../../currency/constants/currency.constants'
import { currencyService } from '../../currency/services/currency.service'
import { CurrencySelect } from '../../dashboard/components/CurrencySelect'
import { getFlagUrl } from '../../currency/util/currencyFlags'


export function CurrencyWidget() {
  const [amount, setAmount] = useState('')
  const [error, setError] = useState('')
  const [result, setResult] = useState<number | null>(null)


  const currencyNames = new Intl.DisplayNames(['es'], { type: 'currency' })

  const [options, setOptions] = useState<any[]>([])
  const [fromCurrency, setFromCurrency] = useState<any>(null)
  const [toCurrency, setToCurrency] = useState<any>(null)

  useEffect(() => {
    const loadCurrencies = async () => {
      try {
        const res: any = await currencyService.getCurrencies()
        const data = res?.data ?? res
        const list = Object.keys(data).sort()
        const opts = list.map((cur) => ({
          value: cur,
          label: `${cur} - ${currencyNames.of(cur) || cur}`
        }))
        setOptions(opts)
        if (opts.length > 0) {
          setFromCurrency(opts[0])
          setToCurrency(opts[1] || opts[0])
        }
      } catch (error) {
        console.error('Error cargando monedas', error)
      }
    }
    loadCurrencies()
  }, [])

  const handleConvert = async () => {
    if (!amount) {
      setError('Ingrese un monto')
      return
    }
    try {
      const res: any = await currencyService.convert(
        Number(amount),
        fromCurrency.value,
        toCurrency.value
      )
      const data = res?.data ?? res
      setResult(data.result)
      setError('')
    } catch (error: any) {
      setError(error?.response?.data?.message || 'Error al convertir')
    }
  }

  return (
    <section className="studio-widget currency-widget" aria-labelledby="currency-title">
      <header className="studio-widget__heading">
        <span className="studio-widget__icon studio-widget__icon--currency"><UiIcon name="currency" /></span>
        <h2 id="currency-title">Cambio de moneda</h2>
      </header>
      <div className="currency-amount">
        <label className="studio-field-label" htmlFor="currency-amount">Monto</label>
        <input id="currency-amount" type="text" inputMode="decimal" value={amount}
          onChange={(e) => {
            const value = e.target.value
            if (!/^\d*\.?\d*$/.test(value)) {
              setError('Solo números')
              return
            }
            if (Number(value) < API_LIMITS.MIN_AMOUNT && value !== '') {
              setError(`Mínimo ${API_LIMITS.MIN_AMOUNT}`)
              setAmount(value)
              return
            }
            setError('')
            setAmount(value)
          }}
          placeholder="0.00" className="studio-input currency-amount__input" />
      </div>
      <div className="currency-selectors">
        <CurrencySelect label="De" value={fromCurrency} onChange={setFromCurrency} options={options} />
        <span className="currency-direction" aria-hidden="true">⇄</span>
        <CurrencySelect label="A" value={toCurrency} onChange={setToCurrency} options={options} />
      </div>
      {error && <p className="studio-error" role="alert">{error}</p>}
      {result !== null && (
        <div className="currency-result" aria-live="polite">
          <span>Equivale a</span>
          <strong><img src={getFlagUrl(toCurrency?.value)} alt={toCurrency?.value} />
            {new Intl.NumberFormat('es-PE', { style: 'currency', currency: toCurrency.value, maximumFractionDigits: 2 }).format(result)}
          </strong>
          <div className="currency-result__meta">
            <span>{fromCurrency.value} / {toCurrency.value}</span>
            <span>Actualizado: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        </div>
      )}
      <button onClick={handleConvert} className="workspace-button currency-convert">Convertir <span aria-hidden="true">⇄</span></button>
    </section>
  )
}
