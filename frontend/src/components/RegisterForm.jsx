import { useState } from 'react'
import './AuthForm.css'

function RegisterForm({ onRegister, onSwitchToLogin }) {
  const [authForm, setAuthForm] = useState({
    name: '',
    email: '',
    password: ''
  })

  const handleSubmit = () => {
    onRegister(authForm.name, authForm.email, authForm.password)
  }

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>Register</h2>
        <label>Name</label>
        <input
          type="text"
          value={authForm.name}
          onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })}
          placeholder="Enter name"
        />
        
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
            disabled={!authForm.name || !authForm.email || !authForm.password}
          >
            Register
          </button>
          <button 
            className="btn secondary" 
            onClick={onSwitchToLogin}
          >
            Already have an account? Login
          </button>
        </div>
      </div>
    </div>
  )
}

export default RegisterForm
