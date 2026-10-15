
import { useState } from 'react'

function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(e) {
    e.preventDefault()

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setError('')
    console.log('Register form submitted')
    console.log('Email:', email)
  }

  return (
    <article className="post">
      <header>
        <div className="title">
          <h2>Register</h2>
          <p>Create your MakerHub account</p>
        </div>
      </header>

      <form onSubmit={handleSubmit}>
        <div className="row gtr-uniform">

          <div className="col-12">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="col-12">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
              required
            />
          </div>

          <div className="col-12">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              minLength={6}
              required
            />
          </div>

          {error && (
            <div className="col-12">
              <p style={{ color: 'red' }}>{error}</p>
            </div>
          )}

          <div className="col-12">
            <button type="submit" className="button large">
              Register
            </button>
          </div>

        </div>
      </form>
    </article>
  )
}

export default Register
