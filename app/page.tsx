import { redirect } from 'next/navigation'

// The proxy handles redirecting authenticated users to /dashboard.
// Unauthenticated users are sent to /login.
export default function Home() {
  redirect('/login')
}
