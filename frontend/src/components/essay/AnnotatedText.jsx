import { useState } from 'react'

const LEVEL_STYLES = {
  critical: {
    bg: 'bg-red-100',
    border: 'border-b-2 border-red-500',
    tooltip: 'bg-red-600',
  },
  warning: {
    bg: 'bg-yellow-100',
    border: 'border-b-2 border-yellow-500',
    tooltip: 'bg-yellow-600',
  },
  strength: {
    bg: 'bg-green-100',
    border: 'border-b-2 border-green-500',
    tooltip: 'bg-green-600',
  },
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function buildSegments(text, annotations) {
  if (!annotations?.length) return [{ type: 'plain', content: text }]

  // Sort by first occurrence in text, longest match first for ties
  const valid = annotations
    .filter((a) => a.text && text.includes(a.text))
    .sort((a, b) => text.indexOf(a.text) - text.indexOf(b.text) || b.text.length - a.text.length)

  const segments = []
  let cursor = 0
  const used = new Set()

  for (const annotation of valid) {
    const idx = text.indexOf(annotation.text, cursor)
    if (idx === -1 || used.has(annotation.text)) continue

    if (idx > cursor) {
      segments.push({ type: 'plain', content: text.slice(cursor, idx) })
    }

    segments.push({ type: 'mark', content: annotation.text, annotation })
    used.add(annotation.text)
    cursor = idx + annotation.text.length
  }

  if (cursor < text.length) {
    segments.push({ type: 'plain', content: text.slice(cursor) })
  }

  return segments
}

function Tooltip({ annotation }) {
  const cfg = LEVEL_STYLES[annotation.level] || LEVEL_STYLES.warning
  return (
    <span
      className={`absolute bottom-full left-0 z-20 mb-1 w-64 rounded-lg ${cfg.tooltip} text-white text-xs p-2 shadow-lg pointer-events-none`}
    >
      {annotation.issue_uz || annotation.suggestion_uz || ''}
    </span>
  )
}

function Mark({ segment }) {
  const [hovered, setHovered] = useState(false)
  const cfg = LEVEL_STYLES[segment.annotation.level] || LEVEL_STYLES.warning

  return (
    <span
      className={`relative inline cursor-pointer rounded-sm px-0.5 ${cfg.bg} ${cfg.border}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {segment.content}
      {hovered && <Tooltip annotation={segment.annotation} />}
    </span>
  )
}

export default function AnnotatedText({ text, annotations = [] }) {
  const segments = buildSegments(text, annotations)

  return (
    <div className="text-sm text-gray-800 leading-7 whitespace-pre-wrap font-normal">
      {segments.map((seg, i) =>
        seg.type === 'mark' ? (
          <Mark key={i} segment={seg} />
        ) : (
          <span key={i}>{seg.content}</span>
        )
      )}
    </div>
  )
}
