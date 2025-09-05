import { useState, useEffect } from 'react'
import Header from './Header'
import EventList from './EventList'
import EventForm from './EventForm'
import EventFilter from './EventFilter'
import apiService from '../api.js'
import './EventManagement.css'

function EventManagement({ onLogout, onNavigate, currentUser }) {
  const [events, setEvents] = useState([])
  const [allEvents, setAllEvents] = useState([]) // Keep original list for filtering
  const [selected, setSelected] = useState(null)
  const [isFiltering, setIsFiltering] = useState(false)
  const [activeFilter, setActiveFilter] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10) // 5 columns × 2 rows = 10 events per page
  const [userRegistrations, setUserRegistrations] = useState([])
  const [form, setForm] = useState({ 
    eventName: '', 
    eventDescription: '', 
    eventAvailability: 0,
    eventStartDate: ''
  })

  useEffect(() => {
    loadEvents()
    if (currentUser?.customerId) {
      loadUserRegistrations()
    }
  }, [currentUser])

  const loadEvents = async () => {
    try {
      const data = await apiService.getAllEvents()
      setEvents(data)
      setAllEvents(data)
      setActiveFilter(null)
    } catch (error) {
      console.error('Error loading events:', error)
    }
  }

  const loadUserRegistrations = async () => {
    try {
      if (currentUser?.customerId) {
        const registrations = await apiService.getMyRegistrations(currentUser.customerId)
        setUserRegistrations(registrations)
      }
    } catch (error) {
      console.error('Error loading user registrations:', error)
    }
  }

  const selectEvent = async (id) => {
    if (selected === id) {
      console.log('Deselecting event:', id)
      setSelected(null)
      clearForm()
    } else {
      console.log('Selecting event:', id)
      setSelected(id)
      try {
        const event = await apiService.getEvent(id)
        setForm({ 
          eventName: event.eventName, 
          eventDescription: event.eventDescription, 
          eventAvailability: event.eventAvailability,
          eventStartDate: event.eventStartDate
        })
      } catch (error) {
        console.error('Error fetching event:', error)
        // Fallback to finding in the list
        const event = events.find(e => (e._id || e.id) === id)
        if (event) {
          setForm({ 
            eventName: event.eventName, 
            eventDescription: event.eventDescription, 
            eventAvailability: event.eventAvailability,
            eventStartDate: event.eventStartDate
          })
        }
      }
    }
  }

  const clearForm = () => {
    setForm({ 
      eventName: '', 
      eventDescription: '', 
      eventAvailability: 0,
      eventStartDate: ''
    })
  }

  const save = async () => {
    try {
      if (selected) {
        console.log('Updating event:', selected, form)
        await apiService.updateEvent(selected, form)
      } else {
        console.log('Adding new event:', form)
        await apiService.createEvent(form)
      }
      await loadEvents()
      setSelected(null)
      clearForm()
    } catch (error) {
      console.error('Error saving event:', error)
    }
  }

  const deleteEvent = async () => {
    try {
      console.log('Deleting event:', selected)
      await apiService.deleteEvent(selected)
      await loadEvents()
      setSelected(null)
      clearForm()
    } catch (error) {
      console.error('Error deleting event:', error)
    }
  }

  const cancel = () => {
    console.log('Cancelling operation')
    setSelected(null)
    clearForm()
  }

  // Pagination helper functions
  const getPaginatedEvents = () => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return events.slice(startIndex, endIndex)
  }

  const getTotalPages = () => {
    return Math.ceil(events.length / itemsPerPage)
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
    setSelected(null) // Clear selection when changing pages
    clearForm()
  }

  const handleFilter = async (filterType, filterValue) => {
    setIsFiltering(true)
    try {
      let filteredData
      
      switch (filterType) {
        case 'name':
          filteredData = allEvents.filter(event => 
            event.eventName.toLowerCase().includes(filterValue.toLowerCase())
          )
          break
        case 'description':
          filteredData = allEvents.filter(event => 
            event.eventDescription && event.eventDescription.toLowerCase().includes(filterValue.toLowerCase())
          )
          break
        case 'availability':
          filteredData = allEvents.filter(event => 
            event.eventAvailability === parseInt(filterValue)
          )
          break
        case 'date':
          filteredData = allEvents.filter(event => 
            event.eventStartDate && event.eventStartDate.includes(filterValue)
          )
          break
        case 'attributes':
          filteredData = allEvents.filter(event => {
            return Object.entries(filterValue).every(([key, value]) => {
              if (typeof value === 'number') {
                return event[key] === value;
              }
              return event[key] && event[key].toString().toLowerCase().includes(value.toString().toLowerCase());
            });
          })
          break
        default:
          throw new Error('Unknown filter type')
      }
      
      setEvents(filteredData)
      setActiveFilter({ type: filterType, value: filterValue })
      setCurrentPage(1) // Reset to first page when filtering
      setSelected(null) // Clear selection when filtering
      clearForm()
    } catch (error) {
      console.error('Error filtering events:', error)
      alert('Error filtering events: ' + error.message)
    } finally {
      setIsFiltering(false)
    }
  }

  const handleClearFilter = () => {
    setEvents(allEvents)
    setActiveFilter(null)
    setCurrentPage(1) // Reset to first page when clearing filters
    setSelected(null)
    clearForm()
  }

  const handleRegisterForEvent = async (customerId, eventId, eventName) => {
    try {
      await apiService.registerForEvent(customerId, eventId, eventName)
      await loadUserRegistrations() // Refresh registrations
      alert(`Successfully registered for "${eventName}"!`)
    } catch (error) {
      console.error('Error registering for event:', error)
      alert('Failed to register for event. Please try again.')
    }
  }

  const handleUnregisterFromEvent = async (customerId, eventId) => {
    try {
      await apiService.unregisterFromEvent(customerId, eventId)
      await loadUserRegistrations() // Refresh registrations
      alert('Successfully unregistered from event!')
    } catch (error) {
      console.error('Error unregistering from event:', error)
      alert('Failed to unregister from event. Please try again.')
    }
  }

  return (
    <div>
      <Header 
        onLogout={onLogout} 
        currentView="events" 
        onNavigate={onNavigate} 
      />
      
      {/* Filter section */}
      <div className="filter-container">
        <EventFilter 
          onFilter={handleFilter}
          onClearFilter={handleClearFilter}
          isFiltering={isFiltering}
        />
      </div>
      
      {/* Event list and form */}
      <div className="container">
        <EventList 
          events={getPaginatedEvents()}
          totalEvents={events.length}
          selectedEventId={selected}
          onSelectEvent={selectEvent}
          activeFilter={activeFilter}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          totalPages={getTotalPages()}
          onPageChange={handlePageChange}
          onClearFilter={handleClearFilter}
          onRegisterForEvent={handleRegisterForEvent}
          onUnregisterFromEvent={handleUnregisterFromEvent}
          userRegistrations={userRegistrations}
          currentCustomerId={currentUser?.customerId}
        />
        <EventForm
          form={form}
          onFormChange={setForm}
          isEditing={!!selected}
          onSave={save}
          onDelete={deleteEvent}
          onCancel={cancel}
          hasSelection={!!selected}
        />
      </div>
    </div>
  )
}

export default EventManagement
