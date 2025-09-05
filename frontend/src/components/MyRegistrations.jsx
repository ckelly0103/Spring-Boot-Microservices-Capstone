import { useState, useEffect } from 'react'
import './MyRegistrations.css'
import apiService from '../api.js'

function MyRegistrations({ customerId, onNavigate }) {
  const [registrations, setRegistrations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (customerId) {
      loadMyRegistrations()
    }
  }, [customerId])

  const loadMyRegistrations = async () => {
    try {
      setLoading(true)
      setError(null)
      const myRegistrations = await apiService.getMyRegistrations(customerId)
      setRegistrations(myRegistrations)
    } catch (error) {
      console.error('Error loading registrations:', error)
      setError('Failed to load your registrations. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleUnregister = async (registration) => {
    if (window.confirm(`Are you sure you want to unregister from "${registration.eventName}"?`)) {
      try {
        await apiService.unregisterFromEvent(customerId, registration.eventId)
        setRegistrations(registrations.filter(reg => reg.id !== registration.id))
        alert('Successfully unregistered from event!')
      } catch (error) {
        console.error('Error unregistering:', error)
        alert('Failed to unregister from event. Please try again.')
      }
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'No date'
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString()
    } catch (error) {
      return dateString
    }
  }

  if (loading) {
    return (
      <div className="my-registrations">
        <div className="header">
          <h2>My Event Registrations</h2>
          <button className="btn secondary" onClick={() => onNavigate('events')}>
            Browse Events
          </button>
        </div>
        <div className="loading">Loading your registrations...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="my-registrations">
        <div className="header">
          <h2>My Event Registrations</h2>
          <button className="btn secondary" onClick={() => onNavigate('events')}>
            Browse Events
          </button>
        </div>
        <div className="error">{error}</div>
        <button className="btn primary" onClick={loadMyRegistrations}>
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="my-registrations">
      <div className="header">
        <h2>My Event Registrations</h2>
        <div className="header-actions">
          <button className="btn secondary" onClick={() => onNavigate('events')}>
            Browse Events
          </button>
          <button className="btn secondary" onClick={() => onNavigate('customers')}>
            Back to Customers
          </button>
        </div>
      </div>

      {registrations.length === 0 ? (
        <div className="no-registrations">
          <p>You haven't registered for any events yet.</p>
          <button className="btn primary" onClick={() => onNavigate('events')}>
            Browse Available Events
          </button>
        </div>
      ) : (
        <div className="registrations-list">
          <div className="registrations-count">
            {registrations.length} event{registrations.length !== 1 ? 's' : ''} registered
          </div>
          
          <div className="registrations-grid">
            {registrations.map(registration => (
              <div key={registration.id} className="registration-card">
                <div className="registration-header">
                  <h3>{registration.eventName}</h3>
                  <span className={`status ${registration.status}`}>
                    {registration.status}
                  </span>
                </div>
                
                <div className="registration-details">
                  <div className="detail-item">
                    <span className="label">Event ID:</span>
                    <span className="value">{registration.eventId}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Registration ID:</span>
                    <span className="value">{registration.id}</span>
                  </div>
                </div>

                <div className="registration-actions">
                  <button 
                    className="btn danger"
                    onClick={() => handleUnregister(registration)}
                  >
                    Unregister
                  </button>
                  <button 
                    className="btn secondary"
                    onClick={() => onNavigate('events')}
                  >
                    View Event Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default MyRegistrations
