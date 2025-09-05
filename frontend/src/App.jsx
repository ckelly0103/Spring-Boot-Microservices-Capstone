import { useState, useEffect } from 'react'
import './App.css'
import apiService from './api.js'
import LoadingScreen from './components/LoadingScreen'
import LoginForm from './components/LoginForm'
import RegisterForm from './components/RegisterForm'
import CustomerManagement from './components/CustomerManagement'
import EventManagement from './components/EventManagement'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [currentView, setCurrentView] = useState('login') //login, register, customers, events

  useEffect(() => {
    checkInitialSession()
  }, [])

  const checkInitialSession = async () => {
    try {
      const result = await apiService.checkSession()
      if (result.isLoggedIn) {
        setIsLoggedIn(true)
        setCurrentView('customers')
      }
    } catch (error) {
      console.log('No active session')
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogin = async (email, password) => {
    try {
      await apiService.login(email, password)
      setIsLoggedIn(true)
      setCurrentView('customers')
    } catch (error) {
      alert('Login failed: ' + error.message)
    }
  }

  const handleRegister = async (name, email, password) => {
    try {
      await apiService.register(name, email, password)
      alert('User registered successfully! Please log in.')
      setCurrentView('login')
    } catch (error) {
      alert('Registration failed: ' + error.message)
    }
  }

  const handleLogout = async () => {
    try {
      await apiService.logout()
      setIsLoggedIn(false)
      setCurrentView('login')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }



  if (isLoading) {
    return (
      <div className="app">
        <h1 className="app-title">ADP Customer Connect</h1>
        <LoadingScreen />
      </div>
    )
  }

  if (!isLoggedIn) {
    return (
      <div className="app">
        <h1 className="app-title">ADP Customer Connect</h1>
        {currentView === 'login' ? (
          <LoginForm 
            onLogin={handleLogin}
            onSwitchToRegister={() => setCurrentView('register')}
          />
        ) : (
          <RegisterForm 
            onRegister={handleRegister}
            onSwitchToLogin={() => setCurrentView('login')}
          />
        )}
      </div>
    )
  }

  const handleNavigate = (view) => {
    setCurrentView(view)
  }

  if (currentView === 'customers') {
    return <CustomerManagement onLogout={handleLogout} onNavigate={handleNavigate} />
  }

  if (currentView === 'events') {
    return <EventManagement onLogout={handleLogout} onNavigate={handleNavigate} />
  }

  // This should not happen but fallback to customers
  return <CustomerManagement onLogout={handleLogout} onNavigate={handleNavigate} />
}

export default App
