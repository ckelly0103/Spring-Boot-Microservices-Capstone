import './EventList.css'

function EventList({ 
  events, 
  totalEvents, 
  selectedEventId, 
  onSelectEvent, 
  activeFilter,
  currentPage,
  itemsPerPage,
  totalPages,
  onPageChange,
  onClearFilter,
  onRegisterForEvent,
  onUnregisterFromEvent,
  userRegistrations = [],
  currentCustomerId
}) {
  const getFilterDescription = () => {
    if (!activeFilter) return ''
    
    if (activeFilter.type === 'attributes') {
      const filters = Object.entries(activeFilter.value)
        .map(([key, value]) => `${key}: ${value}`)
        .join(', ')
      return ` (filtered by: ${filters})`
    }
    
    return ` (filtered by ${activeFilter.type}: ${activeFilter.value})`
  }

  const getPageInfo = () => {
    if (totalEvents <= itemsPerPage) {
      return `(${totalEvents} events)`
    }
    
    const start = (currentPage - 1) * itemsPerPage + 1
    const end = Math.min(currentPage * itemsPerPage, totalEvents)
    return `(${start}-${end} of ${totalEvents} events)`
  }

  const generatePageNumbers = () => {
    if (totalPages <= 1) return []
    
    const pages = []
    const maxVisiblePages = 3 
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      if (currentPage <= 2) {
        pages.push(1, 2, 3, '...', totalPages)
      } else if (currentPage >= totalPages - 1) {
        pages.push(1, '...', totalPages - 2, totalPages - 1, totalPages)
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages)
      }
    }
    
    return pages
  }

  const pageNumbers = generatePageNumbers()

  const formatDate = (dateString) => {
    if (!dateString) return 'No date'
    // Handle different date formats that might come from backend
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString()
    } catch (error) {
      return dateString // Return as-is if can't parse
    }
  }

  const isRegisteredForEvent = (eventId) => {
    return userRegistrations.some(reg => reg.eventId === eventId)
  }

  const handleRegisterClick = (event, e) => {
    e.stopPropagation() // Prevent event selection
    if (onRegisterForEvent && currentCustomerId) {
      onRegisterForEvent(currentCustomerId, event.id || event._id, event.eventName)
    }
  }

  const handleUnregisterClick = (event, e) => {
    e.stopPropagation() // Prevent event selection
    if (onUnregisterFromEvent && currentCustomerId) {
      onUnregisterFromEvent(currentCustomerId, event.id || event._id)
    }
  }

  return (
    <div className="list-section">
      <div className="list-header">
        <h2>
          Event List {getPageInfo()}
          {activeFilter && <span className="filter-indicator">{getFilterDescription()}</span>}
        </h2>
      </div>
      
      {/* Clear filter button section */}
      {activeFilter && (
        <div className="clear-filter-section">
          <button 
            className="btn secondary clear-filter-btn"
            onClick={onClearFilter}
            title="Clear all filters"
          >
            Clear Filter
          </button>
        </div>
      )}
      
      {/* Pagination section */}
      {totalPages > 1 && (
        <div className="pagination-section">
          <div className="inline-pagination">
            <button
              className={`pagination-btn ${currentPage === 1 ? 'disabled' : ''}`}
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              title="Previous page"
            >
              ‹
            </button>

            {pageNumbers.map((page, index) => (
              page === '...' ? (
                <span key={`ellipsis-${index}`} className="pagination-ellipsis">
                  ...
                </span>
              ) : (
                <button
                  key={page}
                  className={`pagination-btn page-number ${currentPage === page ? 'active' : ''}`}
                  onClick={() => onPageChange(page)}
                >
                  {page}
                </button>
              )
            ))}

            <button
              className={`pagination-btn ${currentPage === totalPages ? 'disabled' : ''}`}
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              title="Next page"
            >
              ›
            </button>
          </div>
        </div>
      )}
      <div className="events">
        {events.map(event => {
          const eventId = event._id || event.id
          const isRegistered = isRegisteredForEvent(eventId)
          
          return (
            <div
              key={eventId}
              className={`event ${selectedEventId === eventId ? 'selected' : ''} ${isRegistered ? 'registered' : ''}`}
              onClick={() => onSelectEvent(eventId)}
            >
              <div className="event-content">
                <div className="event-name">{event.eventName}</div>
                <div className="event-description">{event.eventDescription}</div>
                <div className="event-availability">Available: {event.eventAvailability}</div>
                <div className="event-date">{formatDate(event.eventStartDate)}</div>
                
                {isRegistered && (
                  <div className="registration-badge">
                    ✓ Registered
                  </div>
                )}
              </div>
              
              {currentCustomerId && (
                <div className="event-actions">
                  {isRegistered ? (
                    <button 
                      className="btn danger small"
                      onClick={(e) => handleUnregisterClick(event, e)}
                      title="Unregister from this event"
                    >
                      Unregister
                    </button>
                  ) : (
                    <button 
                      className="btn primary small"
                      onClick={(e) => handleRegisterClick(event, e)}
                      title="Register for this event"
                    >
                      Register
                    </button>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default EventList
