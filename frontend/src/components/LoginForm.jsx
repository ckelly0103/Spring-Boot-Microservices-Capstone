import { useState } from 'react'
import './AuthForm.css'

function LoginForm({ onLogin, onSwitchToRegister }) {
  const [authForm, setAuthForm] = useState({
    email: '',
    password: ''
  })

  const handleSubmit = () => {
    onLogin(authForm.email, authForm.password)
  }

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>Login</h2>
        <label>Email</label>
        <input
          type="email"
          value={authForm.email}
          onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
          placeholder="Enter email"
        />
        
        <label>Password</label>
        <input
          type="password"
          value={authForm.password}
          onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
          placeholder="Enter password"
        />
        
        <div className="buttons">
          <button 
            className="btn primary" 
            onClick={handleSubmit}
            disabled={!authForm.email || !authForm.password}
          >
            Login
          </button>
          <button 
            className="btn secondary" 
            onClick={onSwitchToRegister}
          >
            Need an account? Register
          </button>
        </div>
      </div>
    </div>
  )
}

export default LoginForm
