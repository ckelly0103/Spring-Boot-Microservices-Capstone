import { useState, useEffect } from 'react'
import './App.css'
import apiService from './api.js'
import LoadingScreen from './components/LoadingScreen'
import LoginForm from './components/LoginForm'
import RegisterForm from './components/RegisterForm'
import CustomerManagement from './components/CustomerManagement'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [currentView, setCurrentView] = useState('login') //either login or register or customers (customers is main app page for authed userss)

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
      await apiService.createUser(name, email, password)
      alert('User created successfully! Please log in.')
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

  return <CustomerManagement onLogout={handleLogout} />
}

export default App
