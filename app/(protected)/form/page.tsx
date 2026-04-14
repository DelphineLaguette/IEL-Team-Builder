'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { saveReflection, type ReflectionData } from './actions'

const PRINCIPLES = [
  { key: 'p1', label: 'Lead with Purpose & Clarity' },
  { key: 'p2', label: 'Role-Model Our Values' },
  { key: 'p3', label: 'Set High Standards & Drive Excellence' },
  { key: 'p4', label: 'Enable Innovation & Progress' },
  { key: 'p5', label: 'Act with Responsibility & Long-Term Perspective' },
  { key: 'p6', label: 'Build Trust through Accountability' },
]

const TEAM_STATEMENTS = [
  { key: 'team_clear_direction', label: 'My team feels clear on direction' },
  { key: 'team_understands_purpose', label: 'My team understands the purpose behind our work' },
  { key: 'team_treated_fairly', label: 'My team feels treated fairly and with respect' },
  { key: 'team_encouraged_to_grow', label: 'My team feels encouraged to grow' },
  { key: 'team_safe_to_share', label: 'My team feels safe to share ideas and mistakes' },
  { key: 'team_trusts_word', label: 'My team trusts my word' },
]

const RATING_LABELS: Record<number, string> = {
  1: 'Rarely true of me today',
  2: 'Sometimes true, but inconsistent',
  3: 'Often true in my leadership',
  4: 'Strongly present and visible',
  5: 'A clear strength, consistently demonstrated',
}

const TOTAL_STEPS = 5

