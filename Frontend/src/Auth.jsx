import { useState } from "react";
import { api, saveSession } from "./api.js";
import "./Auth.css";

function Auth({ onAuth }) {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isSignup = mode === "signup";

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = isSignup
        ? await api.signup({ name, email, password })
        : await api.login({ email, password });
      saveSession(data.token, data.user);
      onAuth(data.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="authPage">
      <form className="authCard" onSubmit={handleSubmit}>
        <img src="/chatgpt.jpg" alt="SigmaGpt" />
        <h1>SigmaGpt</h1>
        <p>{isSignup ? "Create your account" : "Welcome back"}</p>

        {isSignup && (
          <input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        )}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={6}
          required
        />

        {error && <p className="authError">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Please wait..." : isSignup ? "Sign up" : "Log in"}
        </button>

        <p className="authSwitch">
          {isSignup ? "Already have an account?" : "New here?"}{" "}
          <button
            type="button"
            className="linkBtn"
            onClick={() => {
              setMode(isSignup ? "login" : "signup");
              setError("");
            }}
          >
            {isSignup ? "Log in" : "Sign up"}
          </button>
        </p>
      </form>
    </div>
  );
}

export default Auth;
