
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setError("");
    navigate(role === "student" ? "/student" : "/admin");
  };

  return (
    <div className="login-page">

      <div className="login-left">
        <div className="login-brand">
          <div className="brand-icon">🏠</div>
          <span>HostelHub</span>
        </div>

        <div className="login-hero">
          <span className="hero-tag">SMART HOSTEL MANAGEMENT</span>

          <h1>
            Your hostel life,
            <br />
            <span>made simpler.</span>
          </h1>

          <p>
            One platform to manage hostel applications, room
            allocations, bookings and everyday hostel activities.
          </p>

          <div className="hero-features">
            <div className="hero-feature">
              <span>🛏️</span>
              <div>
                <strong>Smart Room Management</strong>
                <small>Find and manage hostel rooms easily.</small>
              </div>
            </div>

            <div className="hero-feature">
              <span>📋</span>
              <div>
                <strong>Easy Applications</strong>
                <small>Apply and track your application status.</small>
              </div>
            </div>

            <div className="hero-feature">
              <span>🛠️</span>
              <div>
                <strong>Quick Issue Resolution</strong>
                <small>Submit complaints and track progress.</small>
              </div>
            </div>
          </div>
        </div>

        <div className="login-left-footer">
          © 2026 HostelHub. Smart living starts here.
        </div>

        <div className="decor-circle circle-one"></div>
        <div className="decor-circle circle-two"></div>
      </div>

      <div className="login-right">
        <form className="login-card" onSubmit={handleLogin}>

          <div className="mobile-logo">
            🏠
          </div>

          <div className="login-heading">
            <span>WELCOME BACK</span>
            <h2>Sign in to HostelHub</h2>
            <p>Enter your credentials to access your account.</p>
          </div>

          <div className="login-field">
            <label>Email Address</label>
            <div className="input-wrapper">
              <span>✉️</span>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="login-field">
            <label>Password</label>
            <div className="input-wrapper">
              <span>🔒</span>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <div className="login-field">
            <label>Login As</label>
            <div className="input-wrapper role-wrapper">
              <span>👤</span>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="student">Student</option>
                <option value="admin">Administrator</option>
              </select>
            </div>
          </div>

          {error && (
            <div className="login-error">
              ⚠️ {error}
            </div>
          )}

          <button type="submit" className="login-submit">
            Sign In <span>→</span>
          </button>

          <div className="login-divider">
            <span>SECURE HOSTEL ACCESS</span>
          </div>

          <p className="login-bottom-text">
            HostelHub · Smart Hostel Management System
          </p>

        </form>
      </div>

    </div>
  );
}

export default Login;
