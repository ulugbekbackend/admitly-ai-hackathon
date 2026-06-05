import { useState, useEffect } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { Zap, Check, Coins, ArrowRight, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/hooks/useAuth'
import { authApi } from '@/api/auth'
import PaymentModal from '@/components/pricing/PaymentModal'

const CREDIT_PACKS = [
  { amount: 10, label: '10 kredit', price: '9 900 soʻm', desc: 'Bir necha esse uchun' },
  { amount: 20, label: '20 kredit', price: '17 900 soʻm', badge: 'Mashhur', desc: 'Eng ommabop' },
  { amount: 50, label: '50 kredit', price: '39 900 soʻm', desc: "Ko'p esse uchun" },
]

// modal type: 'upgrade' | { amount: number }
export default function PricingPage() {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const isPremium = user?.plan === 'premium'
  const [modal, setModal] = useState(null) // null | 'upgrade' | number(amount)
  useEffect(() => { document.title = 'Tariflar | Admitly' }, [])

  const upgradeMutation = useMutation({
    mutationFn: () => authApi.upgradePlan(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['me'] })
      setModal(null)
      toast.success('Premium tarifga muvaffaqiyatli oʻtildingiz!')
    },
    onError: (err) => toast.error(err?.response?.data?.detail || 'Xatolik yuz berdi'),
  })

  const buyMutation = useMutation({
    mutationFn: (amount) => authApi.buyCredits(amount),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['me'] })
      setModal(null)
      toast.success(data.data.detail)
    },
    onError: (err) => toast.error(err?.response?.data?.detail || 'Xatolik yuz berdi'),
  })

  const handleModalConfirm = () => {
    if (modal === 'upgrade') upgradeMutation.mutate()
    else buyMutation.mutate(modal)
  }

  const isPending = upgradeMutation.isPending || buyMutation.isPending

  const modalTitle = modal === 'upgrade'
    ? 'Premium tarif — $9.99/oy'
    : `${modal} kredit sotib olish`
  const modalSub = modal === 'upgrade'
    ? '100 kredit / oy · AI tahlil chegirasiz'
    : CREDIT_PACKS.find((p) => p.amount === modal)?.price || ''
  const modalPrice = modal === 'upgrade'
    ? '$9.99'
    : CREDIT_PACKS.find((p) => p.amount === modal)?.price || ''

  return (
    <>
      {modal !== null && (
        <PaymentModal
          title={modalTitle}
          subtitle={modalSub}
          price={modalPrice}
          onClose={() => setModal(null)}
          onConfirm={handleModalConfirm}
          isPending={isPending}
        />
      )}

      <div className="max-w-4xl space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tariflar</h1>
          <p className="text-sm text-gray-500 mt-1">
            Joriy tarif: <span className="font-medium">{isPremium ? 'Premium' : 'Bepul'}</span>
            {' · '}
            Qolgan kredit: <span className="font-semibold text-blue-600">{user?.credits ?? 0}</span>
          </p>
        </div>

        {/* Plan cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Card className={`relative ${!isPremium ? 'border-blue-300 ring-1 ring-blue-200' : ''}`}>
            {!isPremium && (
              <span className="absolute -top-2.5 left-4 text-xs font-semibold bg-blue-600 text-white px-2.5 py-0.5 rounded-full">
                Joriy tarif
              </span>
            )}
            <CardHeader>
              <CardTitle className="text-lg">Bepul</CardTitle>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                $0 <span className="text-sm font-normal text-gray-500">/oy</span>
              </p>
            </CardHeader>
            <CardContent>
              <FeatureList items={[
                "5 ta kredit (roʻyxatdan oʻtishda)",
                '1 esse tahlili = 1 kredit',
                "Barcha dasturlar koʻrinishi",
                "Hujjatlar roʻyxati",
                'Profil va ball hisoblash',
              ]} />
            </CardContent>
          </Card>

          <Card className={`relative border-amber-300 ${isPremium ? 'ring-1 ring-amber-300' : 'bg-gradient-to-b from-amber-50 to-white'}`}>
            <span className="absolute -top-2.5 left-4 text-xs font-semibold bg-amber-500 text-white px-2.5 py-0.5 rounded-full">
              {isPremium ? 'Joriy tarif' : 'Tavsiya etiladi'}
            </span>
            <CardHeader>
              <div className="flex items-center gap-2">
                <CardTitle className="text-lg">Premium</CardTitle>
                <Zap size={16} className="text-amber-500" />
              </div>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                $9.99 <span className="text-sm font-normal text-gray-500">/oy</span>
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <FeatureList items={[
                '100 kredit / oy',
                "Siqilmagan AI tahlil",
                "Barcha bepul xususiyatlar",
                "Ustuvor qoʻllab-quvvatlash",
                "Kelajakdagi xususiyatlarga erta kirish",
              ]} />
              {!isPremium && (
                <Button
                  onClick={() => setModal('upgrade')}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-white gap-2"
                >
                  <Zap size={15} /> Premium olish <ArrowRight size={14} />
                </Button>
              )}
              {isPremium && (
                <p className="text-sm text-amber-700 font-medium text-center">
                  Siz Premium foydalanuvchisiz!
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Credit packs */}
        {!isPremium && (
          <div className="space-y-4">
            <div>
              <h2 className="text-base font-semibold text-gray-800">Kredit toʻplami sotib olish</h2>
              <p className="text-sm text-gray-500 mt-0.5">
                Demo rejim — karta maʼlumotlarini kiriting va kredit qoʻshiladi
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {CREDIT_PACKS.map(({ amount, label, price, badge, desc }) => (
                <Card key={amount} className={`relative text-center ${badge ? 'border-blue-300 shadow-md' : ''}`}>
                  {badge && (
                    <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-xs font-semibold bg-blue-600 text-white px-2.5 py-0.5 rounded-full whitespace-nowrap">
                      {badge}
                    </span>
                  )}
                  <CardContent className="pt-6 space-y-3">
                    <div className="flex items-center justify-center gap-1.5 text-blue-600">
                      <Coins size={22} />
                      <span className="text-3xl font-bold">{amount}</span>
                    </div>
                    <p className="text-xs text-gray-400">{desc}</p>
                    <p className="text-base font-semibold text-gray-900">{price}</p>
                    <Button
                      className="w-full"
                      variant={badge ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setModal(amount)}
                    >
                      Sotib olish
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  )
}

function FeatureList({ items }) {
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2 text-sm text-gray-700">
          <Check size={15} className="text-green-500 mt-0.5 shrink-0" />
          {item}
        </li>
      ))}
    </ul>
  )
}
