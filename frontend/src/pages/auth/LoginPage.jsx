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
  password: z.string().min(1, 'Parol kiritilishi shart'),
})

export default function LoginPage() {
  const { login, loginPending, loginError } = useAuth()

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  })

  const onSubmit = (data) => {
    login(data, {
      onError: (err) => {
        const msg = err?.response?.data?.detail || 'Login muvaffaqiyatsiz. Email va parolni tekshiring.'
        toast.error(msg)
      },
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="text-3xl font-bold text-blue-600 mb-1">Admitly</div>
          <CardTitle className="text-xl">Tizimga kirish</CardTitle>
          <CardDescription>Hisobingiz yo'qmi? <Link to="/register" className="text-blue-600 hover:underline">Ro'yxatdan o'ting</Link></CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                {...register('email')}
              />
              {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
            </div>

            <div className="space-y-1">
              <Label htmlFor="password">Parol</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                {...register('password')}
              />
              {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
            </div>

            {loginError && !loginPending && (
              <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                {loginError?.response?.data?.detail || 'Email yoki parol noto\'g\'ri'}
              </p>
            )}

            <Button type="submit" className="w-full" disabled={loginPending}>
              {loginPending ? (
                <span className="flex items-center gap-2">
                  <Spinner /> Kirish...
                </span>
              ) : 'Kirish'}
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
