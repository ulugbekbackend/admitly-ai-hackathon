import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

const schema = z.object({
  email: z.string().email('Email manzil noto\'g\'ri'),
  full_name: z.string().min(2, 'Ism kamida 2 ta harf'),
  password: z.string().min(8, 'Parol kamida 8 ta belgi'),
  password2: z.string().min(1, 'Parolni tasdiqlang'),
  gpa: z
    .string()
    .optional()
    .refine((v) => !v || (!isNaN(parseFloat(v)) && parseFloat(v) >= 0 && parseFloat(v) <= 4), {
      message: 'GPA 0 dan 4 gacha bo\'lishi kerak',
    }),
  ielts_score: z
    .string()
    .optional()
    .refine((v) => !v || (!isNaN(parseFloat(v)) && parseFloat(v) >= 0 && parseFloat(v) <= 9), {
      message: 'IELTS ball 0 dan 9 gacha bo\'lishi kerak',
    }),
  experience_years: z
    .string()
    .optional()
    .refine((v) => !v || (!isNaN(parseInt(v)) && parseInt(v) >= 0), {
      message: 'Tajriba yillari musbat bo\'lishi kerak',
    }),
}).refine((d) => d.password === d.password2, {
  message: 'Parollar mos kelmaydi',
  path: ['password2'],
})

export default function RegisterPage() {
  const { register: registerUser, registerPending, registerError } = useAuth()

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  })

  const onSubmit = (data) => {
    const payload = {
      email: data.email,
      full_name: data.full_name,
      password: data.password,
      password2: data.password2,
      ...(data.gpa && { gpa: data.gpa }),
      ...(data.ielts_score && { ielts_score: data.ielts_score }),
      ...(data.experience_years && { experience_years: parseInt(data.experience_years) }),
    }
    registerUser(payload, {
      onError: (err) => {
        const detail = err?.response?.data
        if (typeof detail === 'object') {
          const msg = Object.values(detail).flat().join(' ')
          toast.error(msg)
        } else {
          toast.error('Ro\'yxatdan o\'tishda xatolik yuz berdi')
        }
      },
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="text-3xl font-bold text-blue-600 mb-1">Admitly</div>
          <CardTitle className="text-xl">Ro'yxatdan o'tish</CardTitle>
          <CardDescription>
            Hisobingiz bormi? <Link to="/login" className="text-blue-600 hover:underline">Kirish</Link>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="full_name">To'liq ism</Label>
              <Input id="full_name" placeholder="Alisher Navoiy" {...register('full_name')} />
              {errors.full_name && <p className="text-xs text-red-500">{errors.full_name.message}</p>}
            </div>

            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@example.com" {...register('email')} />
              {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
            </div>

            <div className="space-y-1">
              <Label htmlFor="password">Parol</Label>
              <Input id="password" type="password" placeholder="Kamida 8 ta belgi" {...register('password')} />
              {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
            </div>

            <div className="space-y-1">
              <Label htmlFor="password2">Parolni tasdiqlang</Label>
              <Input id="password2" type="password" placeholder="••••••••" {...register('password2')} />
              {errors.password2 && <p className="text-xs text-red-500">{errors.password2.message}</p>}
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1">
                <Label htmlFor="gpa">GPA</Label>
                <Input id="gpa" type="number" step="0.01" min="0" max="4" placeholder="3.50" {...register('gpa')} />
                {errors.gpa && <p className="text-xs text-red-500">{errors.gpa.message}</p>}
              </div>
              <div className="space-y-1">
                <Label htmlFor="ielts_score">IELTS</Label>
                <Input id="ielts_score" type="number" step="0.5" min="0" max="9" placeholder="7.0" {...register('ielts_score')} />
                {errors.ielts_score && <p className="text-xs text-red-500">{errors.ielts_score.message}</p>}
              </div>
              <div className="space-y-1">
                <Label htmlFor="experience_years">Tajriba (yil)</Label>
                <Input id="experience_years" type="number" min="0" placeholder="2" {...register('experience_years')} />
                {errors.experience_years && <p className="text-xs text-red-500">{errors.experience_years.message}</p>}
              </div>
            </div>

            {registerError && !registerPending && (
              <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                {registerError?.response?.data?.detail || 'Xatolik yuz berdi. Qayta urinib ko\'ring.'}
              </p>
            )}

            <Button type="submit" className="w-full" disabled={registerPending}>
              {registerPending ? (
                <span className="flex items-center gap-2"><Spinner /> Ro'yxatdan o'tish...</span>
              ) : 'Ro\'yxatdan o\'tish'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

function Spinner() {
  return (
    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  )
}
