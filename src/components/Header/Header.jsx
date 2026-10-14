
function Header() {
  return (
    <header id="header">
      <h1>
        <a href="/">MakerHub</a>
      </h1>

      <nav className="links">
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/projects">Projects</a></li>
          <li><a href="/login">Login</a></li>
          <li><a href="/register">Register</a></li>
        </ul>
      </nav>
    </header>
  )
}

export default Header
