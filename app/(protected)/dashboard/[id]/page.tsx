import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

const PRINCIPLES = [
  { key: 'p1', label: 'Lead with Purpose & Clarity' },
  { key: 'p2', label: 'Role-Model Our Values' },
  { key: 'p3', label: 'Set High Standards & Drive Excellence' },
  { key: 'p4', label: 'Enable Innovation & Progress' },
  { key: 'p5', label: 'Act with Responsibility & Long-Term Perspective' },
  { key: 'p6', label: 'Build Trust through Accountability' },
]

const RATING_LABELS: Record<number, string> = {
  1: 'Rarely true of me today',
  2: 'Sometimes true, but inconsistent',
  3: 'Often true in my leadership',
  4: 'Strongly present and visible',
  5: 'A clear strength, consistently demonstrated',
}

const TEAM_STATEMENTS = [
  { key: 'team_clear_direction', label: 'My team feels clear on direction' },
  { key: 'team_understands_purpose', label: 'My team understands the purpose behind our work' },
  { key: 'team_treated_fairly', label: 'My team feels treated fairly and with respect' },
  { key: 'team_encouraged_to_grow', label: 'My team feels encouraged to grow' },
  { key: 'team_safe_to_share', label: 'My team feels safe to share ideas and mistakes' },
  { key: 'team_trusts_word', label: 'My team trusts my word' },
]

function RatingDots({ value }: { value: number }) {
  return (
    <div className="flex gap-1.5 items-center">
      {[1, 2, 3, 4, 5].map(i => (
        <div
          key={i}
          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
            i <= value
              ? value >= 4 ? 'bg-teal text-white' : value >= 3 ? 'bg-pink text-white' : 'bg-navy text-white'
              : 'bg-gray-200 text-gray-400'
          }`}
        >
          {i}
        </div>
      ))}
      <span className="ml-2 text-sm text-gray-500">{value ? RATING_LABELS[value] : '–'}</span>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
      <h3 className="text-sm font-bold text-navy uppercase tracking-widest border-b border-gray-100 pb-3">{title}</h3>
      {children}
    </div>
  )
}

function Row({ label, value }: { label: string; value?: string | null }) {
  return (
    <div>
      <p className="text-xs font-medium text-gray-400 mb-0.5">{label}</p>
      <p className="text-sm text-navy">{value || <span className="text-gray-300">–</span>}</p>
    </div>
  )
}

export default async function LeaderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: r } = await supabase
    .from('reflections')
    .select('*')
    .eq('id', id)
    .single()

  if (!r) notFound()

  const avgScore = PRINCIPLES.map(p => r[`${p.key}_rating`] || 0).filter(Boolean)
  const avg = avgScore.length ? avgScore.reduce((a: number, b: number) => a + b, 0) / avgScore.length : 0

  return (
    <div className="min-h-screen bg-cream">
      <header className="bg-navy text-white py-4 px-6">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div>
            <p className="text-teal text-xs font-medium tracking-widest uppercase">Leadership Tracker</p>
            <h1 className="font-bold text-xl">{r.leader_name}</h1>
            <p className="text-gray-400 text-sm">{r.team}</p>
          </div>
          <Link href="/dashboard" className="text-sm text-gray-400 hover:text-white transition">
            ← Dashboard
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-10 space-y-6">
        {/* Score summary */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-2xl p-5 border border-gray-200 text-center">
            <p className="text-xs text-gray-400">Overall Average</p>
            <p className="text-4xl font-bold text-navy mt-1">{avg.toFixed(1)}</p>
          </div>
          <div className="col-span-2 bg-white rounded-2xl p-5 border border-gray-200 space-y-2">
            {PRINCIPLES.slice(0, 3).map(p => {
              const val = r[`${p.key}_rating`] || 0
              return (
                <div key={p.key} className="flex items-center gap-3">
                  <span className="text-xs text-gray-400 w-24 shrink-0 truncate">{p.label.split('–')[0].trim()}</span>
                  <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${val >= 4 ? 'bg-teal' : val >= 3 ? 'bg-pink' : 'bg-gray-300'}`}
                      style={{ width: `${(val / 5) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-navy w-4">{val || '–'}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Personal Info */}
        <Section title="About">
          <div className="grid grid-cols-2 gap-4">
            <Row label="Name" value={r.leader_name} />
            <Row label="Email" value={r.email} />
            <Row label="Team" value={r.team} />
            <Row label="Submitted" value={new Date(r.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })} />
          </div>
        </Section>

        {/* Leadership Inspiration */}
        <Section title="Leadership Inspiration">
          <div className="space-y-3">
            <div>
              <p className="text-xs font-medium text-gray-400 mb-1">Three qualities I admire</p>
              <div className="flex flex-wrap gap-2">
                {[r.quality_1, r.quality_2, r.quality_3].filter(Boolean).map((q: string, i: number) => (
                  <span key={i} className="bg-teal/10 text-teal text-sm font-medium px-3 py-1 rounded-full">{q}</span>
                ))}
              </div>
            </div>
            <Row label="Behaviours I admired" value={r.admired_behaviours} />
          </div>
        </Section>

        {/* Team Perception */}
        <Section title="Team Perception">
          <div className="space-y-4">
            {TEAM_STATEMENTS.map(({ key, label }) => (
              <div key={key}>
                <p className="text-sm text-navy mb-1.5">{label}</p>
                <RatingDots value={r[key] || 0} />
              </div>
            ))}
            <Row label="One thing I want my team to feel more of" value={r.team_feel_more} />
          </div>
        </Section>

        {/* Principles */}
        <Section title="Leadership Principles Self-Assessment">
          <div className="space-y-6">
            {PRINCIPLES.map(({ key, label }) => (
              <div key={key} className="space-y-2">
                <p className="font-semibold text-navy text-sm">{label}</p>
                <RatingDots value={r[`${key}_rating`] || 0} />
                {r[`${key}_evidence`] && (
                  <p className="text-sm text-gray-600 bg-gray-50 rounded-xl p-3 leading-relaxed">{r[`${key}_evidence`]}</p>
                )}
              </div>
            ))}
          </div>
        </Section>

        {/* Reflection Summary */}
        <Section title="Reflection Summary">
          <div className="space-y-4">
            <div>
              <p className="text-xs font-medium text-gray-400 mb-1">Strongest principle today</p>
              <span className="bg-teal/10 text-teal text-sm font-medium px-3 py-1 rounded-full inline-block">
                {r.strongest_principle || '–'}
              </span>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-400 mb-1">Main development area</p>
              <span className="bg-pink/10 text-pink text-sm font-medium px-3 py-1 rounded-full inline-block">
                {r.main_development_area || '–'}
              </span>
            </div>
            <Row label="Why this development area matters" value={r.development_area_why} />
            <Row label="My leadership intention going forward" value={r.leadership_intention} />
          </div>
        </Section>
      </main>
    </div>
  )
}
