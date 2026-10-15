import { useState } from 'react'
function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  function handleSubmit(e) {
  e.preventDefault()

  console.log('Login form submitted')
  console.log('Email:', email)
}

  return (
    <article className="post">
      <header>
        <div className="title">
          <h2>Login</h2>
          <p>Sign in to your MakerHub account</p>
        </div>
      </header>

      <form onSubmit={handleSubmit}>
        <div className="row gtr-uniform">
          <div className="col-12">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              value = {email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="col-12">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              value = {password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="col-12">
            <button type="submit" className="button large">
              Login
            </button>
          </div>
        </div>
      </form>
    </article>
  )
}

export default Login
