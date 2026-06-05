import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { authApi } from '@/api/auth'
import { useAuth } from '@/hooks/useAuth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { Loader2 } from 'lucide-react'

const schema = z.object({
  full_name: z.string().min(2, 'Ism kamida 2 ta harf'),
  gpa: z.string().optional().refine(
    (v) => !v || (!isNaN(parseFloat(v)) && parseFloat(v) >= 0 && parseFloat(v) <= 5),
    { message: 'GPA 0–5 orasida' }
  ),
  ielts_score: z.string().optional().refine(
    (v) => !v || (!isNaN(parseFloat(v)) && parseFloat(v) >= 0 && parseFloat(v) <= 9),
    { message: 'IELTS 0–9 orasida' }
  ),
  experience_years: z.string().optional().refine(
    (v) => !v || (!isNaN(parseInt(v)) && parseInt(v) >= 0),
    { message: 'Musbat son kiriting' }
  ),
})

export default function ProfilePage() {
  const { user, userLoading } = useAuth()
  const queryClient = useQueryClient()

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  })

  useEffect(() => { document.title = 'Profil | Admitly' }, [])

  useEffect(() => {
    if (user) {
      reset({
        full_name: user.full_name || '',
        gpa: user.gpa != null ? String(user.gpa) : '',
        ielts_score: user.ielts_score != null ? String(user.ielts_score) : '',
        experience_years: user.experience_years != null ? String(user.experience_years) : '',
      })
    }
  }, [user, reset])

  const updateMutation = useMutation({
    mutationFn: (data) => authApi.updateMe(data).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['me'] })
      toast.success('Profil yangilandi!')
    },
    onError: () => toast.error('Yangilashda xatolik yuz berdi'),
  })

  const onSubmit = (data) => {
    updateMutation.mutate({
      full_name: data.full_name,
      ...(data.gpa && { gpa: data.gpa }),
      ...(data.ielts_score && { ielts_score: data.ielts_score }),
      ...(data.experience_years && { experience_years: parseInt(data.experience_years) }),
    })
  }

  if (userLoading) {
    return (
      <div className="max-w-lg space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    )
  }

  return (
    <div className="max-w-lg space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Profil</h1>
        <p className="text-sm text-gray-500 mt-0.5">{user?.email}</p>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-sm">Shaxsiy ma'lumotlar</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1">
              <Label>To'liq ism</Label>
              <Input {...register('full_name')} />
              {errors.full_name && <p className="text-xs text-red-500">{errors.full_name.message}</p>}
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1">
                <Label>GPA</Label>
                <Input type="number" step="0.01" min="0" max="5" placeholder="4.88" {...register('gpa')} />
                {errors.gpa && <p className="text-xs text-red-500">{errors.gpa.message}</p>}
              </div>
              <div className="space-y-1">
                <Label>IELTS</Label>
                <Input type="number" step="0.5" min="0" max="9" placeholder="7.0" {...register('ielts_score')} />
                {errors.ielts_score && <p className="text-xs text-red-500">{errors.ielts_score.message}</p>}
              </div>
              <div className="space-y-1">
                <Label>Tajriba (yil)</Label>
                <Input type="number" min="0" placeholder="2" {...register('experience_years')} />
                {errors.experience_years && <p className="text-xs text-red-500">{errors.experience_years.message}</p>}
              </div>
            </div>

            <Button type="submit" disabled={updateMutation.isPending} className="w-full">
              {updateMutation.isPending ? (
                <span className="flex items-center gap-2"><Loader2 size={15} className="animate-spin" />Saqlanmoqda...</span>
              ) : 'Saqlash'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
