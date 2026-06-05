import { useState } from 'react'
import { X, CreditCard, Lock, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

function formatCardNumber(val) {
  return val.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim()
}

function formatExpiry(val) {
  const digits = val.replace(/\D/g, '').slice(0, 4)
  if (digits.length >= 3) return digits.slice(0, 2) + '/' + digits.slice(2)
  return digits
}

export default function PaymentModal({ onClose, onConfirm, isPending, title, subtitle, price }) {
  const [card, setCard] = useState({ number: '', expiry: '', cvv: '', name: '' })
  const [errors, setErrors] = useState({})

  const validate = () => {
    const e = {}
    if (card.number.replace(/\s/g, '').length < 16) e.number = "Karta raqami to'liq emas"
    if (card.expiry.length < 5) e.expiry = 'MM/YY formatida kiriting'
    if (card.cvv.length < 3) e.cvv = "CVV to'liq emas"
    if (!card.name.trim()) e.name = 'Karta egasining ismi'
    return e
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    onConfirm()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900">{title || 'To\'lov'}</h2>
            {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400">
            <X size={18} />
          </button>
        </div>

        {/* Demo notice */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 text-xs text-amber-700">
          🔒 Demo rejim — hech qanday haqiqiy to'lov amalga oshirilmaydi
        </div>

        {/* Card preview */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl p-5 text-white shadow-lg">
          <div className="flex justify-between items-start mb-6">
            <span className="text-xs opacity-70">KREDIT KARTA</span>
            <CreditCard size={22} className="opacity-80" />
          </div>
          <p className="text-lg font-mono tracking-widest mb-4">
            {(card.number || '•••• •••• •••• ••••').padEnd(19, '•').slice(0, 19)}
          </p>
          <div className="flex justify-between text-xs opacity-80">
            <span>{card.name || 'KARTA EGASI'}</span>
            <span>{card.expiry || 'MM/YY'}</span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-1">
            <Label className="text-xs">Karta raqami</Label>
            <Input
              placeholder="0000 0000 0000 0000"
              value={card.number}
              onChange={(e) => setCard((p) => ({ ...p, number: formatCardNumber(e.target.value) }))}
              inputMode="numeric"
              className="font-mono"
            />
            {errors.number && <p className="text-xs text-red-500">{errors.number}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs">Amal qilish muddati</Label>
              <Input
                placeholder="MM/YY"
                value={card.expiry}
                onChange={(e) => setCard((p) => ({ ...p, expiry: formatExpiry(e.target.value) }))}
                inputMode="numeric"
                maxLength={5}
              />
              {errors.expiry && <p className="text-xs text-red-500">{errors.expiry}</p>}
            </div>
            <div className="space-y-1">
              <Label className="text-xs">CVV</Label>
              <Input
                placeholder="•••"
                value={card.cvv}
                onChange={(e) => setCard((p) => ({ ...p, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) }))}
                inputMode="numeric"
                type="password"
              />
              {errors.cvv && <p className="text-xs text-red-500">{errors.cvv}</p>}
            </div>
          </div>

          <div className="space-y-1">
            <Label className="text-xs">Karta egasining ismi</Label>
            <Input
              placeholder="JOHN DOE"
              value={card.name}
              onChange={(e) => setCard((p) => ({ ...p, name: e.target.value.toUpperCase() }))}
            />
            {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
          </div>

          <Button
            type="submit"
            disabled={isPending}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white gap-2 mt-1"
          >
            {isPending
              ? <><Loader2 size={15} className="animate-spin" /> Amalga oshirilmoqda...</>
              : <><Lock size={14} /> {price} To'lov qilish</>
            }
          </Button>
        </form>
      </div>
    </div>
  )
}
