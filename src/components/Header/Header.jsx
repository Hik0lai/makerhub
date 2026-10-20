
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'

function Header() {
  const { user, loading } = useAuth()
  async function handleLogout() {
  const { error } = await supabase.auth.signOut()

  if (error) {
    console.error('Logout failed:', error.message)
  }
}

  return (
    <header id="header">
      <h1>
        <Link to="/">MakerHub</Link>
      </h1>

      <nav className="links">
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/projects">Projects</Link></li>

          {!loading && (
            user ? (
        <li>
  <button
    type="button"
    onClick={handleLogout}
    className="logout-button"
  >
    Logout
  </button>
</li>
            ) : (
              <>
                <li><Link to="/login">Login</Link></li>
                <li><Link to="/register">Register</Link></li>
              </>
            )
          )}
        </ul>
      </nav>
    </header>
  )
}

export default Header
