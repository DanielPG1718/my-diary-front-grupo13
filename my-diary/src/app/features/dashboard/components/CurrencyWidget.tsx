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
    <div className="p-6 bg-white rounded-[2rem] shadow-xl shadow-gray-100/50 border border-gray-50">

      {/* TITULO */}
  {/* TITULO */}
<div className="flex items-center gap-3 mb-6">
  <div className="flex items-center justify-center w-7 h-7 rounded-md bg-emerald-50 text-emerald-500">
    💵
  </div>

  <h2 className="text-xs font-semibold text-gray-700 tracking-wide">
    Cambio de moneda
  </h2>
</div>

      {/* SELECTS ALINEADOS */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="text-[10px] font-bold text-gray-300 uppercase ml-1">De</label>
          <CurrencySelect
            label=""
            value={fromCurrency}
            onChange={setFromCurrency}
            options={options}
          />
        </div>
        <div>
          <label className="text-[10px] font-bold text-gray-300 uppercase ml-1">A</label>
          <CurrencySelect
            label=""
            value={toCurrency}
            onChange={setToCurrency}
            options={options}
          />
        </div>
      </div>

      {/* INPUT */}
      <input
        type="text"
        value={amount}
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
        placeholder="Monto"
        className="w-full px-4 py-4 rounded-2xl border border-gray-50 bg-[#fbfcfc] mb-4 text-lg font-medium outline-none focus:border-[#d1fae5]"
      />

      {/* ERROR */}
      {error && <p className="text-red-400 text-xs mb-2 ml-1">{error}</p>}

      {/* BOTÓN: Verde */}
      <button
        onClick={handleConvert}
        className="w-full py-4 rounded-2xl bg-[#6ee7b7] text-white font-bold hover:bg-[#5cd6a5] transition-all shadow-md shadow-emerald-50"
      >
        Calcular →
      </button>

      {/* RESULTADO */}
      {result !== null && (
        /* Fondo casi blanco con un toque de verde menta (bg-[#f7fdfb]) */
        <div className="mt-6 p-6 rounded-[1.5rem] border border-[#ecfdf5] bg-[#f7fdfb] text-center">
          <p className="text-[10px] text-[#a1cfbe] font-bold tracking-[0.15em] uppercase">
            MONTO CONVERTIDO
          </p>

          <p className="text-3xl font-bold text-emerald-400 mt-3 flex items-center justify-center gap-3">
            <img
              src={getFlagUrl(toCurrency?.value)}
              alt={toCurrency?.value}
              className="w-7 h-5 rounded-sm object-cover opacity-90"
            />
            {new Intl.NumberFormat('es-PE', {
              style: 'currency',
              currency: toCurrency.value,
              maximumFractionDigits: 2,
            }).format(result)}
          </p>

          <p className="text-[11px] font-semibold text-gray-300 mt-3 uppercase tracking-tighter">
            {fromCurrency.value} / {toCurrency.value}
          </p>

          <p className="text-[10px] text-gray-300 mt-1 italic opacity-70">
            Actualizado: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
      )}
    </div>
  )
}