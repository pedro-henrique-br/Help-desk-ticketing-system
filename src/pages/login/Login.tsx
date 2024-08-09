import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'

const supabase = createClient('https://zjrtoubswronpztidprq.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpqcnRvdWJzd3JvbnB6dGlkcHJxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjA0NDk2NDUsImV4cCI6MjAzNjAyNTY0NX0.ovLBcydaTQofm8BZwpM0kv4rl8i82oKgb53rhgQGwIA')

export const Login = () => {
  
  const [session, setSession] = useState(null)
  
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])
  
  if (!session) {
    return (<Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} />)
  }
  else {
    const logout = () => {
      return supabase.auth.signOut()
    }
    return (<div>Logged in!
      <button onClick={logout}>Logout</button>
    </div>)
  }
}