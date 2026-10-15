
import { Link } from 'react-router-dom'

function Header() {
  return (
    <header id="header">
      <h1>
        <Link to="/">MakerHub</Link>
      </h1>

      <nav className="links">
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/projects">Projects</Link></li>
          <li><Link to="/login">Login</Link></li>
          <li><Link to="/register">Register</Link></li>
        </ul>
      </nav>
    </header>
  )
}

export default Header
