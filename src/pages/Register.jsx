import { useState } from "react";
import { supabase } from "../lib/supabase";

function Register() {
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setError("");

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName.trim(),
        },
      },
    });

    if (error) {
      setError(error.message);
      return;
    }

    alert(
      "Registration successful! Please check your email to confirm your account.",
    );
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
            <label htmlFor="displayName">Display Name</label>
            <input
              type="text"
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              minLength={3}
              maxLength={30}
              placeholder="e.g. NikolayDIY"
              required
            />
          </div>

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
              <p style={{ color: "red" }}>{error}</p>
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
  );
}

export default Register;
