import { getAdminDb } from '@/lib/firebase/admin'
import { getServerSession } from '@/lib/firebase/session'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import LogoutButton from './logout-button'

export const dynamic = 'force-dynamic'

const PRINCIPLES = [
  { key: 'p1', short: 'Purpose', label: 'Lead with Purpose & Clarity' },
  { key: 'p2', short: 'Values', label: 'Role-Model Our Values' },
  { key: 'p3', short: 'Standards', label: 'Set High Standards & Drive Excellence' },
  { key: 'p4', short: 'Innovation', label: 'Enable Innovation & Progress' },
  { key: 'p5', short: 'Responsibility', label: 'Act with Responsibility & Long-Term Perspective' },
  { key: 'p6', short: 'Trust', label: 'Build Trust through Accountability' },
]

type Reflection = {
  uid: string
  leader_name: string
  team: string
  email: string
  p1_rating: number
  p2_rating: number
  p3_rating: number
  p4_rating: number
  p5_rating: number
  p6_rating: number
  strongest_principle: string
  main_development_area: string
  updated_at: string
}

function RatingBar({ value }: { value: number }) {
  const pct = ((value || 0) / 5) * 100
  const color = value >= 4 ? 'bg-teal' : value >= 3 ? 'bg-pink' : 'bg-gray-300'
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs font-semibold text-navy w-4">{value || '–'}</span>
    </div>
  )
}

function avgScore(r: Reflection) {
  const vals = [r.p1_rating, r.p2_rating, r.p3_rating, r.p4_rating, r.p5_rating, r.p6_rating].filter(Boolean)
  if (!vals.length) return 0
  return vals.reduce((a, b) => a + b, 0) / vals.length
}

export default async function DashboardPage() {
  const session = await getServerSession()
  if (!session) redirect('/login')

  const snapshot = await getAdminDb()
    .collection('reflections')
    .orderBy('updated_at', 'desc')
    .get()

  const rows = snapshot.docs.map(d => d.data() as Reflection)

  const principleAvgs = PRINCIPLES.map(p => {
    const vals = rows.map(r => r[`${p.key}_rating` as keyof Reflection] as number).filter(Boolean)
    const avg = vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0
    return { ...p, avg }
  })

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <header className="bg-navy text-white py-4 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <p className="text-teal text-xs font-medium tracking-widest uppercase">IEL Pioneer Tracker</p>
            <h1 className="font-bold text-xl">Team Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/form"
              className="text-sm bg-pink text-white px-4 py-2 rounded-xl font-semibold hover:opacity-90 transition"
            >
              My Reflection
            </Link>
            <LogoutButton />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-10 space-y-10">
        {/* Principle averages */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {principleAvgs.map(p => (
            <div key={p.key} className="bg-white rounded-2xl p-4 border border-gray-200 text-center">
              <p className="text-xs text-gray-400 font-medium">{p.short}</p>
              <p className={`text-3xl font-bold mt-1 ${p.avg >= 4 ? 'text-teal' : p.avg >= 3 ? 'text-pink' : 'text-gray-400'}`}>
                {rows.length ? p.avg.toFixed(1) : '–'}
              </p>
              <p className="text-[10px] text-gray-400 mt-0.5">team avg</p>
            </div>
          ))}
        </div>

        {rows.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <p className="text-lg font-medium">No reflections submitted yet.</p>
            <p className="text-sm mt-1">Leaders will appear here once they complete the form.</p>
            <Link href="/form" className="inline-block mt-4 px-6 py-3 bg-navy text-white rounded-xl font-semibold hover:bg-navy-mid transition text-sm">
              Complete Your Reflection →
            </Link>
          </div>
        )}

        {rows.length > 0 && (
          <>
            {/* Leader cards */}
            <div>
              <h2 className="text-lg font-bold text-navy mb-4">
                Leader Submissions <span className="text-gray-400 font-normal text-base">({rows.length})</span>
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {rows.map(r => (
                  <Link
                    key={r.uid}
                    href={`/dashboard/${r.uid}`}
                    className="bg-white rounded-2xl p-5 border border-gray-200 hover:border-teal hover:shadow-sm transition group"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <p className="font-bold text-navy group-hover:text-teal transition">{r.leader_name}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{r.team}</p>
                      </div>
                      <span className={`text-lg font-bold ${avgScore(r) >= 4 ? 'text-teal' : avgScore(r) >= 3 ? 'text-pink' : 'text-gray-400'}`}>
                        {avgScore(r).toFixed(1)}
                      </span>
                    </div>

                    <div className="space-y-2">
                      {PRINCIPLES.map(p => (
                        <div key={p.key} className="flex items-center gap-2">
                          <span className="text-[10px] text-gray-400 w-20 shrink-0">{p.short}</span>
                          <RatingBar value={r[`${p.key}_rating` as keyof Reflection] as number} />
                        </div>
                      ))}
                    </div>

                    {r.strongest_principle && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">Strongest</p>
                        <p className="text-xs text-teal font-medium mt-0.5 truncate">{r.strongest_principle}</p>
                      </div>
                    )}
                  </Link>
                ))}
              </div>
            </div>

            {/* Comparison table */}
            <div>
              <h2 className="text-lg font-bold text-navy mb-4">Principle Scores by Leader</h2>
              <div className="bg-white rounded-2xl border border-gray-200 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Leader</th>
                      {PRINCIPLES.map(p => (
                        <th key={p.key} className="px-3 py-3 text-center text-xs font-semibold text-gray-400 uppercase tracking-wide">{p.short}</th>
                      ))}
                      <th className="px-3 py-3 text-center text-xs font-semibold text-gray-400 uppercase tracking-wide">Avg</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((r, i) => (
                      <tr key={r.uid} className={`border-b border-gray-50 hover:bg-gray-50 transition ${i % 2 === 0 ? '' : 'bg-gray-50/50'}`}>
                        <td className="px-5 py-3">
                          <Link href={`/dashboard/${r.uid}`} className="font-medium text-navy hover:text-teal transition">
                            {r.leader_name}
                          </Link>
                          <p className="text-xs text-gray-400">{r.team}</p>
                        </td>
                        {PRINCIPLES.map(p => {
                          const val = r[`${p.key}_rating` as keyof Reflection] as number
                          return (
                            <td key={p.key} className="px-3 py-3 text-center">
                              <span className={`font-semibold ${val >= 4 ? 'text-teal' : val >= 3 ? 'text-pink' : val > 0 ? 'text-gray-400' : 'text-gray-200'}`}>
                                {val || '–'}
                              </span>
                            </td>
                          )
                        })}
                        <td className="px-3 py-3 text-center font-bold text-navy">{avgScore(r).toFixed(1)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  )
}
