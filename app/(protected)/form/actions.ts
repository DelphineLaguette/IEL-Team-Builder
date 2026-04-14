'use server'

import { getAdminDb } from '@/lib/firebase/admin'
import { getServerSession } from '@/lib/firebase/session'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export type ReflectionData = {
  leader_name: string
  email: string
  team: string
  quality_1: string
  quality_2: string
  quality_3: string
  admired_behaviours: string
  team_clear_direction: number
  team_understands_purpose: number
  team_treated_fairly: number
  team_encouraged_to_grow: number
  team_safe_to_share: number
  team_trusts_word: number
  team_feel_more: string
  p1_rating: number
  p1_evidence: string
  p2_rating: number
  p2_evidence: string
  p3_rating: number
  p3_evidence: string
  p4_rating: number
  p4_evidence: string
  p5_rating: number
  p5_evidence: string
  p6_rating: number
  p6_evidence: string
  strongest_principle: string
  main_development_area: string
  development_area_why: string
  leadership_intention: string
}

export async function saveReflection(data: ReflectionData) {
  const session = await getServerSession()
  if (!session) redirect('/login')

  await getAdminDb()
    .collection('reflections')
    .doc(session.uid)
    .set({ ...data, uid: session.uid, updated_at: new Date().toISOString() }, { merge: true })

  revalidatePath('/dashboard')
  redirect('/dashboard')
}