function RatingButton({
  value,
  selected,
  onClick,
}: {
  value: number
  selected: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all flex-1 ${
        selected
          ? 'border-teal bg-teal/10 text-navy font-semibold'
          : 'border-gray-200 bg-white text-gray-400 hover:border-gray-400'
      }`}
    >
      <span className="text-xl font-bold">{value}</span>
      <span className="text-[10px] leading-tight text-center hidden sm:block">{RATING_LABELS[value]}</span>
    </button>
  )
}

function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-2 mb-8">
      {Array.from({ length: total }, (_, i) => (
        <div key={i} className="flex items-center gap-2">
          <div
            className={`h-2 rounded-full transition-all ${
              i < current ? 'bg-teal w-8' : i === current ? 'bg-pink w-8' : 'bg-gray-200 w-6'
            }`}
          />
        </div>
      ))}
      <span className="ml-2 text-sm text-gray-400">
        Step {current + 1} of {total}
      </span>
    </div>
  )
}

function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-navy mb-1.5">{label}</label>
      {children}
    </div>
  )
}

const input =
  'w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-100 text-navy placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent transition'

const textarea =
  'w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-100 text-navy placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent transition resize-none'

type FormState = Partial<ReflectionData> & { [key: string]: string | number | undefined }

const defaultRating = 0

export default function ReflectionFormPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState<FormState>({
    leader_name: '',
    email: '',
    team: '',
    quality_1: '',
    quality_2: '',
    quality_3: '',
    admired_behaviours: '',
    team_clear_direction: defaultRating,
    team_understands_purpose: defaultRating,
    team_treated_fairly: defaultRating,
    team_encouraged_to_grow: defaultRating,
    team_safe_to_share: defaultRating,
    team_trusts_word: defaultRating,
    team_feel_more: '',
    p1_rating: defaultRating,
    p1_evidence: '',
    p2_rating: defaultRating,
    p2_evidence: '',
    p3_rating: defaultRating,
    p3_evidence: '',
    p4_rating: defaultRating,
    p4_evidence: '',
    p5_rating: defaultRating,
    p5_evidence: '',
    p6_rating: defaultRating,
    p6_evidence: '',
    strongest_principle: '',
    main_development_area: '',
    development_area_why: '',
    leadership_intention: '',
  })

  function set(key: string, value: string | number) {
    setForm(f => ({ ...f, [key]: value }))
  }

  function next() {
    setStep(s => Math.min(s + 1, TOTAL_STEPS - 1))
    window.scrollTo(0, 0)
  }

  function prev() {
    setStep(s => Math.max(s - 1, 0))
    window.scrollTo(0, 0)
  }

  async function handleSubmit() {
    setSubmitting(true)
    setError('')
    try {
      await saveReflection(form as ReflectionData)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Something went wrong')
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <header className="bg-navy text-white py-4 px-6">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div>
            <p className="text-teal text-xs font-medium tracking-widest uppercase">Leadership Tracker</p>
            <h1 className="font-bold text-lg">Leadership Reflection – Starting Point</h1>
          </div>
          <button
            onClick={() => router.push('/dashboard')}
            className="text-sm text-gray-400 hover:text-white transition"
          >
            Dashboard →
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-10">
        <StepIndicator current={step} total={TOTAL_STEPS} />

        {/* Step 0: Personal Info */}
        {step === 0 && (
          <section className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-navy">About You</h2>
              <p className="text-gray-600 text-sm mt-1">Let&apos;s start with some basic information.</p>
            </div>
            <Field label="Leader Name">
              <input className={input} value={form.leader_name} onChange={e => set('leader_name', e.target.value)} placeholder="Your full name" />
            </Field>
            <Field label="Email">
              <input className={input} type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="you@company.com" />
            </Field>
            <Field label="Team">
              <input className={input} value={form.team} onChange={e => set('team', e.target.value)} placeholder="Your team or function" />
            </Field>
          </section>
        )}

        {/* Step 1: Leadership Inspiration */}
        {step === 1 && (
          <section className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-navy">Leadership Inspiration</h2>
              <p className="text-gray-600 text-sm mt-1">Think about leaders who have inspired you.</p>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-gray-200 space-y-4">
              <p className="text-sm font-semibold text-navy">Three leadership qualities I admire</p>
              {(['quality_1', 'quality_2', 'quality_3'] as const).map((key, i) => (
                <Field key={key} label={`Quality ${i + 1}`}>
                  <input className={input} value={form[key] ?? ''} onChange={e => set(key, e.target.value)} placeholder={`e.g. ${['Empathy', 'Vision', 'Courage'][i]}`} />
                </Field>
              ))}
            </div>
            <Field label="Behaviours I admired in those leaders">
              <textarea
                className={textarea}
                rows={4}
                value={form.admired_behaviours}
                onChange={e => set('admired_behaviours', e.target.value)}
                placeholder="Describe the specific behaviours you admired…"
              />
            </Field>
          </section>
        )}

        {/* Step 2: Team Perception */}
        {step === 2 && (
          <section className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-navy">Team Perception</h2>
              <p className="text-gray-600 text-sm mt-1">
                Rate each statement from 1 (strongly disagree) to 5 (strongly agree).
              </p>
            </div>
            <div className="space-y-5">
              {TEAM_STATEMENTS.map(({ key, label }) => (
                <div key={key} className="bg-white rounded-2xl p-5 border border-gray-200">
                  <p className="text-sm font-medium text-navy mb-3">{label}</p>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map(v => (
                      <RatingButton
                        key={v}
                        value={v}
                        selected={form[key] === v}
                        onClick={() => set(key, v)}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <Field label="One thing I want my team to feel more of">
              <input className={input} value={form.team_feel_more} onChange={e => set('team_feel_more', e.target.value)} placeholder="e.g. Psychological safety, pride, belonging…" />
            </Field>
          </section>
        )}

        {/* Step 3: Leadership Principles */}
        {step === 3 && (
          <section className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-navy">Leadership Principles Self-Assessment</h2>
              <p className="text-gray-600 text-sm mt-1">
                Rate yourself on each principle and provide a brief example of what you currently do in practice.
              </p>
              <div className="mt-3 bg-navy/5 rounded-xl p-4 text-xs text-gray-600 space-y-0.5">
                {Object.entries(RATING_LABELS).map(([k, v]) => (
                  <p key={k}><strong>{k}</strong> = {v}</p>
                ))}
              </div>
            </div>
            {PRINCIPLES.map(({ key, label }) => (
              <div key={key} className="bg-white rounded-2xl p-6 border border-gray-200 space-y-4">
                <p className="font-semibold text-navy">{label}</p>
                <div>
                  <p className="text-xs text-gray-500 mb-2 font-medium">Self-rating</p>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map(v => (
                      <RatingButton
                        key={v}
                        value={v}
                        selected={form[`${key}_rating`] === v}
                        onClick={() => set(`${key}_rating`, v)}
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1.5 font-medium">Evidence – what do you currently do in practice?</p>
                  <textarea
                    className={textarea}
                    rows={3}
                    value={form[`${key}_evidence`] ?? ''}
                    onChange={e => set(`${key}_evidence`, e.target.value)}
                    placeholder="Describe a specific example…"
                  />
                </div>
              </div>
            ))}
          </section>
        )}

        {/* Step 4: Reflection Summary */}
        {step === 4 && (
          <section className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-navy">Reflection Summary</h2>
              <p className="text-gray-600 text-sm mt-1">
                Pulling it all together — your priorities and intention going forward.
              </p>
            </div>
            <Field label="Strongest principle today">
              <select
                className={input}
                value={form.strongest_principle}
                onChange={e => set('strongest_principle', e.target.value)}
              >
                <option value="">Select a principle…</option>
                {PRINCIPLES.map(p => (
                  <option key={p.key} value={p.label}>{p.label}</option>
                ))}
              </select>
            </Field>
            <Field label="Main development area">
              <select
                className={input}
                value={form.main_development_area}
                onChange={e => set('main_development_area', e.target.value)}
              >
                <option value="">Select a principle…</option>
                {PRINCIPLES.map(p => (
                  <option key={p.key} value={p.label}>{p.label}</option>
                ))}
              </select>
            </Field>
            <Field label="Why does this development area matter for me and my team?">
              <textarea
                className={textarea}
                rows={4}
                value={form.development_area_why}
                onChange={e => set('development_area_why', e.target.value)}
                placeholder="What would change for you and your team if you developed this area?"
              />
            </Field>
            <Field label="My leadership intention going forward">
              <textarea
                className={textarea}
                rows={4}
                value={form.leadership_intention}
                onChange={e => set('leadership_intention', e.target.value)}
                placeholder="What do you commit to doing differently or more consistently?"
              />
            </Field>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 rounded-lg px-4 py-2">{error}</p>
            )}
          </section>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-10">
          {step > 0 ? (
            <button
              onClick={prev}
              className="px-6 py-3 rounded-xl border border-gray-200 text-navy font-medium hover:bg-gray-100 transition"
            >
              ← Back
            </button>
          ) : (
            <div />
          )}

          {step < TOTAL_STEPS - 1 ? (
            <button
              onClick={next}
              className="px-8 py-3 bg-navy text-white font-semibold rounded-xl hover:bg-navy-mid transition"
            >
              Continue →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="px-8 py-3 bg-pink text-white font-semibold rounded-xl hover:opacity-90 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? 'Submitting…' : 'Submit Reflection'}
            </button>
          )}
        </div>
      </main>
    </div>
  )
}
