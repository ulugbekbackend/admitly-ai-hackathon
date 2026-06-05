import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Loader2, Sparkles } from 'lucide-react'

export default function EssayEditor({ onAnalyze, isPending, disabled }) {
  const [text, setText] = useState('')
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0

  const handleSubmit = () => {
    if (text.trim().length < 50) return
    onAnalyze(text)
  }

  return (
    <div className="space-y-3">
      <div className="relative">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Motivatsion xatingizni shu yerga kiriting... (kamida 50 ta belgi)"
          rows={14}
          disabled={isPending || disabled}
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none disabled:opacity-60 leading-relaxed"
        />
        <div className="absolute bottom-3 right-3 text-xs text-gray-400">
          {wordCount} so'z
        </div>
      </div>

      {text.trim().length > 0 && text.trim().length < 50 && (
        <p className="text-xs text-red-500">Kamida 50 ta belgi kiriting</p>
      )}

      <Button
        onClick={handleSubmit}
        disabled={isPending || disabled || text.trim().length < 50}
        className="gap-2"
      >
        {isPending ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Tahlil qilinmoqda...
          </>
        ) : (
          <>
            <Sparkles size={16} />
            AI bilan tahlil qilish
          </>
        )}
      </Button>

      {disabled && (
        <p className="text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-md px-3 py-2">
          Avval yon paneldan dastur tanlang
        </p>
      )}
    </div>
  )
}
