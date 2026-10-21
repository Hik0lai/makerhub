import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate, useLocation } from "react-router-dom";
function Login() {
  const navigate = useNavigate();

  const location = useLocation();
  const from = location.state?.from;
  const redirectTo = from ? `${from.pathname}${from.search}${from.hash}` : "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      return;
    }

    navigate(redirectTo, { replace: true })
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
              name="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <div className="col-12">
              <p style={{ color: "red" }}>{error}</p>
            </div>
          )}

          <div className="col-12">
            <button type="submit" className="button large">
              Login
            </button>
          </div>
        </div>
      </form>
    </article>
  );
}

export default Login;
